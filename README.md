<h1 align="center">oh-my-githubcopilot</h1>

<p align="center">
  English | <a href="README.ko.md">한국어</a> | <a href="README.zh.md">中文</a> | <a href="README.ja.md">日本語</a> | <a href="README.es.md">Español</a>
</p>

<p align="center">
  <strong>Multi-agent orchestration for GitHub Copilot. Supercharged productivity.</strong>
</p>

<p align="center">
  <a href="https://github.com/jmstar85/oh-my-githubcopilot"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="#quick-start">Get Started</a> •
  <a href="#agents">Agents</a> •
  <a href="#skills">Skills</a> •
  <a href="#mcp-server">MCP Server</a> •
  <a href="#architecture">Architecture</a>
</p>

---

<h1 align="center">Now, you can also use this amazing features such as OMC for GitHub Copilot!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

---

## What is OMG?

**oh-my-githubcopilot (OMG)** brings the multi-agent orchestration paradigm — pioneered by [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) for Claude Code — to **GitHub Copilot**.

Where OMC supercharges Claude Code with specialized agents and workflow automation, OMG does the same for Copilot's agent mode in VS Code. Instead of a single assistant doing everything, OMG coordinates **20 specialized agents** and **18 reusable skills** through an MCP server, giving you structured workflows for planning, execution, review, and verification — all within your existing Copilot setup.

> **This is not a fork or copy of OMC.** It is an independent implementation built from scratch to leverage GitHub Copilot's agent customization features (`.agent.md`, `.prompt.md`, `SKILL.md`, MCP tools) while drawing architectural inspiration from OMC's multi-agent approach.

---

## Why OMG?

- **Works inside VS Code** — No extra CLI tools, no external processes. Just Copilot agent mode.
- **Specialized agents** — 20 purpose-built agents with scoped access (read-only analysts, full-access executors)
- **Workflow automation** — From autonomous `autopilot` to persistent `ralph` loops to parallel `ultrawork`
- **Safety guardrails** — Pre/post tool-use hooks prevent destructive operations automatically
- **MCP-powered state** — Persistent workflow state, PRD tracking, and project memory across sessions
- **Natural language triggers** — Say "autopilot build me a REST API" and the system handles orchestration
- **Verification-first** — Separate authoring and review passes; claims require evidence

---

## Quick Start

### Prerequisites

- VS Code with GitHub Copilot Chat enabled
- Agent mode / agent customization support available in your Copilot setup
- Node.js and npm installed so the MCP server can be built locally
- Workspace opened as a trusted folder so MCP, prompts, and customization files can load normally

### Step 1: Clone

```bash
git clone https://github.com/jmstar85/oh-my-githubcopilot.git
cd oh-my-githubcopilot
```

### Step 2: Build the MCP Server

```bash
cd mcp-server
npm install
npm run build
cd ..
```

### Step 3: Open in VS Code

Open the project in VS Code with GitHub Copilot Chat enabled. The MCP server, agents, skills, and hooks are automatically detected from the workspace configuration.

### Step 4: Start building

In Copilot Chat (agent mode), just say:

```
autopilot: build a REST API for managing tasks
```

That's it. OMG takes over — planning, implementing, reviewing, and verifying.

### Not Sure Where to Start?

If your requirements are vague or you want structured clarification:

```
deep-interview "I want to build a task management app"
```

OMG uses Socratic questioning to surface hidden assumptions and clarify requirements before any code is written.

### Use OMG in Other VS Code Projects

OMG is workspace-scoped, so the recommended way is to apply it per project.

This repository now includes an adoption script:

```bash
scripts/omg-adopt.sh --target <your-project-path> --mode <template|submodule|subtree>
```

#### Tip 1: Template-style for new projects

Use this for greenfield projects where you want OMG files copied directly into the project.

```bash
scripts/omg-adopt.sh --target ~/work/my-new-app --mode template
```

#### Tip 2: Track updates with submodule or subtree

Use one of these when you want a sync strategy for future OMG updates.

```bash
# Submodule strategy
scripts/omg-adopt.sh --target ~/work/my-app --mode submodule

# Subtree strategy
scripts/omg-adopt.sh --target ~/work/my-app --mode subtree
```

What the script applies to the target project:

- `.github/copilot-instructions.md`
- `.github/agents/`
- `.github/skills/`
- `.github/hooks/`
- `.github/prompts/`
- `.vscode/mcp.json`
- `mcp-server/` (with `npm install && npm run build`, unless `--skip-build`)

After applying, open the target project as a trusted workspace and validate in Copilot Chat (agent mode):

```text
/status
```

---

## Agents

