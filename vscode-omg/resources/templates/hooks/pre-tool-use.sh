#!/bin/bash
# OMG Pre-Tool-Use Hook
# Runs before any tool execution in VS Code Copilot Agent Mode or Copilot CLI
#
# Input sources (auto-detected):
#   VS Code:  TOOL_NAME / TOOL_INPUT / WORKSPACE environment variables
#   CLI:      JSON via stdin with toolName / toolInput / workspace fields
#
# Output JSON: {"decision": "approve"} or {"decision": "deny", "reason": "..."}

# --- Dual-mode input detection ---
# Copilot CLI passes JSON via stdin; VS Code uses environment variables.
if [ ! -t 0 ]; then
  STDIN_DATA=$(cat)
  if [ -n "$STDIN_DATA" ]; then
    TOOL_NAME=$(printf '%s' "$STDIN_DATA" | grep -oE '"toolName"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"toolName"\s*:\s*"//;s/".*//')
    TOOL_INPUT=$(printf '%s' "$STDIN_DATA" | grep -oE '"toolInput"\s*:\s*\{[^}]*\}' | head -1 | sed 's/.*"toolInput"\s*:\s*//')
    WORKSPACE=$(printf '%s' "$STDIN_DATA" | grep -oE '"workspace"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"workspace"\s*:\s*"//;s/".*//')
  fi
fi

TOOL_NAME="${TOOL_NAME:-}"
TOOL_INPUT="${TOOL_INPUT:-}"

# --- Tool name normalization ---
# Map Copilot CLI tool names to VS Code equivalents so guards work on both surfaces.
case "$TOOL_NAME" in
  edit)   TOOL_NAME="editFiles" ;;
  read)   TOOL_NAME="readFile" ;;
  shell)  TOOL_NAME="runInTerminal" ;;
  create) TOOL_NAME="createFile" ;;
  delete) TOOL_NAME="deleteFile" ;;
esac

# Guard: prevent modifications to node_modules
if echo "$TOOL_INPUT" | grep -q "node_modules"; then
  if [ "$TOOL_NAME" = "editFiles" ] || [ "$TOOL_NAME" = "createFile" ]; then
    echo '{"decision": "deny", "reason": "Modifying node_modules is not allowed. Use package.json instead."}'
    exit 0
  fi
fi

# Guard: prevent modifications to .env files with secrets
if echo "$TOOL_INPUT" | grep -qE '\.env(\.local|\.production|\.secret)?'; then
  if [ "$TOOL_NAME" = "editFiles" ] || [ "$TOOL_NAME" = "createFile" ]; then
    echo '{"decision": "deny", "reason": "Direct .env file modification blocked. Review secrets manually."}'
    exit 0
  fi
fi

# Guard: prevent deletion of critical config files
if echo "$TOOL_INPUT" | grep -qE '(package\.json|tsconfig\.json|\.gitignore)'; then
  if [ "$TOOL_NAME" = "deleteFile" ]; then
    echo '{"decision": "deny", "reason": "Cannot delete critical config files."}'
    exit 0
  fi
fi

# Guard: prevent force push
if [ "$TOOL_NAME" = "runInTerminal" ]; then
  if echo "$TOOL_INPUT" | grep -qE 'git\s+push\s+.*(--force([^a-zA-Z0-9_-]|$)|-f([^a-zA-Z0-9_-]|$))' && ! echo "$TOOL_INPUT" | grep -qE '\-\-force-with-lease'; then
    echo '{"decision": "deny", "reason": "Force push is not allowed. Use --force-with-lease if necessary."}'
    exit 0
  fi
fi

# Guard: prevent destructive git operations
if [ "$TOOL_NAME" = "runInTerminal" ]; then
  if echo "$TOOL_INPUT" | grep -qE 'git\s+(reset\s+.*--hard|clean\s+.*-[a-z]*f|checkout\s+--\s+\.)'; then
    echo '{"decision": "deny", "reason": "Destructive git operations require manual confirmation."}'
    exit 0
  fi
fi

# Default: approve (with optional checkpoint advisory)
WORKSPACE="${WORKSPACE:-$(pwd)}"
CHECKPOINT_TRIGGER="$WORKSPACE/.omg/state/checkpoint-trigger.json"

if [ -f "$CHECKPOINT_TRIGGER" ]; then
  echo '{"decision": "approve", "advisory": "⚠️ Context threshold reached. Call omg_checkpoint to save session state before continuing."}'
else
  echo '{"decision": "approve"}'
fi
