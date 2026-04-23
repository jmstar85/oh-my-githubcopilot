# OMG Pre-Tool-Use Hook (PowerShell)
# Runs before any tool execution in VS Code Copilot Agent Mode or Copilot CLI
#
# Input sources (auto-detected):
#   VS Code:  TOOL_NAME / TOOL_INPUT / WORKSPACE environment variables
#   CLI:      JSON via stdin with toolName / toolInput / workspace fields
#
# Output JSON: {"decision": "approve"} or {"decision": "deny", "reason": "..."}

# --- Dual-mode input detection ---
# Copilot CLI passes JSON via stdin; VS Code uses environment variables.
$ToolName = ''
$ToolInput = ''
$WorkspacePath = ''

if ([Console]::IsInputRedirected) {
    $stdinData = [Console]::In.ReadToEnd()
    if ($stdinData) {
        try {
            $parsed = $stdinData | ConvertFrom-Json -ErrorAction Stop
            if ($parsed.toolName) { $ToolName = $parsed.toolName }
            if ($parsed.toolInput) { $ToolInput = $parsed.toolInput | ConvertTo-Json -Compress }
            if ($parsed.workspace) { $WorkspacePath = $parsed.workspace }
        } catch {
            # Not valid JSON, fall through to env vars
        }
    }
}

if (-not $ToolName) { $ToolName = if ($env:TOOL_NAME) { $env:TOOL_NAME } else { '' } }
if (-not $ToolInput) { $ToolInput = if ($env:TOOL_INPUT) { $env:TOOL_INPUT } else { '' } }

# --- Tool name normalization ---
# Map Copilot CLI tool names to VS Code equivalents so guards work on both surfaces.
switch ($ToolName) {
    'edit'   { $ToolName = 'editFiles' }
    'read'   { $ToolName = 'readFile' }
    'shell'  { $ToolName = 'runInTerminal' }
    'create' { $ToolName = 'createFile' }
    'delete' { $ToolName = 'deleteFile' }
}

# Guard: prevent modifications to node_modules
if ($ToolInput -match 'node_modules') {
    if ($ToolName -eq 'editFiles' -or $ToolName -eq 'createFile') {
        Write-Output '{"decision": "deny", "reason": "Modifying node_modules is not allowed. Use package.json instead."}'
        exit 0
    }
}

# Guard: prevent modifications to .env files with secrets
if ($ToolInput -match '\.env(\.local|\.production|\.secret)?') {
    if ($ToolName -eq 'editFiles' -or $ToolName -eq 'createFile') {
        Write-Output '{"decision": "deny", "reason": "Direct .env file modification blocked. Review secrets manually."}'
        exit 0
    }
}

# Guard: prevent deletion of critical config files
if ($ToolInput -match '(package\.json|tsconfig\.json|\.gitignore)') {
    if ($ToolName -eq 'deleteFile') {
        Write-Output '{"decision": "deny", "reason": "Cannot delete critical config files."}'
        exit 0
    }
}

# Guard: prevent force push
if ($ToolName -eq 'runInTerminal') {
    if ($ToolInput -match 'git\s+push\s+.*(--force(\s|$)|-f(\s|$))' -and $ToolInput -notmatch '--force-with-lease') {
        Write-Output '{"decision": "deny", "reason": "Force push is not allowed. Use --force-with-lease if necessary."}'
        exit 0
    }
}

# Guard: prevent destructive git operations
if ($ToolName -eq 'runInTerminal') {
    if ($ToolInput -match 'git\s+(reset\s+.*--hard|clean\s+.*-[a-z]*f|checkout\s+--\s+\.)') {
        Write-Output '{"decision": "deny", "reason": "Destructive git operations require manual confirmation."}'
        exit 0
    }
}

# Default: approve (with optional checkpoint advisory)
if (-not $WorkspacePath) { $WorkspacePath = if ($env:WORKSPACE) { $env:WORKSPACE } else { Get-Location } }
$CheckpointTrigger = Join-Path $WorkspacePath '.omg' 'state' 'checkpoint-trigger.json'

if (Test-Path $CheckpointTrigger) {
    Write-Output '{"decision": "approve", "advisory": "⚠️ Context threshold reached. Call omg_checkpoint to save session state before continuing."}'
} else {
    Write-Output '{"decision": "approve"}'
}
