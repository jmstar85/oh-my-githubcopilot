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
  <a href="https://github.com/jmstar85/oh-my-githubcopilot/releases"><img src="https://img.shields.io/github/v/release/jmstar85/oh-my-githubcopilot?label=release&color=blue" alt="Latest Release"></a>
  <a href="https://github.com/jmstar85/oh-my-githubcopilot/stargazers"><img src="https://img.shields.io/github/stars/jmstar85/oh-my-githubcopilot?style=social" alt="GitHub Stars"></a>
  <img src="https://img.shields.io/badge/Agents-28-blueviolet" alt="28 Agents">
  <img src="https://img.shields.io/badge/Skills-37-orange" alt="37 Skills">
  <img src="https://img.shields.io/badge/MCP-Stateful%20Workflow-0A66C2" alt="MCP Stateful Workflow">
  <img src="https://img.shields.io/badge/Hooks-pre%20%2F%20post%20tool--use-6f42c1" alt="Pre/Post Hooks">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Works%20with-GitHub%20Copilot-181717?logo=github" alt="Works with GitHub Copilot">
  <img src="https://img.shields.io/badge/IDE-VS%20Code-007ACC?logo=visualstudiocode" alt="VS Code">
  <img src="https://img.shields.io/badge/CLI-Copilot%20CLI-181717?logo=github" alt="Copilot CLI">
  <img src="https://img.shields.io/badge/Workflow-omg--autopilot-00b894" alt="omg-autopilot">
  <img src="https://img.shields.io/badge/Workflow-ralph-0984e3" alt="ralph">
  <img src="https://img.shields.io/badge/Workflow-ultrawork-f39c12" alt="ultrawork">
  <img src="https://img.shields.io/badge/Quality-ultraqa-e74c3c" alt="ultraqa">
</p>

<p align="center">
  <code>#multi-agent</code> <code>#mcp</code> <code>#workflow-automation</code> <code>#context-preservation</code> <code>#agentic-ai</code>
</p>

<p align="center">
  <a href="#quick-start">Get Started</a> •
  <a href="#agents">Agents</a> •
  <a href="#skills">Skills</a> •
  <a href="#mcp-server">MCP Server</a> •
  <a href="#architecture">Architecture</a>
</p>

---

<h1 align="center">Now, you can enjoy OMG's amazing features integrating OMC + ECC!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">
    <img src="https://img.youtube.com/vi/3Zyf4a7LAH8/maxresdefault.jpg" alt="Watch OMG in Action on YouTube" width="720" />
  </a>
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">▶ Watch OMG in Action on YouTube</a>
</p>

---

## What is OMG?

**oh-my-githubcopilot (OMG)** brings the multi-agent orchestration paradigm — pioneered by [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) for Claude Code — to **GitHub Copilot**, now further supercharged with the best features of **[Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code)**.

Where OMC supercharges Claude Code with specialized agents and workflow automation, OMG does the same for Copilot's agent mode in VS Code. And with the ECC integration (v1.1.0) plus the adapted OMC skill port, OMG now includes language-specialist reviewers, TDD enforcement, rapid security scanning, durable `ultragoal` checkpoints, research helpers, release guidance, visual QA, and more. Instead of a single assistant doing everything, OMG coordinates **28 specialized agents** and **37 reusable skills** through an MCP server, giving you structured workflows for planning, execution, review, and verification — all within your existing Copilot setup.

> **This is not a fork or copy of OMC or ECC.** It is an independent implementation built from scratch to leverage GitHub Copilot's agent customization features (`.agent.md`, `.prompt.md`, `SKILL.md`, MCP tools), drawing architectural inspiration from OMC's multi-agent approach and selectively integrating ECC's proven patterns.

---

## Why OMG?

- **Works inside VS Code and Copilot CLI** — No extra CLI tools, no external processes. VS Code agent mode or the standalone `copilot` CLI.
- **Specialized agents** — 28 purpose-built agents with scoped access (read-only analysts, full-access executors, 8 language reviewers)
- **Workflow automation** — From autonomous `omg-autopilot` to persistent `ralph` loops to parallel `ultrawork`
- **Safety guardrails** — Pre/post tool-use hooks prevent destructive operations automatically
- **MCP-powered state** — Persistent workflow state, PRD tracking, and project memory across sessions
- **Natural language triggers** — Say "omg-autopilot build me a REST API" and the system handles orchestration
- **Verification-first** — Separate authoring and review passes; claims require evidence

---

## Quick Start

### Prerequisites

- VS Code with GitHub Copilot Chat enabled
- Agent mode / agent customization support available in your Copilot setup
- Node.js and npm installed so the MCP server can be built locally
- Workspace opened as a trusted folder so MCP, prompts, and customization files can load normally

### Option A: VS Code Extension (Recommended)

