<#
.SYNOPSIS
    OMG adoption helper (PowerShell)

.DESCRIPTION
    Modes:
      template  - copy OMG assets from this repository into a target project
      submodule - track OMG as a git submodule (.omg-upstream), then sync assets
      subtree   - track OMG as a git subtree (.omg-upstream), then sync assets

.EXAMPLE
    # Template-style copy for a new project
    scripts/omg-adopt.ps1 -Target ~/work/my-new-app -Mode template

    # Track OMG updates with submodule
    scripts/omg-adopt.ps1 -Target ~/work/my-app -Mode submodule

    # Track OMG updates with subtree
    scripts/omg-adopt.ps1 -Target ~/work/my-app -Mode subtree
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$Target,

    [Parameter(Mandatory)]
    [ValidateSet('template', 'submodule', 'subtree')]
    [string]$Mode,

    [string]$Remote = 'https://github.com/jmstar85/oh-my-githubcopilot.git',

    [string]$Branch = 'main',

    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$OmgRoot = Split-Path -Parent $ScriptDir

if (-not (Test-Path $Target -PathType Container)) {
    Write-Error "Target directory not found: $Target"
    exit 1
}

if (-not (Test-Path (Join-Path $Target '.git') -PathType Container)) {
    Write-Error "Target must be a git repository: $Target"
    exit 1
}

$Items = @(
    '.github/copilot-instructions.md',
    '.github/agents',
    '.github/skills',
    '.github/hooks',
    '.github/prompts',
    '.vscode/mcp.json',
    'mcp-server'
)

function Get-Upstream {
    $upstreamDir = Join-Path $Target '.omg-upstream'

    if ($Mode -eq 'template') {
        return $OmgRoot
    }

    if ($Mode -eq 'submodule') {
        if (-not (Test-Path $upstreamDir -PathType Container)) {
            git -C $Target submodule add -b $Branch $Remote .omg-upstream
        } else {
            git -C $Target submodule update --init --remote .omg-upstream
        }
        return $upstreamDir
    }

    if ($Mode -eq 'subtree') {
        if (-not (Test-Path $upstreamDir -PathType Container)) {
            git -C $Target subtree add --prefix=.omg-upstream $Remote $Branch --squash
        } else {
            git -C $Target subtree pull --prefix=.omg-upstream $Remote $Branch --squash
        }
        return $upstreamDir
    }
}

function Backup-AndReplace {
    param(
        [string]$SrcRoot,
        [string]$Rel
    )

    $src = Join-Path $SrcRoot $Rel
    $dst = Join-Path $Target $Rel

    if (-not (Test-Path $src)) {
        Write-Host "Skip missing source: $src"
        return
    }

    $ts = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backupRoot = Join-Path $Target '.omg-backup' $ts

    if (Test-Path $dst) {
        $backupDest = Join-Path $backupRoot $Rel
        $backupParent = Split-Path -Parent $backupDest
        if (-not (Test-Path $backupParent)) {
            New-Item -ItemType Directory -Path $backupParent -Force | Out-Null
        }
        Move-Item -Path $dst -Destination $backupDest -Force
        Write-Host "Backed up: $Rel -> .omg-backup/$ts/$Rel"
    }

    $dstParent = Split-Path -Parent $dst
    if (-not (Test-Path $dstParent)) {
        New-Item -ItemType Directory -Path $dstParent -Force | Out-Null
    }
    Copy-Item -Path $src -Destination $dst -Recurse -Force
    Write-Host "Applied: $Rel"
}

$SrcRoot = Get-Upstream

Write-Host "Using source: $SrcRoot"

foreach ($rel in $Items) {
    Backup-AndReplace -SrcRoot $SrcRoot -Rel $rel
}

if (-not $SkipBuild) {
    $mcpPackage = Join-Path $Target 'mcp-server' 'package.json'
    if (Test-Path $mcpPackage) {
        Write-Host 'Installing/building MCP server in target project...'
        Push-Location (Join-Path $Target 'mcp-server')
        try {
            npm install
            npm run build
        } finally {
            Pop-Location
        }
    } else {
        Write-Host 'Skip build: mcp-server/package.json not found'
    }
} else {
    Write-Host 'Skip build requested'
}

Write-Host ''
Write-Host 'Done. Next steps:'
Write-Host '1) Open target project in VS Code as a trusted workspace'
Write-Host '2) In Copilot Chat (agent mode), run: /status'
Write-Host '3) Commit changes in target project after verification'
