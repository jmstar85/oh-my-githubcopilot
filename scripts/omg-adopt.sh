#!/usr/bin/env bash
set -euo pipefail

# OMG adoption helper
# Modes:
#   template  - copy OMG assets from this repository into a target project
#   submodule - track OMG as a git submodule (.omg-upstream), then sync assets
#   subtree   - track OMG as a git subtree (.omg-upstream), then sync assets

usage() {
  cat <<'EOF'
Usage:
  scripts/omg-adopt.sh --target <project-path> --mode <template|submodule|subtree> [options]

Options:
  --target <path>       Target project directory (must be a git repository)
  --mode <mode>         template | submodule | subtree
  --target-env <env>    vscode | cli | both (default: both)
  --global-mcp          Install MCP config globally (~/.copilot/) instead of project-local
  --remote <url>        OMG upstream URL (default: https://github.com/jmstar85/oh-my-githubcopilot.git)
  --branch <name>       Branch name (default: main)
  --skip-build          Skip npm install/build for mcp-server
  -h, --help            Show help

Examples:
  # Template-style copy for a new project (both VS Code + CLI)
  scripts/omg-adopt.sh --target ~/work/my-new-app --mode template

  # CLI-only setup
  scripts/omg-adopt.sh --target ~/work/my-app --mode template --target-env cli

  # Track OMG updates with submodule
  scripts/omg-adopt.sh --target ~/work/my-app --mode submodule

  # Track OMG updates with subtree
  scripts/omg-adopt.sh --target ~/work/my-app --mode subtree
EOF
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OMG_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TARGET=""
MODE=""
TARGET_ENV="both"
GLOBAL_MCP=0
REMOTE="https://github.com/jmstar85/oh-my-githubcopilot.git"
BRANCH="main"
SKIP_BUILD=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      TARGET="${2:-}"
      shift 2
      ;;
    --mode)
      MODE="${2:-}"
      shift 2
      ;;
    --target-env)
      TARGET_ENV="${2:-}"
      shift 2
      ;;
    --global-mcp)
      GLOBAL_MCP=1
      shift
      ;;
    --remote)
      REMOTE="${2:-}"
      shift 2
      ;;
    --branch)
      BRANCH="${2:-}"
      shift 2
      ;;
    --skip-build)
      SKIP_BUILD=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$TARGET" || -z "$MODE" ]]; then
  echo "--target and --mode are required." >&2
  usage
  exit 1
fi

if [[ "$TARGET_ENV" != "vscode" && "$TARGET_ENV" != "cli" && "$TARGET_ENV" != "both" ]]; then
  echo "Invalid --target-env: $TARGET_ENV (must be vscode, cli, or both)" >&2
  exit 1
fi

if [[ ! -d "$TARGET" ]]; then
  echo "Target directory not found: $TARGET" >&2
  exit 1
fi

if [[ ! -d "$TARGET/.git" ]]; then
  echo "Target must be a git repository: $TARGET" >&2
  exit 1
fi

if [[ "$MODE" != "template" && "$MODE" != "submodule" && "$MODE" != "subtree" ]]; then
  echo "Invalid --mode: $MODE" >&2
  exit 1
fi

ITEMS=(
  ".github/copilot-instructions.md"
  ".github/agents"
  ".github/skills"
  ".github/hooks"
  ".github/prompts"
  ".vscode/mcp.json"
  "mcp-server"
)

prepare_upstream() {
  local upstream_dir="$TARGET/.omg-upstream"

  if [[ "$MODE" == "template" ]]; then
    echo "$OMG_ROOT"
    return
  fi

  if [[ "$MODE" == "submodule" ]]; then
    if [[ ! -d "$upstream_dir" ]]; then
      git -C "$TARGET" submodule add -b "$BRANCH" "$REMOTE" .omg-upstream
    else
      git -C "$TARGET" submodule update --init --remote .omg-upstream
    fi
    echo "$upstream_dir"
    return
  fi

  if [[ "$MODE" == "subtree" ]]; then
    if [[ ! -d "$upstream_dir" ]]; then
      git -C "$TARGET" subtree add --prefix=.omg-upstream "$REMOTE" "$BRANCH" --squash
    else
      git -C "$TARGET" subtree pull --prefix=.omg-upstream "$REMOTE" "$BRANCH" --squash
    fi
    echo "$upstream_dir"
    return
  fi
}

