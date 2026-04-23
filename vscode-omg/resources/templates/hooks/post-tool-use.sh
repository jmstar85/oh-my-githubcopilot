#!/bin/bash
# OMG Post-Tool-Use Hook
# Runs after tool execution in VS Code Copilot Agent Mode or Copilot CLI
#
# Input sources (auto-detected):
#   VS Code:  TOOL_NAME / TOOL_INPUT / TOOL_OUTPUT / WORKSPACE environment variables
#   CLI:      JSON via stdin with toolName / toolInput / toolOutput / workspace fields
#
# Use for: logging, state updates, completion checks

# --- Dual-mode input detection ---
if [ ! -t 0 ]; then
  STDIN_DATA=$(cat)
  if [ -n "$STDIN_DATA" ]; then
    TOOL_NAME=$(printf '%s' "$STDIN_DATA" | grep -oE '"toolName"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"toolName"\s*:\s*"//;s/".*//')
    TOOL_INPUT=$(printf '%s' "$STDIN_DATA" | grep -oE '"toolInput"\s*:\s*\{[^}]*\}' | head -1 | sed 's/.*"toolInput"\s*:\s*//')
    TOOL_OUTPUT=$(printf '%s' "$STDIN_DATA" | grep -oE '"toolOutput"\s*:\s*\{[^}]*\}' | head -1 | sed 's/.*"toolOutput"\s*:\s*//')
    WORKSPACE=$(printf '%s' "$STDIN_DATA" | grep -oE '"workspace"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"workspace"\s*:\s*"//;s/".*//')
  fi
fi

TOOL_NAME="${TOOL_NAME:-}"
TOOL_INPUT="${TOOL_INPUT:-}"
TOOL_OUTPUT="${TOOL_OUTPUT:-}"
WORKSPACE="${WORKSPACE:-$(pwd)}"

# --- Tool name normalization ---
case "$TOOL_NAME" in
  edit)   TOOL_NAME="editFiles" ;;
  read)   TOOL_NAME="readFile" ;;
  shell)  TOOL_NAME="runInTerminal" ;;
  create) TOOL_NAME="createFile" ;;
  delete) TOOL_NAME="deleteFile" ;;
esac

OMG_STATE_DIR="$WORKSPACE/.omg/state"

# Ensure state directory exists
mkdir -p "$OMG_STATE_DIR" 2>/dev/null

# --- Context byte accumulation for pre-compaction checkpoint ---
# Tracks cumulative TOOL_INPUT + TOOL_OUTPUT bytes to estimate context window usage.
# When threshold is reached (default 400KB ≈ 100K tokens), creates a checkpoint trigger.
# Threshold is configurable via OMG_CONTEXT_THRESHOLD (bytes, default 400000).
CONTEXT_BYTES_FILE="$OMG_STATE_DIR/context-bytes.txt"
CHECKPOINT_TRIGGER="$OMG_STATE_DIR/checkpoint-trigger.json"
OMG_CONTEXT_THRESHOLD="${OMG_CONTEXT_THRESHOLD:-400000}"

# Measure bytes of this tool call's I/O
INPUT_BYTES=$(printf '%s' "$TOOL_INPUT" | wc -c | tr -d ' ')
OUTPUT_BYTES=$(printf '%s' "$TOOL_OUTPUT" | wc -c | tr -d ' ')
CALL_BYTES=$((INPUT_BYTES + OUTPUT_BYTES))

# Read current accumulation
# Note: read-modify-write is not atomic. Acceptable because VS Code hooks run serially.
ACCUMULATED=$(cat "$CONTEXT_BYTES_FILE" 2>/dev/null || echo 0)
ACCUMULATED=$((ACCUMULATED + CALL_BYTES))
echo "$ACCUMULATED" > "$CONTEXT_BYTES_FILE" 2>/dev/null

# Check if threshold reached — create checkpoint trigger
if [ "$ACCUMULATED" -ge "$OMG_CONTEXT_THRESHOLD" ] && [ ! -f "$CHECKPOINT_TRIGGER" ]; then
  ESTIMATED_TOKENS=$((ACCUMULATED / 4))
  echo "{\"checkpoint_due\": true, \"context_bytes\": $ACCUMULATED, \"estimated_tokens\": $ESTIMATED_TOKENS, \"threshold\": $OMG_CONTEXT_THRESHOLD, \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}" \
    > "$CHECKPOINT_TRIGGER" 2>/dev/null
fi

# Log tool usage for debugging (optional, enable by setting OMG_DEBUG=1)
if [ "${OMG_DEBUG:-0}" = "1" ]; then
  LOG_FILE="$OMG_STATE_DIR/tool-usage.log"
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $TOOL_NAME" >> "$LOG_FILE"
fi