1. Install the extension (either method below):
  - **Method 1 — VSIX (CLI)**
    Download `oh-my-githubcopilot-1.5.0.vsix` from the [latest release](https://github.com/jmstar85/oh-my-githubcopilot/releases/latest), then:
    ```bash
    code --install-extension ./oh-my-githubcopilot-1.5.0.vsix
    ```
    > Replace the path with wherever you saved the file.
  - **Method 2 — VS Code Extensions tab (UI)**
    Open VS Code → Extensions (`⇧⌘X` / `Ctrl+Shift+X`) → search **`oh-my-githubcopilot`** → Install.

2. Open your project in VS Code.

3. **⚡ Run `OMG: Initialize Workspace` (REQUIRED)**
  ```text
  Cmd+Shift+P (macOS) / Ctrl+Shift+P (Windows/Linux) → "OMG: Initialize Workspace"
  ```

> [!IMPORTANT]
> **Installing the extension alone is NOT enough.** You must run `OMG: Initialize Workspace` from the Command Palette after installation. This command scaffolds all `.github/` convention files (agents, skills, hooks, prompts, copilot-instructions.md) and builds the MCP server in your workspace. Without this step, Copilot will not have access to any OMG agents or skills.

4. When prompted, click **"Reload Window"** to activate all agents and skills.
5. Start using OMG in Copilot Chat (agent mode).

### Option B: Manual Clone

1. Clone the repository:
  ```bash
  git clone https://github.com/jmstar85/oh-my-githubcopilot.git
  cd oh-my-githubcopilot
  ```
2. Build the MCP server:
  ```bash
  cd mcp-server
  npm install
  npm run build
  cd ..
  ```
3. Open the project in VS Code with GitHub Copilot Chat enabled.

4. In Copilot Chat (agent mode), say:
  ```text
  omg-autopilot: build a REST API for managing tasks
  ```
5. OMG takes over — planning, implementing, reviewing, and verifying.

### Option C: Copilot CLI

OMG works with the standalone [Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) (`copilot` binary). The CLI reads the same `.github/` convention files (agents, skills, hooks, prompts).

1. Install the Copilot CLI binary.
2. Clone OMG and build the MCP server:
   ```bash
   git clone https://github.com/jmstar85/oh-my-githubcopilot.git
   cd oh-my-githubcopilot
   cd mcp-server && npm install && npm run build && cd ..
   ```
3. Create a project-local `.copilot/mcp-config.json` (or use `--global-mcp` to install globally at `~/.copilot/`):
   ```bash
   scripts/omg-adopt.sh --target . --mode template --target-env cli
   ```
4. Run `copilot` from the project directory:
   ```bash
   copilot
   ```
5. Try `/status` or `@omg-coordinator` to verify OMG is loaded.

### Not Sure Where to Start?

If your requirements are vague or you want structured clarification:

```
deep-interview "I want to build a task management app"
```

OMG uses Socratic questioning to surface hidden assumptions and clarify requirements before any code is written.

### Use OMG in Other VS Code Projects

OMG is workspace-scoped, so the recommended way is to apply it per project.

This repository now includes an adoption script:

**macOS / Linux (Bash):**
```bash
scripts/omg-adopt.sh --target <your-project-path> --mode <template|submodule|subtree> [--target-env vscode|cli|both]
```

**Windows (PowerShell):**
```powershell
scripts/omg-adopt.ps1 -Target <your-project-path> -Mode <template|submodule|subtree> [-TargetEnv vscode|cli|both]
```

The `--target-env` flag (default: `both`) controls what gets set up:
- `vscode` — VS Code only (`.vscode/mcp.json`)
- `cli` — Copilot CLI only (`.copilot/mcp-config.json` + `hooks.json`)
- `both` — Both environments (default)

#### Tip 1: Template-style for new projects

Use this for greenfield projects where you want OMG files copied directly into the project.

```bash
# macOS / Linux
scripts/omg-adopt.sh --target ~/work/my-new-app --mode template
```
```powershell
# Windows
scripts/omg-adopt.ps1 -Target ~/work/my-new-app -Mode template
```

#### Tip 2: Track updates with submodule or subtree

Use one of these when you want a sync strategy for future OMG updates.

```bash
# macOS / Linux — Submodule strategy
scripts/omg-adopt.sh --target ~/work/my-app --mode submodule

# macOS / Linux — Subtree strategy
scripts/omg-adopt.sh --target ~/work/my-app --mode subtree
```
```powershell
# Windows — Submodule strategy
scripts/omg-adopt.ps1 -Target ~/work/my-app -Mode submodule

# Windows — Subtree strategy
scripts/omg-adopt.ps1 -Target ~/work/my-app -Mode subtree
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

OMG includes **28 specialized agents**, each with defined roles and access levels. Agents are declared as `.agent.md` files under `.github/agents/`.

### Core Agents (20)

| Agent | Role | Access |
|-------|------|--------|
| **@omg-coordinator** | Main orchestrator — coordinates workflows, omg-autopilot, ralph loops | Full |
| **@executor** | Focused task implementation — code changes, features, bug fixes | Full |
| **@debugger** | Root-cause analysis, stack traces, build error resolution (7-language guide) | Full |
| **@architect** | Architecture analysis, system design, debugging guidance | Read-only |
| **@planner** | Strategic planning with interview workflow | Plans only |
| **@analyst** | Requirements analysis, gap detection, scope risk | Read-only |
| **@verifier** | Evidence-based completion checks, test adequacy | Test runner |
| **@code-reviewer** | Severity-rated code review, SOLID checks, canonical coding standards | Read-only |
| **@security-reviewer** | OWASP Top 10, secrets detection (sk-/ghp_/AKIA), auth/authz audit | Read-only |
| **@critic** | Thorough plan/code review gate, pre-mortem analysis | Read-only |
| **@test-engineer** | Test strategy, TDD workflows, framework detection, flaky test hardening | Full |
| **@designer** | UI/UX design and frontend implementation | Full |
| **@writer** | Technical documentation — README, API docs, CODEMAP generation | Full |
| **@tracer** | Evidence-driven causal tracing with competing hypotheses | Full |
| **@scientist** | Data analysis, statistical analysis, visualization | Read-only |
| **@qa-tester** | Interactive CLI testing via VS Code terminal, Playwright POM, E2E | Full |
| **@git-master** | Atomic commits, rebasing, history management | Git only |
| **@code-simplifier** | Code clarity, complexity metrics, simplification patterns | Full |
| **@explore** | Codebase search, file finding, structure mapping | Read-only |
| **@document-specialist** | External documentation research, API reference lookup | Read-only |

### Language Reviewer Agents — Tier 2 (8)

Invoke with `@mention` for language-specific code review:

| Agent | Language | Key Rules |
|-------|----------|----------|
| **@typescript-reviewer** | TypeScript | Strict mode, type safety, no-any, exhaustive checks |
| **@python-reviewer** | Python | PEP 8, type hints, idiomatic patterns |
| **@rust-reviewer** | Rust | Ownership, borrow checker, unsafe blocks, clippy |
| **@go-reviewer** | Go | Idiomatic Go, goroutine safety, error handling |
| **@java-reviewer** | Java | SOLID, Spring patterns, null safety |
| **@csharp-reviewer** | C# | Nullable analysis, async/await, C# idioms |
| **@swift-reviewer** | Swift | Memory safety, Swift concurrency, SwiftUI patterns |
| **@database-reviewer** | SQL/ORM | Query performance, parameterization, schema design |

---

## Skills

Skills are reusable workflow routines triggered by slash commands or natural language keywords. Defined under `.github/skills/`.

### Workflow Skills

| Skill | What It Does | Trigger Keywords |
|-------|-------------|-----------------|
| `/omg-autopilot` | Full autonomous execution from idea to working code | `omg-autopilot`, `build me`, `create me` |
| `/ralph` | PRD-driven persistence loop — won't stop until verified complete | `ralph`, `don't stop`, `finish this` |
| `/ultrawork` | Parallel execution engine for high-throughput tasks | `ulw`, `ultrawork`, `parallel` |
| `/ultragoal` | Durable MCP-backed goal tracking with checkpoints | `ultragoal`, `goal loop`, `durable goal` |
| `/team` | N coordinated agents on a shared task list with staged pipeline | `team`, `multi-agent`, `swarm` |
| `/plan` | Structured planning with optional interview workflow | `plan this`, `let's plan` |
| `/ralplan` | Consensus planning with Planner/Architect/Critic loop | `ralplan`, `consensus plan` |
| `/ccg` | Triple-model analysis (Claude + Codex + Gemini perspectives) | `ccg`, `tri-model`, `cross-validate` |
| `/autoresearch` | Stateful research loop with evaluator gates | `autoresearch`, `research loop` |

### Analysis & Quality Skills

| Skill | What It Does | Trigger Keywords |
|-------|-------------|-----------------|
| `/deep-interview` | Socratic requirements clarification with ambiguity gating | `deep interview`, `ask me everything` |
| `/deep-dive` | Two-stage pipeline: trace → deep-interview | `deep dive`, `investigate deeply` |
| `/trace` | Evidence-driven causal tracing with competing hypotheses | `trace this`, `root cause analysis` |
| `/external-context` | Focused external documentation research | `external context`, `docs research` |
| `/sciomc` | Bounded scientist-style research analysis | `sciomc`, `scientist research` |
| `/ask` | Route multi-perspective questions through `/ccg` | `ask`, `multi-model ask` |
| `/verify` | Evidence-based completion verification | `verify this`, `prove it works` |
| `/review` | Code review with severity ratings and spec compliance | `review this`, `code review` |
| `/ultraqa` | QA cycling — test, verify, fix, repeat until green | `ultraqa`, `fix all tests` |
| `/ai-slop-cleaner` | Detect and fix AI-generated code smells | `deslop`, `anti-slop`, `cleanup slop` |
| `/self-improve` | Autonomous evolutionary code improvement with tournament selection | `self-improve`, `evolve code` |
| `/visual-verdict` | Structured visual QA for screenshot comparisons | `visual verdict`, `screenshot compare` |

### Utility Skills

| Skill | What It Does | Trigger Keywords |
|-------|-------------|-----------------|
| `/remember` | Save information to project memory | `remember this`, `store this` |
| `/wiki` | Maintain lightweight project knowledge base entries | `wiki`, `knowledge base` |
| `/writer-memory` | Track writing project memory and story canon | `writer memory`, `character memory` |
| `/skillify` | Turn repeatable workflows into reusable OMG skills | `skillify`, `make a skill` |
| `/deepinit` | Generate or refresh repository agent guidance | `deepinit`, `repo init docs` |
| `/release` | Prepare safe release notes, checks, and approval gates | `release`, `publish version` |
| `/configure-notifications` | Guide notification integration setup | `configure notifications`, `alert me` |
| `/hud` | Explain OMG StatusBar and TreeView status surfaces | `hud`, `status display` |
| `/cancel` | Cancel active execution modes | `cancel`, `stop`, `abort` |
| `/status` | Show current workflow status and active agents | `status`, `what's running` |

---

## MCP Server

OMG includes a TypeScript MCP (Model Context Protocol) server that provides persistent state management for workflows. Registered via `.vscode/mcp.json`, it exposes six tools:

| Tool | Purpose |
|------|---------|
| `omg_read` | Read workflow state by `scope`: `state`, `prd`, `phase`, `ultragoal`, `checkpoint`, or `all` (compact summary) |
| `omg_write` | Write state, create PRDs and stories, advance autopilot phases, record ultragoal milestones (`scope` + `op`: `set`, `clear`, `advance`) |
| `omg_verify` | Mark a PRD story passed or complete an ultragoal — fail-closed: rejected unless evidence is non-empty and every item passed |
| `omg_check_completion` | Completion gate: active workflows, unverified stories, active ultragoal |
| `omg_checkpoint` | Save a session checkpoint and return handoff text for the next session (restore with `omg_read scope:"checkpoint"`) |
| `omg_memory` | Project-scoped knowledge: `get`, `search`, `set`, `delete` |

> **Coming from 1.4.x?** The 27 tools of earlier versions were consolidated into these six in v1.5.0 ([mapping](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/design/v1.5-context-diet.md#42-target-surface-6-tools)). To keep the old names as deprecated adapters until 2.0, set `OMG_LEGACY_TOOLS=1` in the server's `env` in `.vscode/mcp.json`.

State is stored under `.omg/` in the workspace:

```
.omg/
├── state/              # Workflow state files per mode
├── ultragoal/          # Durable ultragoal ledger and checkpoints
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
- Tracks file modifications for omg-autopilot phase awareness
- Monitors test results for ultraqa detection

---

## Benchmark

> All numbers are derived from the actual `oh-my-githubcopilot` git history, test suite, and `npm audit` results. No synthetic data.

### Context Footprint (v1.5.0)

Tokens OMG adds to **every** Copilot request before your task starts (o200k tokenizer; MCP tools measured from a live `tools/list`). Reproduce with `cd evals && npm install && npm run baseline`.

| Always-injected context | v1.4.4 | v1.5.0 | Change |
|-------------------------|-------:|-------:|:------:|
| `copilot-instructions.md` | 3,594 | 549 | −85% |
| MCP tool definitions | 2,585 (27 tools) | 863 (6 tools) | −67% |
| Skill descriptions (37) | 1,308 | 1,331 | +2% |
| Agent descriptions (28) | 1,213 | 1,213 | — |
| Prompt files (3) | 38 | 38 | — |
| **Total** | **8,738** | **3,994** | **−54%** |

> Lower bound: host wrapper text around tool lists and anything hooks inject when they fire are not counted. Agent and skill bodies load on demand. Every phrase from the removed keyword table is still checked against the owning skill's description (`npm run activation`: 80 phrases, 0 missing).

### Project Snapshot (as of v1.3.0)

| Metric | Value |
|--------|-------|
| Total codebase | 25,964 lines |
| Development span | 12 days (Apr 6–17, 2026) |
| Total commits | 33 |
| Agents | 28 (20 core + 8 language reviewers) |
| Skills | 37 |
| MCP tools | 23 |

### Quality Metrics

| Metric | v1.0 (initial) | v1.3.0 (after OMG pipeline) |
|--------|:-:|:-:|
| Test pass rate | N/A | **46 / 46 (100%)** |
| TypeScript errors | Not checked | **0** |
| Known CVEs | 7 (2 prod + 5 dev) | **0** |
| Pre-hook safety guards | 0 | **6** |
| Post-hook tracking features | 0 | **8** |

### ECC Integration — Single Commit Impact (`9468c02`)

| Metric | Value |
|--------|-------|
| Files changed | 60 |
| Lines added | 5,844 |
| New agents | 8 language reviewer agents |
| New skills | 4 (`/tdd`, `/security-scan`, `/coding-standards`, `/skill-stocktake`) |
| Defects caught pre-merge | Shell injection in hooks + 7 CVEs |

### RALPLAN Consensus Planning

| Decisions reviewed | Passed | Rejected by `@critic` | Rejection rate |
|:-:|:-:|:-:|:-:|
| 9 | 7 | **2** | **22%** |

> 22% of design decisions were revised at planning stage — before any code was written.

### Security Scan Results

| Category | Found | Fixed |
|----------|:-:|:-:|
| Hardcoded secrets | 0 | — |
| Production CVEs | 2 moderate | ✅ |
| Dev CVEs | 5 moderate | ✅ |
| Shell injection (hook `FILE_PATH`) | 1 | ✅ |
| `.env` missing from `.gitignore` | 1 | ✅ |
| **Total vulnerabilities post-fix** | | **0** |

### Pre-Tool-Use Safety Guards

| Guard | Blocked Operation |
|-------|------------------|
| `node_modules` write protection | Edit/create inside `node_modules/` |
| `.env` secret protection | Direct `.env` file modification |
| Critical config deletion block | Delete `package.json`, `tsconfig.json`, `.gitignore` |
| Force push prevention | `git push --force` |
| Hard reset prevention | `git reset --hard`, `git clean -fd` |
| Path traversal sanitization | `../` and metacharacters in `FILE_PATH` |

---

## Architecture

```
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # Root orchestration instructions
│   ├── agents/                    # 28 specialized agent definitions (20 core + 8 language reviewers)
│   ├── skills/                    # 37 workflow skill routines
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
└── .omg/                          # Runtime state directory (gitignored)
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
| Agent Count | 19+ (with tier variants) | 28 agents (20 core + 8 language reviewers) |
| Skills | 10+ workflow skills | 37 skills with keyword triggers |
| State Management | `.omc/` directory | `.omg/` via MCP server |
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

## What's New

### v1.5.0 (2026-11-11) — Context Diet

**OMG now costs less than half as much context per request.** Always-injected tokens drop from 8,738 to 3,994 (−54%) with no change to the workflows you invoke. See [Benchmark → Context Footprint](#context-footprint-v150).

- **`copilot-instructions.md`: 3,594 → 549 tokens.** The agent, skill, keyword and tool catalogs duplicated what Copilot already exposes from frontmatter and tool schemas; only the always-on obligations remain (evidence before completion, separate review pass, commit trailers, hook boundaries, graceful degradation).
- **MCP tools: 27 → 6** (`omg_read`, `omg_write`, `omg_verify`, `omg_check_completion`, `omg_checkpoint`, `omg_memory`), 2,585 → 863 tokens. On-disk formats under `.omg/` are unchanged — 1.4.x state is read without migration.
- **Fail-closed verification**: a PRD story can only be marked passed, and an ultragoal completed, through `omg_verify` with non-empty evidence in which every item passed.
- **Trigger phrases preserved**: the keyword table is gone, but every phrase it listed still activates its skill from the skill description (80 phrases checked; 7 restored — `prd loop`, `story loop`, `stakeholder interview`, `check secrets`, `audit deps`, `cancel omg`, `cancelomc`).
- **Session budget rule**: at 50% of the context window the agent finishes the in-flight edit, commits verified work, checkpoints, and hands off with a self-contained prompt; `omg_checkpoint` returns the handoff text.
- **Fixes**: `OMG: Update Convention Files` now rebuilds the MCP server (previously only Initialize did). PowerShell hooks: the force-push guard missed `--force` / `-f` at the end of the tool input, and both hooks failed on Windows PowerShell 5.1 — fixed, now matching the bash hooks.
- **Measurable**: `evals/` adds a footprint baseline (`npm run baseline`), a static activation check (`npm run activation`) and optional live CLI probes.
- **Docs**: [ADR-0001](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/adr/0001-replatform.md) (the v2 direction), a [threat model draft](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/security/threat-model.md), and the [v1.5 design](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/design/v1.5-context-diet.md).

**Upgrading from 1.4.x**

1. Install the 1.5.0 VSIX, run `OMG: Update Convention Files`, then reload the window. Manual installs: copy `.github/` and `mcp-server/`, then `cd mcp-server && npm install && npm run build`.
2. If your own prompts or agents call the old tool names, move them to the six new tools, or set `OMG_LEGACY_TOOLS=1` in the server's `env` (`.vscode/mcp.json`) to keep the 1.4 names as deprecated adapters.

**Deprecated — removed in 2.0**

- The 1.4 MCP tool names (available only with `OMG_LEGACY_TOOLS=1`).
- `/resume-claude`, `/push-omc` and the OMC bridge tools (in 1.5 they also need `OMG_LEGACY_TOOLS=1`).
- `omg_select_model` (agents declare `model:` in frontmatter).

- **Verification**: MCP server build and 51 tests (50 pass; the symlink test needs symlink privilege on Windows), VS Code extension 29 unit tests, footprint 3,994 tokens, activation 80/80.
- VSIX: `oh-my-githubcopilot-1.5.0.vsix`, attached to the GitHub Release (no longer committed to the repository).

### v1.4.4 (2026-05-16) — Adapted OMC Skill Port + Ultragoal MCP

**Ports high-value OMC workflows into OMG with VS Code/Copilot-native behavior.** This release expands OMG from 24 to 37 skills and adds MCP-backed durable goal tracking.

- **New MCP-backed `ultragoal` workflow**: `omg_ultragoal_create`, `omg_ultragoal_status`, `omg_ultragoal_checkpoint`, and `omg_ultragoal_complete` store fail-closed durable goal artifacts under `.omg/ultragoal/`.
- **13 adapted OMC-inspired skills**: `visual-verdict`, `release`, `deepinit`, `skillify`, `writer-memory`, `configure-notifications`, `ultragoal`, `wiki`, `autoresearch`, `hud`, `external-context`, `sciomc`, and `ask`.
- **Updated routing and health checks**: Copilot instructions now include new slash commands, keyword triggers, ultragoal completion rules, hook gates, and skill thresholds (`CORE=24`, `EXTENDED=37`).
- **Template sync**: Extension templates now include the new skills, `ultragoal` MCP server source, tests, and updated README content.
- **Verification**: MCP build/test passed (23 tests), VS Code extension unit tests passed (29 tests), VSIX package verified under 20MB.
- VSIX: `oh-my-githubcopilot-1.4.4.vsix`.

### v1.4.3 (2026-05-11) — Bidirectional Bridge: OMG → OMC Push

**Closes the v1.4.0 bridge into a full OMG ↔ OMC round-trip.** v1.4.0 shipped one-way `omc → omg` import; v1.4.3 adds the reverse `omg → omc` export so work done in GitHub Copilot can continue in Claude Code.

- **New module `mcp-server/src/bridge/omg-exporter.ts`**: composes (does not blindly copy) — `prd.json` and `project-memory.json` are file-copies; `active_modes[]` from the OMG checkpoint is **decomposed** into per-mode `.omc/state/{mode}-state.json` files (the inverse of v1.4.0's omc-importer composition); `.omc/state/session-checkpoint.json` is composed with translated provenance.
- **New shared helper `mcp-server/src/bridge/conflict-utils.ts`**: `shouldSkipForConflict()` uses embedded `timestamp` field as primary conflict primitive for `session-checkpoint.json` (mtime fallback elsewhere — addresses git-checkout-touches-mtime brittleness); `rotateBackup()` keeps last N=3 timestamped `.previous.{ISO}.json` snapshots, applied symmetrically on both import and export sides.
- **New MCP tool `omg_export_external_session({target: "omc", force?})`** with atomicity contract: `.omg/state/last-export-token.json` is the LAST side-effect — partial-write failures leave no token, so subsequent operations correctly treat the transaction as uncommitted.
- **Round-trip safety via dual-write loop guard**: importer reads either `.omg/state/last-export-token.json` OR the destination checkpoint's `source_origin === "bridged-from-omg"` — guard survives wipe of either side. No time-based TTL; token invalidates only when destination's `source_origin` flips to `"native"` or `source_session_id` changes.
- **Provenance schema extended** (backward-compatible): new `source_origin` field (`"native" | "bridged-from-omc" | "bridged-from-claude-code" | "bridged-from-omg"`) is the authoritative provenance signal; legacy `source_tool: "copilot"` is retained. New `workspace_root` field powers a project-identity guard that aborts before any mutation when source checkpoint's workspace path doesn't match the current workspace.
- **`/push-omc` skill (6 steps)**: detect → compare → confirm → export → summarize → continue. Trigger keywords: `/push-omc`, `"push omc"`, `"omc 푸시"`, `"omc로 보내기"`, `"sync to omc"`, `"export to omc"`. Mirror at `vscode-omg/resources/templates/skills/push-omc/SKILL.md`.
- **VS Code command `omg.pushExternal`** ("OMG: Push to External Session (OMC)"): user-initiated only — no activation-time push notification (push remains a deliberate user action).
- **`omg_compare_checkpoints` reports both directions**: now returns `omg_newer_than_external` alongside `newer_than_omg` so `/push-omc` and `/resume-claude` share the same comparison surface.
- **Tests grow 8 → 18+** across 6 zones (Unit, Provenance, Round-trip guard, Composition, Conflict-path, Project-identity).
- **Deferred to v1.5.x**: `omg → claude-code` direction. Would require synthesizing valid `tool_use`/`tool_result` UUID chains compatible with Claude Code's resume-by-id contract; tracking: TBD.
- VSIX: `oh-my-githubcopilot-1.4.3.vsix`.

### v1.4.2 (2026-05-10) — Opus 4.7 → 4.6 Fallback Array

**Made Opus 4.7 routing tier-safe by adding `Claude Opus 4.6 (copilot)` as an inline fallback.**

- The 7 deep-reasoning agents (`analyst`, `architect`, `code-reviewer`, `critic`, `omg-coordinator`, `planner`, `security-reviewer`) now use a YAML model array: `["Claude Opus 4.7 (copilot)", "Claude Opus 4.6 (copilot)"]`.
- Why: VS Code Copilot blocks subagent calls that exceed the active chat model's cost-tier ceiling. With a 7.5x base model (e.g. `GPT-5.5`), an `Opus 4.7`-only request was hard-failing instead of degrading.
- New behavior: when the session ceiling allows it, Opus 4.7 is used. Otherwise the agent transparently falls back to Opus 4.6 instead of failing.
- No change to GPT-5.5 (15 agents) or Sonnet 4.6 (6 agents) routing.
- VSIX: `oh-my-githubcopilot-1.4.2.vsix`.

### v1.4.1 (2026-05-09) — Role-Based Agent Model Routing

**Mapped all 28 agents to task-fit Copilot model preferences using qualified model names**

- Updated agent `model:` frontmatter to use official qualified model-name strings such as `GPT-5.5 (copilot)` and `Claude Sonnet 4.6 (copilot)`.
- Kept high-stakes reasoning and approval agents on Claude Opus 4.7; routed debugging, verification, research, testing, design, and specialist review agents to GPT-5.5; routed execution, exploration, documentation, QA driving, git, and simplification workflows to Claude Sonnet 4.6.
- Updated `omg_select_model` recommendations to use the same allowed model set and role-based agent overrides, removing stale `gpt-4.1`, `gpt-4.1-mini`, and dot-format Claude model recommendations.
- Model smoke tests: `GPT-5.5 (copilot)` invoked successfully; `Claude Opus 4.7 (copilot)` is recognized by Copilot but was blocked in this environment by the current cost-tier limit, not by a stale model string.

| Agent | Model |
|---|---|
| `analyst` | `Claude Opus 4.7 (copilot)` |
| `architect` | `Claude Opus 4.7 (copilot)` |
| `code-reviewer` | `Claude Opus 4.7 (copilot)` |
| `critic` | `Claude Opus 4.7 (copilot)` |
| `omg-coordinator` | `Claude Opus 4.7 (copilot)` |
| `planner` | `Claude Opus 4.7 (copilot)` |
| `security-reviewer` | `Claude Opus 4.7 (copilot)` |
| `csharp-reviewer` | `GPT-5.5 (copilot)` |
| `database-reviewer` | `GPT-5.5 (copilot)` |
| `debugger` | `GPT-5.5 (copilot)` |
| `designer` | `GPT-5.5 (copilot)` |
| `document-specialist` | `GPT-5.5 (copilot)` |
| `go-reviewer` | `GPT-5.5 (copilot)` |
| `java-reviewer` | `GPT-5.5 (copilot)` |
| `python-reviewer` | `GPT-5.5 (copilot)` |
| `rust-reviewer` | `GPT-5.5 (copilot)` |
| `scientist` | `GPT-5.5 (copilot)` |
| `swift-reviewer` | `GPT-5.5 (copilot)` |
| `test-engineer` | `GPT-5.5 (copilot)` |
| `tracer` | `GPT-5.5 (copilot)` |
| `typescript-reviewer` | `GPT-5.5 (copilot)` |
| `verifier` | `GPT-5.5 (copilot)` |
| `code-simplifier` | `Claude Sonnet 4.6 (copilot)` |
| `executor` | `Claude Sonnet 4.6 (copilot)` |
| `explore` | `Claude Sonnet 4.6 (copilot)` |
| `git-master` | `Claude Sonnet 4.6 (copilot)` |
| `qa-tester` | `Claude Sonnet 4.6 (copilot)` |
| `writer` | `Claude Sonnet 4.6 (copilot)` |

Opus 4.6 remains an explicit fallback alternative in the model router rather than the default for any agent.

### v1.4.0 (2026-05-03) — Claude Code / OMC Session Bridge

**One-directional bridge: resume interrupted Claude Code or OMC sessions in GitHub Copilot**

- **Claude Code JSONL importer**: Parses `~/.claude/projects/` session logs to extract modified files, last user prompt, and last assistant response. Supports Write/Edit/MultiEdit tool_use block detection.
- **OMC importer**: Maps `.omc/` state directory (PRD, workflow state, checkpoint, project memory) to `.omg/` equivalents with mtime-based conflict resolution.
- **3 new MCP tools**: `omg_detect_external_session` (read-only detection), `omg_import_external_session` (performs import with backup), `omg_compare_checkpoints` (timestamp comparison).
- **VS Code auto-detection**: On activation, detects external sessions and shows notification ("Resume / Ignore / Always ignore"). Skips if OMG checkpoint is fresh (< 30 min).
- **`/resume-claude` skill**: 6-step workflow — detect → compare → confirm → import → summarize → continue. Keyword triggers: "resume claude", "resume work", "continue session".
- **Security**: Imported checkpoint files set to `chmod 0600`. Existing checkpoints backed up to `.previous.json` before import.
- **Checkpoint schema extension**: 4 new optional fields — `source_tool`, `source_session_id`, `imported_at`, `imported_summary` (backward-compatible).

### v1.3.1 (2026-04-23) — Copilot CLI Support

**Dual-compatibility for VS Code agent mode and the standalone Copilot CLI** (Issue #4)

- **Agent frontmatter normalization**: `model:` field changed from array to string format across all 28 agents. CLI tool equivalents (`read`, `edit`, `shell`, `create`, `delete`) added to `tools:` lists.
- **Hook dual-mode input**: Pre/post tool-use hooks now accept both VS Code environment variables and CLI stdin JSON. Tool name normalization maps CLI names to VS Code equivalents before guard logic.
- **`hooks.json` registration**: New CLI hook wrapper for `preToolUse` / `postToolUse` discovery.
- **Adopt script `--target-env`**: New `--target-env vscode|cli|both` flag (default: `both`). CLI mode generates `.copilot/mcp-config.json` and skips `.vscode/mcp.json`. `--global-mcp` installs MCP config at `~/.copilot/`.
- **Skill CLI fallback**: All 5 interactive skills (`deep-interview`, `omg-autopilot`, `ralplan`, `plan`, `self-improve`) updated with CLI fallback — numbered markdown options when `vscode_askQuestions` is unavailable.
- **Documentation**: CLI badge, "Option C: Copilot CLI" quick start, `--target-env` usage added to all READMEs.

### v1.3.0 (2026-04-23) — Windows Support, MIT License & Non-Destructive Init

**Three community-requested improvements (Issues #5, #6, #7)**

- **Windows PowerShell support** (Fixes #5): Added `.ps1` equivalents for all shell scripts — `pre-tool-use.ps1`, `post-tool-use.ps1`, `omg-adopt.ps1`. Hooks bundled in extension templates. READMEs updated with PowerShell examples.
- **Non-destructive copilot-instructions.md** (Fixes #6): `initWorkspace` now appends OMG instructions to existing files instead of overwriting. Marker-based section detection supports re-init updates.
- **MIT License clarification** (Fixes #7): Added root `LICENSE` file for GitHub API detection. Removed "All rights reserved" contradictions from all READMEs.

### v1.2.0 (2026-04-17) — Agent Model Upgrade to Claude Opus 4.7

**Upgraded all agent model references from Claude Opus 4.6 to Claude Opus 4.7**

- Updated `model: [claude-opus-4-6]` → `model: [claude-opus-4-7]` across all 8 Opus-routed agents.
- Applied to both active agents (`.github/agents/`) and extension templates (`vscode-omg/resources/templates/agents/`).
- Affected agents: @architect, @code-reviewer, @planner, @security-reviewer, @analyst, @omg-coordinator, @code-simplifier, @critic.
- Verified: MCP server build + tests (**18/18**), vscode-omg build + tests (**28/28**), TypeScript type check — all passing.

### v1.1.9 (2026-04-16) — `.omc` → `.omg` State Path Migration

**State path consistency update across source + templates**

- Renamed remaining state path references from `.omc/` to `.omg/` across skills, agents, MCP templates, and extension templates.
- Updated hook state variable naming from `OMC_STATE_DIR` to `OMG_STATE_DIR` where applicable.
- Verified MCP server build and tests after migration (**18/18 passing**).
- Kept intentional `.omc/` mentions only in OMC-vs-OMG comparison table rows.

### v1.1.8 (2026-04-13) — Context Preservation & Memory Upgrade

**Major reliability upgrade for long-running workflows**

- Added Tier-2 memory enhancements to OMG MCP:
  - `omg_search_memory` for keyword lookup across keys, values, categories, and tags
  - `tags` support in `omg_write_memory`
  - Backward-safe reads for existing memory entries
- Added Tier-3 context-pressure protocol:
  - `omg_checkpoint`, `omg_restore_checkpoint`, `omg_context_status`
  - Auto checkpoint advisory from pre/post hooks based on accumulated tool I/O bytes
  - Configurable threshold via `OMG_CONTEXT_THRESHOLD` (default: 400KB)
- Hardened hook safety and lifecycle behavior:
  - Fixed checkpoint loop by resetting context counter after checkpoint
  - Improved force-push detection (`--force`, `-f`) while allowing `--force-with-lease`
  - Expanded destructive git guard coverage
- Added startup/session recovery guidance in `copilot-instructions.md`

### v1.1.7 (2026-04-12) — Interactive Hook System

**OMC-parity: mid-workflow user decisions via `vscode_askQuestions`**

Five core skills now fire structured multiple-choice prompts at decision gates, mirroring OMC's gateway-level interrupt hooks — natively inside VS Code Copilot.

#### Skills with Hooks

| Skill | Hook Points |
|-------|-------------|
| `/deep-interview` | Every interview round (with ambiguity %) · Spec approval · Execution bridge |
| `/plan` | Interview questions · Readiness gate · Trade-off selection · Critic rejection · Plan approval |
| `/ralplan` | Options selection · Architect concerns · Critic rejection · Final approval |
| `/self-improve` | Repo target · Trust confirmation · Goal interview · Harness rules (setup only — loop runs autonomously) |
| `/omg-autopilot` | Vague input redirect · Spec confirmation · QA stuck recovery · Validation rejection |

#### How It Works

- At each decision gate the skill calls `vscode_askQuestions` with 3–5 labelled options, a `recommended` default, and `allowFreeformInput: true`
- User selects an option (or types a custom answer) — the workflow continues based on the response
- All hook calls use a unique `header` (e.g. `"interview-round-3"`, `"ralplan-approval"`) for traceability
- Global hook protocol documented in `copilot-instructions.md → Interactive Hook System`

---

### v1.1.0 (2026-04-10) — ECC Integration

**Major upgrade: best-of-ECC (Everything Claude Code) features merged into OMG**

#### New Agents — Language Reviewer Tier (8)

Eight new language-specialist review agents, each with 13–21 embedded style rules and a canonical coding standards reference:

- **@typescript-reviewer** — strict mode, no-any, exhaustive discriminated unions
- **@python-reviewer** — PEP 8, type hints, idiomatic patterns
- **@rust-reviewer** — ownership, borrow checker, unsafe justification
- **@go-reviewer** — idiomatic Go, goroutine safety, explicit error handling
- **@java-reviewer** — SOLID, Spring patterns, null safety
- **@csharp-reviewer** — nullable analysis, async/await, C# idioms
- **@swift-reviewer** — Swift concurrency, memory safety, SwiftUI patterns
- **@database-reviewer** — query performance, parameterization, schema design

#### New Skills (4)

- **`/tdd`** — Full TDD enforcement: Red-Green-Refactor cycle, framework quick-ref (Jest/pytest/Cargo/Go test), gate table with fail conditions
- **`/security-scan`** — Rapid pre-commit security sweep: secrets patterns (sk-/ghp_/AKIA), CVE audit, input validation, auth checks
- **`/coding-standards`** — Canonical cross-language coding standards (naming, functions, errors, anti-patterns, SOLID). Cited by all reviewer agents.
- **`/skill-stocktake`** — Audit skill inventory for frontmatter validity, template sync, stubs, and coverage gaps

#### Enhanced Core Agents (7)

| Agent | What Was Added |
|-------|----------------|
| **@debugger** | 7-language build resolution guide (Node/TS, Python, Rust, Go, Java, C#, Swift) |
| **@security-reviewer** | Secrets detection regex patterns, JWT/session/crypto rules, OWASP annotations |
| **@qa-tester** | Playwright Page Object Model pattern, E2E classification table |
| **@writer** | CODEMAP generation template + auto-update workflow |
| **@code-reviewer** | Canonical D9 coding standards table embedded |
| **@test-engineer** | Framework detection table, coverage gap protocol, flaky test root causes |
| **@code-simplifier** | Complexity metrics table, simplification patterns, stability exceptions |

#### Enhanced Skill (1)

- **`/remember`** — Quality gate added: 3-question filter (actionable? durable? unique?) before storing to project memory

#### Infrastructure

- **Tiered agent/skill thresholds** in `convention.ts`: warn <20/18, info <28/22, silent ≥28/22 (backward compatible)
- **Tree-view category grouping**: agents auto-split into "Core Agents" + "Language Reviewers" when count >20
- **Post-tool-use hook** (`OMG_LINT_ON_EDIT=1`): opt-in TypeScript typecheck + ESLint on every file edit with `FILE_PATH` sanitization guard
- **Security patches**: hono/node-server CVEs fixed, vitest upgraded to 4.1.4, `.env*` added to `.gitignore`

---

### v1.0.5 (2026-04-10)

**Bug Fix: Skill name collision with VS Code built-in Autopilot**

- **Renamed** `/autopilot` skill to `/omg-autopilot` to avoid collision with VS Code's built-in "Autopilot (Preview)" permission level
- **Fixed** invalid YAML frontmatter in all SKILL.md files: removed unsupported `allowed-tools` field, renamed `hint` to `argument-hint` per VS Code spec
- **Root cause**: The skill name `autopilot` triggered VS Code's internal permission mode switch instead of loading the OMG skill instructions
- **Scope**: Updated skill directories, MCP server code, agent definitions, cross-references, tests, and all documentation

---

## License

MIT

---

## Copyright

Copyright (c) 2026 jmstar85. Licensed under the [MIT License](LICENSE).

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**The power of multi-agent orchestration, now for GitHub Copilot.**

</div>