OMG includes **20 specialized agents**, each with defined roles and access levels. Agents are declared as `.agent.md` files under `.github/agents/`.

| Agent | Role | Access |
|-------|------|--------|
| **@omg-coordinator** | Main orchestrator — coordinates workflows, autopilot, ralph loops | Full |
| **@executor** | Focused task implementation — code changes, features, bug fixes | Full |
| **@debugger** | Root-cause analysis, stack traces, build error resolution | Full |
| **@architect** | Architecture analysis, system design, debugging guidance | Read-only |
| **@planner** | Strategic planning with interview workflow | Plans only |
| **@analyst** | Requirements analysis, gap detection, scope risk | Read-only |
| **@verifier** | Evidence-based completion checks, test adequacy | Test runner |
| **@code-reviewer** | Severity-rated code review, SOLID checks, logic defects | Read-only |
| **@security-reviewer** | OWASP Top 10, secrets detection, auth/authz audit | Read-only |
| **@critic** | Thorough plan/code review gate, pre-mortem analysis | Read-only |
| **@test-engineer** | Test strategy, TDD workflows, flaky test hardening | Full |
| **@designer** | UI/UX design and frontend implementation | Full |
| **@writer** | Technical documentation — README, API docs, architecture docs | Full |
| **@tracer** | Evidence-driven causal tracing with competing hypotheses | Full |
| **@scientist** | Data analysis, statistical analysis, visualization | Read-only |
| **@qa-tester** | Interactive CLI testing via VS Code terminal, E2E verification | Full |
| **@git-master** | Atomic commits, rebasing, history management | Git only |
| **@code-simplifier** | Code clarity, reducing complexity, removing redundancy | Full |
| **@explore** | Codebase search, file finding, structure mapping | Read-only |
| **@document-specialist** | External documentation research, API reference lookup | Read-only |

---

## Skills

Skills are reusable workflow routines triggered by slash commands or natural language keywords. Defined under `.github/skills/`.

### Workflow Skills

| Skill | What It Does | Trigger Keywords |
|-------|-------------|-----------------|
| `/autopilot` | Full autonomous execution from idea to working code | `autopilot`, `build me`, `create me` |
| `/ralph` | PRD-driven persistence loop — won't stop until verified complete | `ralph`, `don't stop`, `finish this` |
| `/ultrawork` | Parallel execution engine for high-throughput tasks | `ulw`, `ultrawork`, `parallel` |
| `/team` | N coordinated agents on a shared task list with staged pipeline | `team`, `multi-agent`, `swarm` |
| `/plan` | Structured planning with optional interview workflow | `plan this`, `let's plan` |
| `/ralplan` | Consensus planning with Planner/Architect/Critic loop | `ralplan`, `consensus plan` |
| `/ccg` | Triple-model analysis (Claude + Codex + Gemini perspectives) | `ccg`, `tri-model`, `cross-validate` |

### Analysis & Quality Skills

| Skill | What It Does | Trigger Keywords |
|-------|-------------|-----------------|
| `/deep-interview` | Socratic requirements clarification with ambiguity gating | `deep interview`, `ask me everything` |
| `/deep-dive` | Two-stage pipeline: trace → deep-interview | `deep dive`, `investigate deeply` |
| `/trace` | Evidence-driven causal tracing with competing hypotheses | `trace this`, `root cause analysis` |
| `/verify` | Evidence-based completion verification | `verify this`, `prove it works` |
| `/review` | Code review with severity ratings and spec compliance | `review this`, `code review` |
| `/ultraqa` | QA cycling — test, verify, fix, repeat until green | `ultraqa`, `fix all tests` |
| `/ai-slop-cleaner` | Detect and fix AI-generated code smells | `deslop`, `anti-slop`, `cleanup slop` |
| `/self-improve` | Autonomous evolutionary code improvement with tournament selection | `self-improve`, `evolve code` |

### Utility Skills

| Skill | What It Does | Trigger Keywords |
|-------|-------------|-----------------|
| `/remember` | Save information to project memory | `remember this`, `store this` |
| `/cancel` | Cancel active execution modes | `cancel`, `stop`, `abort` |
| `/status` | Show current workflow status and active agents | `status`, `what's running` |

---

## MCP Server

OMG includes a TypeScript MCP (Model Context Protocol) server that provides persistent state management for workflows. Registered via `.vscode/mcp.json`, it exposes tools for:

| Tool Group | Tools | Purpose |
|-----------|-------|---------|
| **State** | `omg_read_state`, `omg_write_state`, `omg_clear_state`, `omg_list_active` | Workflow state CRUD and active mode listing |
| **PRD** | `omg_create_prd`, `omg_read_prd`, `omg_update_story`, `omg_verify_story` | PRD creation, story tracking, and verification |
| **Workflow** | `omg_check_completion`, `omg_next_phase`, `omg_get_phase_info` | Phase transitions, completion checks, phase inspection |
| **Memory** | `omg_read_memory`, `omg_write_memory`, `omg_delete_memory` | Project-scoped knowledge persistence |
| **Model Router** | `omg_select_model` | Model recommendation based on task complexity |

State is stored under `.omc/` in the workspace:

```
.omc/
├── state/              # Workflow state files per mode
├── plans/              # Work plans for execution
├── prd.json            # Product Requirements Document
└── project-memory.json # Project-scoped knowledge store
```

---

## Tool Guardrails

OMG includes pre/post tool-use hooks (`.github/hooks/`) that act as safety nets:

**Pre-tool-use guards:**
- Blocks modifications to `node_modules/`
- Prevents direct `.env` file edits
- Stops deletion of critical config files (`package.json`, `tsconfig.json`, `.gitignore`)
- Prevents `git push --force` and destructive git operations

**Post-tool-use tracking:**
- Logs tool usage for debugging (`OMG_DEBUG=1`)
- Tracks file modifications for autopilot phase awareness
- Monitors test results for ultraqa detection

---

## Architecture

```
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # Root orchestration instructions
│   ├── agents/                    # 20 specialized agent definitions
│   ├── skills/                    # 18 workflow skill routines
│   ├── hooks/                     # Pre/post tool-use safety guards
│   └── prompts/                   # Quick-fix, quick-plan, quick-review templates
├── mcp-server/                    # TypeScript MCP server
│   └── src/
│       ├── index.ts               # Server entry point
│       ├── state-tools.ts         # Workflow state management
│       ├── prd-tools.ts           # PRD and story tracking
│       ├── workflow-tools.ts      # Phase transitions and completion checks
│       ├── memory-tools.ts        # Project memory persistence
│       └── model-router.ts        # Task complexity-based model routing
├── .vscode/mcp.json               # MCP server registration for VS Code
└── .omc/                          # Runtime state directory (gitignored)
```

### How It Works

1. **Instructions** (`.github/copilot-instructions.md`) define the orchestration rules, delegation logic, and agent catalog
2. **Agents** (`.github/agents/*.agent.md`) are specialized personas with scoped tool access and model preferences
3. **Skills** (`.github/skills/*/SKILL.md`) are workflow routines loaded on-demand via keyword triggers or slash commands
4. **MCP Server** provides persistent state, PRD tracking, and project memory via the Model Context Protocol
5. **Hooks** guard against destructive operations and track execution for workflow awareness

---

## Commit Protocol

OMG uses structured git trailers to preserve decision context:

```
fix(auth): prevent silent session drops during long-running ops

Auth service returns inconsistent status codes on token expiry,
so the interceptor catches all 4xx and triggers inline refresh.

Constraint: Auth service does not support token introspection
Rejected: Extend token TTL to 24h | security policy violation
Confidence: high
Scope-risk: narrow
```

Available trailers: `Constraint`, `Rejected`, `Directive`, `Confidence`, `Scope-risk`, `Not-tested`

---

## Comparison with OMC

| Feature | OMC (oh-my-claudecode) | OMG (oh-my-githubcopilot) |
|---------|----------------------|--------------------------|
| Target Platform | Claude Code CLI | GitHub Copilot (VS Code) |
| Installation | npm package / plugin marketplace | Clone + build MCP server |
| Agent Count | 19+ (with tier variants) | 20 specialized agents |
| Skills | 10+ workflow skills | 18 skills with keyword triggers |
| State Management | `.omc/` directory | `.omc/` via MCP server (same path for OMC compatibility) |
| Multi-model | Codex/Gemini via tmux CLI | ccg skill (advisory) |
| Configuration | `~/.claude/settings.json` | `.github/` + `.vscode/mcp.json` |
| Tool Safety | Plugin-level hooks | Pre/post shell hooks |
| HUD / Statusline | Built-in HUD | VS Code native |

---

## Requirements

- [VS Code](https://code.visualstudio.com/) with [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
- GitHub Copilot Chat with agent mode enabled
- Node.js 18+ (for the MCP server)

---

## License

MIT

---

## Copyright

Copyright © 2026 jmstar85. All rights reserved.

This repository and all of its contents — including but not limited to source code, documentation, agent definitions, skill definitions, MCP server implementation, prompt templates, and configuration files — are the intellectual property of **jmstar85** (the repository owner). Unauthorized reproduction, distribution, or commercial use of any part of this work outside the terms of the MIT license is strictly prohibited.

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**The power of multi-agent orchestration, now for GitHub Copilot.**

</div>
