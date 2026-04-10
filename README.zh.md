<h1 align="center">oh-my-githubcopilot</h1>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ko.md">한국어</a> | 中文 | <a href="README.ja.md">日本語</a> | <a href="README.es.md">Español</a>
</p>

<p align="center">
  <strong>为 GitHub Copilot 提供多代理编排能力，进一步提升开发效率。</strong>
</p>

<p align="center">
  <a href="https://github.com/jmstar85/oh-my-githubcopilot"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="#quick-start">快速开始</a> •
  <a href="#agents">代理</a> •
  <a href="#skills">技能</a> •
  <a href="#mcp-server">MCP 服务器</a> •
  <a href="#architecture">架构</a>
</p>

---

<h1 align="center">Now, you can also use this amazing features such as OMC + ECC (Everything Claude Code) for GitHub Copilot!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

---

## OMG 是什么？

**oh-my-githubcopilot (OMG)** 将 [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) 在 Claude Code 上实现的多代理编排理念带到了 **GitHub Copilot**，同时融入了 **[Everything Claude Code (ECC)](https://github.com/GreatScottyMac/everything-claude-code)** 的精华特性，变得更加强大。

如果说 OMC 通过专业代理和工作流自动化增强了 Claude Code，那么 OMG 则在 VS Code 的 Copilot agent mode 中实现了类似能力。借助 ECC 集成（v1.1.0），OMG 还引入了 ECC 的经过验证的模式：8 个语言专家审查代理、TDD 强制执行、快速安全扫描、规范编码标准等。它不再依赖单个助手处理所有事情，而是通过 MCP 服务器协调 **28 个专业代理** 和 **22 个可复用技能**，以结构化方式完成规划、实现、审查与验证。

> **这不是 OMC 或 ECC 的 fork 或复制品。** 它是一个面向 GitHub Copilot 的独立实现，基于 Copilot 的代理定制能力（`.agent.md`、`.prompt.md`、`SKILL.md`、MCP 工具）从零构建，参考了 OMC 的多代理架构思路，并选择性地集成了 ECC 的经过验证的模式。

---

## 为什么选择 OMG？

- **直接工作在 VS Code 内部**，不需要额外 CLI 或外部运行时
- **专业分工的代理体系**，从只读分析型代理到可执行变更的实现型代理，包含 8 个语言审查代理
- **自动化工作流**，支持自驱执行的 `omg-autopilot`、持续推进的 `ralph`、并行处理的 `ultrawork`
- **安全护栏**，通过 pre/post tool-use hooks 阻止危险操作
- **基于 MCP 的状态管理**，在会话之间保存工作流状态、PRD 和项目记忆
- **自然语言触发**，例如直接说 “omg-autopilot build me a REST API”
- **验证优先**，把编写与审查分开，完成声明必须有证据支持

---

## Quick Start

### 前置条件

- 已启用 GitHub Copilot Chat 的 VS Code
- 你的 Copilot 环境支持 agent mode 或 agent customization
- 已安装 Node.js 和 npm，以便在本地构建 MCP 服务器
- 以受信任工作区方式打开项目，确保 MCP、prompts 和自定义文件正常加载

### 1. 克隆仓库

```bash
git clone https://github.com/jmstar85/oh-my-githubcopilot.git
cd oh-my-githubcopilot
```

### 2. 构建 MCP 服务器

```bash
cd mcp-server
npm install
npm run build
cd ..
```

### 3. 在 VS Code 中打开

在启用了 GitHub Copilot Chat 的 VS Code 中打开该项目。工作区会自动识别 MCP 服务器、代理、技能和 hooks 配置。

### 4. 直接开始构建

在 Copilot Chat 的 agent mode 中输入：

```
omg-autopilot: build a REST API for managing tasks
```

接下来 OMG 会接管规划、实现、审查和验证流程。

### 不知道从哪里开始？

如果需求还比较模糊，或者你想先理清思路：

```
deep-interview "I want to build a task management app"
```

OMG 会通过苏格拉底式提问找出隐藏假设，在写代码前先澄清问题。

---

## Agents

OMG 包含 **28 个专业代理**，每个代理都有明确的职责与权限范围，定义位于 `.github/agents/`。

| 代理 | 角色 | 权限 |
|-------|------|--------|
| **@omg-coordinator** | 主协调器，负责 omg-autopilot、ralph 和 team 工作流 | Full |
| **@executor** | 负责编码实现、功能开发和 bug 修复 | Full |
| **@debugger** | 根因分析、堆栈追踪、7语言构建错误解决指南 | Full |
| **@architect** | 架构分析、系统设计、结构建议 | Read-only |
| **@planner** | 战略规划与访谈式计划制定 | Plans only |
| **@analyst** | 需求分析、缺口识别、范围风险检查 | Read-only |
| **@verifier** | 基于证据的完成度验证与测试充分性评估 | Test runner |
| **@code-reviewer** | 严重度分级代码审查与编码规范应用 | Read-only |
| **@security-reviewer** | OWASP、密钥检测 (sk-/ghp_/AKIA)、认证与依赖安全审查 | Read-only |
| **@critic** | 严格的方案/代码 gate review | Read-only |
| **@test-engineer** | 测试策略、TDD、框架检测、易碎测试治理 | Full |
| **@designer** | UI/UX 设计与前端实现 | Full |
| **@writer** | README、API 文档、CODEMAP 生成 | Full |
| **@tracer** | 基于证据的因果追踪与假设验证 | Full |
| **@scientist** | 数据分析、统计与可视化 | Read-only |
| **@qa-tester** | 基于 VS Code 终端的 CLI 测试、Playwright POM、E2E 验证 | Full |
| **@git-master** | 原子提交、rebase、历史管理 | Git only |
| **@code-simplifier** | 简化代码、复杂度指标分析、消除重复 | Full |
| **@explore** | 搜索代码库、定位文件、梳理结构 | Read-only |
| **@document-specialist** | 外部文档研究与 API 资料检索 | Read-only |


### 语言审查代理 — Tier 2（8 个）

通过 `@mention` 进行语言专项代码审查：

| 代理 | 语言 | 核心规则 |
|-------|----------|----------|
| **@typescript-reviewer** | TypeScript | strict 模式、no-any、类型安全 |
| **@python-reviewer** | Python | PEP 8、类型提示、惯用模式 |
| **@rust-reviewer** | Rust | 所有权、借用检查、unsafe 合理化 |
| **@go-reviewer** | Go | 惯用 Go、goroutine 安全性、错误处理 |
| **@java-reviewer** | Java | SOLID、Spring 模式、null 安全 |
| **@csharp-reviewer** | C# | nullable 分析、async/await、C# 惯用 |
| **@swift-reviewer** | Swift | Swift 并发、内存安全、SwiftUI |
| **@database-reviewer** | SQL/ORM | 查询性能、参数化、模式设计 |

---

## Skills

技能是可通过斜杠命令或自然语言关键字触发的工作流例程，定义位于 `.github/skills/`。

### 工作流技能

| 技能 | 说明 | 触发关键字 |
|-------|-------------|-----------------|
| `/omg-autopilot` | 从想法到可运行代码的全自动执行 | `omg-autopilot`, `build me`, `create me` |
| `/ralph` | 基于 PRD 的持续执行循环，直到验证完成 | `ralph`, `don't stop`, `finish this` |
| `/ultrawork` | 高吞吐并行执行引擎 | `ulw`, `ultrawork`, `parallel` |
| `/team` | 多代理共享任务列表的分阶段协作模式 | `team`, `multi-agent`, `swarm` |
| `/plan` | 带可选访谈流程的结构化规划 | `plan this`, `let's plan` |
| `/ralplan` | Planner/Architect/Critic 共识式规划 | `ralplan`, `consensus plan` |
| `/ccg` | 结合 Claude、Codex、Gemini 视角的分析 | `ccg`, `tri-model`, `cross-validate` |

### 分析与质量技能

| 技能 | 说明 | 触发关键字 |
|-------|-------------|-----------------|
| `/deep-interview` | 用苏格拉底式提问澄清需求 | `deep interview`, `ask me everything` |
| `/deep-dive` | trace 后接 deep-interview 的双阶段分析 | `deep dive`, `investigate deeply` |
| `/trace` | 多假设并行的证据驱动根因分析 | `trace this`, `root cause analysis` |
| `/verify` | 验证修改是否真实可用 | `verify this`, `prove it works` |
| `/review` | 带严重度等级的代码审查 | `review this`, `code review` |
| `/ultraqa` | 测试、验证、修复循环直到通过 | `ultraqa`, `fix all tests` |
| `/ai-slop-cleaner` | 清理 AI 生成代码中的冗余与异味 | `deslop`, `anti-slop`, `cleanup slop` |
| `/self-improve` | 基于锦标赛选择的自主演化改进 | `self-improve`, `evolve code` |

### 工具型技能

| 技能 | 说明 | 触发关键字 |
|-------|-------------|-----------------|
| `/remember` | 将信息写入项目记忆 | `remember this`, `store this` |
| `/cancel` | 中止当前工作流模式 | `cancel`, `stop`, `abort` |
| `/status` | 查看当前状态和活跃代理 | `status`, `what's running` |

---

## MCP 服务器

OMG 包含一个 TypeScript 实现的 MCP 服务器，用于持久化工作流状态。它通过 `.vscode/mcp.json` 注册，并暴露以下工具组：

| 工具组 | 工具 | 用途 |
|-----------|-------|---------|
| **State** | `omg_read_state`, `omg_write_state`, `omg_clear_state`, `omg_list_active` | 工作流状态 CRUD 及活跃模式列表 |
| **PRD** | `omg_create_prd`, `omg_read_prd`, `omg_update_story`, `omg_verify_story` | PRD 创建、故事追踪与验证 |
| **Workflow** | `omg_check_completion`, `omg_next_phase`, `omg_get_phase_info` | 阶段切换、完成验证、阶段状态查询 |
| **Memory** | `omg_read_memory`, `omg_write_memory`, `omg_delete_memory` | 项目级知识持久化 |
| **Model Router** | `omg_select_model` | 根据任务复杂度推荐模型 |

状态数据保存在工作区的 `.omc/` 目录下。

```text
.omc/
├── state/              # 各模式的工作流状态
├── plans/              # 执行计划
├── prd.json            # 产品需求文档
└── project-memory.json # 项目记忆存储
```

---

## Tool Guardrails

OMG 在 `.github/hooks/` 中提供 pre/post tool-use hooks，作为安全保护层。

**Pre-tool-use 保护：**
- 阻止修改 `node_modules/`
- 阻止直接编辑 `.env`
- 防止删除 `package.json`、`tsconfig.json`、`.gitignore` 等关键配置
- 阻止 `git push --force` 和破坏性 git 操作

**Post-tool-use 跟踪：**
- 在 `OMG_DEBUG=1` 时记录工具使用日志
- 记录变更文件，帮助 omg-autopilot 感知阶段进度
- 跟踪测试结果，辅助 ultraqa 检测

---

## Architecture

```text
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # 根级编排说明
│   ├── agents/                    # 28 个专业代理定义（20 核心 + 8 语言审查）
│   ├── skills/                    # 22 个技能例程
│   ├── hooks/                     # pre/post tool-use 安全 hooks
│   └── prompts/                   # quick-fix、quick-plan、quick-review 模板
├── mcp-server/                    # TypeScript MCP 服务器
│   └── src/
│       ├── index.ts               # 服务器入口
│       ├── state-tools.ts         # 状态管理
│       ├── prd-tools.ts           # PRD 与故事追踪
│       ├── workflow-tools.ts      # 阶段转换与完成检查
│       ├── memory-tools.ts        # 项目记忆管理
│       └── model-router.ts        # 基于复杂度的模型路由
├── .vscode/mcp.json               # VS Code 中的 MCP 注册
└── .omc/                          # 运行时状态目录
```

### 工作原理

1. **Instructions** (`.github/copilot-instructions.md`) 定义编排规则和委派逻辑。
2. **Agents** (`.github/agents/*.agent.md`) 定义角色人格、工具权限和偏好。
3. **Skills** (`.github/skills/*/SKILL.md`) 通过关键字或斜杠命令按需加载。
4. **MCP Server** 负责持久化状态、PRD 和项目记忆。
5. **Hooks** 阻止危险操作，并留下工作流所需的执行痕迹。

---

## Commit Protocol

OMG 使用结构化 git trailer 保留决策上下文。

```text
fix(auth): prevent silent session drops during long-running ops

Auth service returns inconsistent status codes on token expiry,
so the interceptor catches all 4xx and triggers inline refresh.

Constraint: Auth service does not support token introspection
Rejected: Extend token TTL to 24h | security policy violation
Confidence: high
Scope-risk: narrow
```

可用 trailer：`Constraint`、`Rejected`、`Directive`、`Confidence`、`Scope-risk`、`Not-tested`

---

## 与 OMC 的对比

| 特性 | OMC (oh-my-claudecode) | OMG (oh-my-githubcopilot) |
|---------|----------------------|--------------------------|
| 目标平台 | Claude Code CLI | GitHub Copilot (VS Code) |
| 安装方式 | npm 包 / 插件市场 | 克隆仓库 + 构建 MCP 服务器 |
| 代理数量 | 19+ | 28 个代理（20 核心 + 8 语言审查） |
| 技能 | 10+ 个工作流技能 | 22 个技能与关键字触发 |
| 状态管理 | `.omc/` 目录 | 基于 MCP 的 `.omc/`（与 OMC 兼容的相同路径） |
| 多模型协作 | 通过 tmux CLI 使用 Codex/Gemini | 通过 ccg 技能提供建议式分析 |
| 配置位置 | `~/.claude/settings.json` | `.github/` + `.vscode/mcp.json` |
| 安全机制 | 插件级 hooks | Shell pre/post hooks |
| 状态可视化 | 内置 HUD | 依托 VS Code 原生环境 |

---

## 要求

- [VS Code](https://code.visualstudio.com/) 与 [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) 扩展
- 已启用 agent mode 的 GitHub Copilot Chat
- Node.js 18+（用于 MCP 服务器）

---

---

## What's New

### v1.1.0 (2026-04-10) — ECC 集成

**重大升级：将 ECC（Everything Claude Code）的精华功能合并至 OMG**

#### 新增代理 — 语言审查 Tier（8 个）

每个代理内置 13~21 条语言专项规则：

- **@typescript-reviewer** — strict 模式、no-any、完整判别联合
- **@python-reviewer** — PEP 8、类型提示、惯用模式
- **@rust-reviewer** — 所有权、借用检查、unsafe 合理化
- **@go-reviewer** — 惯用 Go、goroutine 安全性、显式错误处理
- **@java-reviewer** — SOLID、Spring 模式、null 安全
- **@csharp-reviewer** — nullable 分析、async/await、C# 惯用
- **@swift-reviewer** — Swift 并发、内存安全、SwiftUI 模式
- **@database-reviewer** — 查询性能、参数化、模式设计

#### 新增技能（4 个）

- **`/tdd`** — 完整 TDD 强制：红-绿-重构循环，框架参考（Jest/pytest/Cargo/Go test）
- **`/security-scan`** — 快速安全扫描：密钥模式（sk-/ghp_/AKIA）、CVE 审计、输入验证、认证检查
- **`/coding-standards`** — 跨语言编码规范参考（命名、函数、错误、反模式、SOLID）。所有审查代理均引用。
- **`/skill-stocktake`** — 技能清单审计：frontmatter 验证、模板同步、存根检测、覆盖率缺口

#### 现有核心代理强化（7 个）

| 代理 | 新增内容 |
|-------|----------------|
| **@debugger** | 7 语言构建错误解决指南（Node/TS、Python、Rust、Go、Java、C#、Swift） |
| **@security-reviewer** | 密钥检测正则表达式、JWT/会话/加密规则、OWASP 注解 |
| **@qa-tester** | Playwright Page Object Model 模式、E2E 分类表 |
| **@writer** | CODEMAP 生成模板 + 自动更新工作流 |
| **@code-reviewer** | D9 标准编码规范表内置 |
| **@test-engineer** | 框架检测表、覆盖率缺口协议、易碎测试根因 |
| **@code-simplifier** | 复杂度指标表、简化模式、稳定性例外处理 |

#### 现有技能强化（1 个）

- **`/remember`** — 新增质量门控：可执行性·持久性·唯一性三级过滤器

#### 基础设施

- **分层代理/技能阈值**：warn <20/18，info <28/22，silent ≥28/22（向后兼容）
- **树视图分类**：代理数 >20 时自动分为"Core Agents"+"Language Reviewers"
- **post-tool-use 钩子**（`OMG_LINT_ON_EDIT=1`）：文件编辑时可选 TypeScript 检查/ESLint + FILE_PATH 安全处理
- **安全补丁**：hono/node-server CVE 修复，vitest 升级至 4.1.4，`.env*` 加入 `.gitignore`

---

### v1.0.5 (2026-04-10)

**Bug 修复: 技能名称与 VS Code 内置 Autopilot 冲突**

- **重命名**: `/autopilot` 技能更名为 `/omg-autopilot`，避免与 VS Code 内置 "Autopilot (Preview)" 权限模式冲突
- **YAML frontmatter 修复**: 移除所有 SKILL.md 文件中不支持的 `allowed-tools` 字段，将 `hint` 更名为符合 VS Code 规范的 `argument-hint`
- **根本原因**: 技能名 `autopilot` 触发了 VS Code 内部权限模式切换，而非加载 OMG 技能指令
- **影响范围**: 技能目录、MCP 服务器代码、代理定义、交叉引用、测试及全部文档

## License

MIT

Copyright © 2026 jmstar85. All rights reserved.

本仓库的所有内容——包括但不限于源代码、文档、代理定义、技能定义、MCP 服务器实现、提示模板和配置文件——均为 **jmstar85**（仓库所有者）的知识产权。未经 MIT 许可证条款授权，严禁擅自复制、分发或商业使用。

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**面向 GitHub Copilot 的多代理编排能力。**

</div>