backup_and_replace() {
  local src_root="$1"
  local rel="$2"
  local src="$src_root/$rel"
  local dst="$TARGET/$rel"

  if [[ ! -e "$src" ]]; then
    echo "Skip missing source: $src"
    return
  fi

  local ts
  ts="$(date +%Y%m%d-%H%M%S)"
  local backup_root="$TARGET/.omg-backup/$ts"

  if [[ -e "$dst" || -L "$dst" ]]; then
    mkdir -p "$(dirname "$backup_root/$rel")"
    mv "$dst" "$backup_root/$rel"
    echo "Backed up: $rel -> .omg-backup/$ts/$rel"
  fi

  mkdir -p "$(dirname "$dst")"
  cp -R "$src" "$dst"
  echo "Applied: $rel"
}

SRC_ROOT="$(prepare_upstream)"

echo "Using source: $SRC_ROOT"

for rel in "${ITEMS[@]}"; do
  # Skip .vscode/mcp.json when CLI-only
  if [[ "$TARGET_ENV" == "cli" && "$rel" == ".vscode/mcp.json" ]]; then
    echo "Skip (cli mode): $rel"
    continue
  fi
  backup_and_replace "$SRC_ROOT" "$rel"
done

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  if [[ -f "$TARGET/mcp-server/package.json" ]]; then
    echo "Installing/building MCP server in target project..."
    (
      cd "$TARGET/mcp-server"
      npm install
      npm run build
    )
  else
    echo "Skip build: mcp-server/package.json not found"
  fi
else
  echo "Skip build requested"
fi

# --- Copilot CLI setup ---
if [[ "$TARGET_ENV" == "cli" || "$TARGET_ENV" == "both" ]]; then
  echo "Configuring Copilot CLI support..."

  # Determine MCP server path (absolute)
  MCP_SERVER_PATH="$(cd "$TARGET" && pwd)/mcp-server/dist/index.js"

  # Generate MCP config
  MCP_CONFIG_CONTENT=$(cat <<MCPEOF
{
  "mcpServers": {
    "omg-workflow": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"],
      "env": {
        "WORKSPACE_ROOT": "$(cd "$TARGET" && pwd)"
      }
    }
  }
}
MCPEOF
)

  if [[ "$GLOBAL_MCP" -eq 1 ]]; then
    MCP_DIR="$HOME/.copilot"
    mkdir -p "$MCP_DIR"
    echo "$MCP_CONFIG_CONTENT" > "$MCP_DIR/mcp-config.json"
    echo "MCP config written to: $MCP_DIR/mcp-config.json (global)"
  else
    MCP_DIR="$TARGET/.copilot"
    mkdir -p "$MCP_DIR"
    echo "$MCP_CONFIG_CONTENT" > "$MCP_DIR/mcp-config.json"
    echo "MCP config written to: $MCP_DIR/mcp-config.json (project-local)"
  fi
fi

echo
printf '%s\n' "Done. Next steps:"
if [[ "$TARGET_ENV" == "vscode" ]]; then
  printf '%s\n' "1) Open target project in VS Code as a trusted workspace"
  printf '%s\n' "2) In Copilot Chat (agent mode), run: /status"
elif [[ "$TARGET_ENV" == "cli" ]]; then
  printf '%s\n' "1) cd into the target project"
  printf '%s\n' "2) Run: copilot"
  printf '%s\n' "3) Try: /status or @omg-coordinator"
else
  printf '%s\n' "1) VS Code: Open target project as a trusted workspace, run /status in Copilot Chat"
  printf '%s\n' "2) CLI: cd into target project, run 'copilot', try /status or @omg-coordinator"
fi
printf '%s\n' "3) Commit changes in target project after verification"