# Track file modifications for autopilot phase tracking
if [ "$TOOL_NAME" = "editFiles" ] || [ "$TOOL_NAME" = "createFile" ]; then
  MODIFIED_FILES="$OMG_STATE_DIR/modified-files.txt"
  # Extract file path from tool input and append to tracking file
  FILE_PATH=$(echo "$TOOL_INPUT" | grep -oE '"filePath"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"filePath"\s*:\s*"//;s/".*//')
  if [ -n "$FILE_PATH" ]; then
    echo "$FILE_PATH" >> "$MODIFIED_FILES" 2>/dev/null
    # Deduplicate
    if [ -f "$MODIFIED_FILES" ]; then
      sort -u "$MODIFIED_FILES" -o "$MODIFIED_FILES" 2>/dev/null
    fi
  fi
fi

# Check for test failures after terminal commands
if [ "$TOOL_NAME" = "runInTerminal" ]; then
  # If a test command was run, check for failures
  if echo "$TOOL_INPUT" | grep -qE '(npm test|jest|vitest|pytest|cargo test|go test)'; then
    if echo "$TOOL_OUTPUT" | grep -qiE '(FAIL|ERROR|failed|error)'; then
      # Write failure marker for ultraqa/autopilot to detect
      echo '{"last_test_run": "failed", "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}' \
        > "$OMG_STATE_DIR/last-test-result.json" 2>/dev/null
    else
      echo '{"last_test_run": "passed", "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}' \
        > "$OMG_STATE_DIR/last-test-result.json" 2>/dev/null
    fi
  fi
fi

# --- Plankton: Opt-in type check + lint after file edits ---
# Enable by setting OMG_LINT_ON_EDIT=1 in your environment (opt-in, advisory only)
if [ "${OMG_LINT_ON_EDIT:-0}" = "1" ]; then
  if [ "$TOOL_NAME" = "editFiles" ] || [ "$TOOL_NAME" = "createFile" ]; then
    FILE_PATH=$(echo "$TOOL_INPUT" | grep -oE '"filePath"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"filePath"\s*:\s*"//;s/".*//')

    QUALITY_REPORT="$OMG_STATE_DIR/quality-gate.json"
    QUALITY_STATUS="ok"
    QUALITY_DETAILS=""

    if [ -n "$FILE_PATH" ]; then
      # TypeScript type check (non-blocking, advisory)
      if [ -f "$WORKSPACE/tsconfig.json" ] && echo "$FILE_PATH" | grep -qE '\.(ts|tsx)$'; then
        TS_OUTPUT=$(cd "$WORKSPACE" && npx tsc --noEmit 2>&1 | head -20)
        if echo "$TS_OUTPUT" | grep -qE 'error TS'; then
          QUALITY_STATUS="type-errors"
          QUALITY_DETAILS="$TS_OUTPUT"
        fi
      fi

      # ESLint check (non-blocking, advisory)
      if ls "$WORKSPACE"/.eslintrc* "$WORKSPACE"/eslint.config.* 2>/dev/null | grep -q '.'; then
        if echo "$FILE_PATH" | grep -qE '\.(ts|tsx|js|jsx)$'; then
          # Sanitize FILE_PATH: reject paths containing shell metacharacters or traversal sequences
          if [[ "$FILE_PATH" =~ [\'\"\;\&\|\`\$\(\)\{\}\<\>] ]] || [[ "$FILE_PATH" =~ \.\./ ]]; then
            QUALITY_STATUS="invalid-path"
            QUALITY_DETAILS="FILE_PATH failed sanitization check"
          else
          LINT_OUTPUT=$(cd "$WORKSPACE" && npx eslint "$FILE_PATH" --max-warnings=0 2>&1 | head -20)
          if echo "$LINT_OUTPUT" | grep -qE 'error|warning'; then
            QUALITY_STATUS="${QUALITY_STATUS}+lint-warnings"
            QUALITY_DETAILS="${QUALITY_DETAILS}\n${LINT_OUTPUT}"
          fi
          fi  # end sanitization check
        fi
      fi

      # Write quality gate result (advisory — does NOT block tool execution)
      echo "{\"status\": \"$QUALITY_STATUS\", \"file\": \"$FILE_PATH\", \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\", \"details\": \"$(echo "$QUALITY_DETAILS" | tr '"' "'" | tr '\n' ' ')\"}" \
        > "$QUALITY_REPORT" 2>/dev/null
    fi
  fi
fi

exit 0
