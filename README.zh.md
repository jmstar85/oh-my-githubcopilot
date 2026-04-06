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

<h1 align="center">Now, you can also use this amazing features such as OMC for GitHub Copilot!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

---

## OMG 是什么？

**oh-my-githubcopilot (OMG)** 将 [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) 在 Claude Code 上实现的多代理编排理念带到了 **GitHub Copilot**。

如果说 OMC 通过专业代理和工作流自动化增强了 Claude Code，那么 OMG 则在 VS Code 的 Copilot agent mode 中实现了类似能力。它不再依赖单个助手处理所有事情，而是通过 MCP 服务器协调 **20 个专业代理** 和 **18 个可复用技能**，以结构化方式完成规划、实现、审查与验证。

> **这不是 OMC 的 fork 或复制品。** 它是一个面向 GitHub Copilot 的独立实现，基于 Copilot 的代理定制能力（`.agent.md`、`.prompt.md`、`SKILL.md`、MCP 工具）从零构建，同时参考了 OMC 的多代理架构思路。

---

## 为什么选择 OMG？

- **直接工作在 VS Code 内部**，不需要额外 CLI 或外部运行时
- **专业分工的代理体系**，从只读分析型代理到可执行变更的实现型代理
- **自动化工作流**，支持自驱执行的 `autopilot`、持续推进的 `ralph`、并行处理的 `ultrawork`
- **安全护栏**，通过 pre/post tool-use hooks 阻止危险操作
- **基于 MCP 的状态管理**，在会话之间保存工作流状态、PRD 和项目记忆
- **自然语言触发**，例如直接说 “autopilot build me a REST API”
- **验证优先**，把编写与审查分开，完成声明必须有证据支持

---

## Quick Start

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
autopilot: build a REST API for managing tasks
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

OMG 包含 **20 个专业代理**，每个代理都有明确的职责与权限范围，定义位于 `.github/agents/`。

| 代理 | 角色 | 权限 |
|-------|------|--------|
| **@omg-coordinator** | 主协调器，负责 autopilot、ralph 和 team 工作流 | Full |
| **@executor** | 负责编码实现、功能开发和 bug 修复 | Full |
| **@debugger** | 根因分析、堆栈追踪、构建错误修复 | Full |
| **@architect** | 架构分析、系统设计、结构建议 | Read-only |
| **@planner** | 战略规划与访谈式计划制定 | Plans only |
| **@analyst** | 需求分析、缺口识别、范围风险检查 | Read-only |
| **@verifier** | 基于证据的完成度验证与测试充分性评估 | Test runner |
| **@code-reviewer** | 严重度分级代码审查与逻辑缺陷检查 | Read-only |
| **@security-reviewer** | OWASP、密钥、认证与依赖安全审查 | Read-only |
| **@critic** | 严格的方案/代码 gate review | Read-only |
| **@test-engineer** | 测试策略、TDD、易碎测试治理 | Full |
| **@designer** | UI/UX 设计与前端实现 | Full |
| **@writer** | README、API 文档、架构文档编写 | Full |
| **@tracer** | 基于证据的因果追踪与假设验证 | Full |
| **@scientist** | 数据分析、统计与可视化 | Read-only |
| **@qa-tester** | 基于 VS Code 终端的 CLI 测试、集成与 E2E 验证 | Full |
| **@git-master** | 原子提交、rebase、历史管理 | Git only |
| **@code-simplifier** | 简化代码、降低复杂度、消除重复 | Full |
| **@explore** | 搜索代码库、定位文件、梳理结构 | Read-only |
| **@document-specialist** | 外部文档研究与 API 资料检索 | Read-only |

---

## Skills

技能是可通过斜杠命令或自然语言关键字触发的工作流例程，定义位于 `.github/skills/`。

### 工作流技能

| 技能 | 说明 | 触发关键字 |
|-------|-------------|-----------------|
| `/autopilot` | 从想法到可运行代码的全自动执行 | `autopilot`, `build me`, `create me` |
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
| **State** | `omg_read_state`, `omg_write_state` | 管理 autopilot、ralph、ultrawork 等模式状态 |
| **PRD** | `omg_read_prd`, `omg_update_story`, `omg_verify_story` | 带用户故事追踪的 PRD 管理 |
| **Workflow** | `omg_check_completion`, `omg_next_phase` | 阶段切换与完成验证 |
| **Memory** | `omg_read_memory`, `omg_write_memory` | 保存项目知识 |
| **Model Router** | `omg_select_model` | 根据任务复杂度推荐模型 |

状态数据保存在工作区的 `.omc/` 目录下。

```text
.omc/
├── state/              # 各模式的工作流状态
├── plans/              # 执行计划
├── sessions/           # 会话跟踪
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
- 记录变更文件，帮助 autopilot 感知阶段进度
- 跟踪测试结果，辅助 ultraqa 检测

---

## Architecture

```text
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # 根级编排说明
│   ├── agents/                    # 20 个专业代理定义
│   ├── skills/                    # 18 个技能例程
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
| 代理数量 | 19+ | 20 个专业代理 |
| 技能 | 10+ 个工作流技能 | 18 个技能与关键字触发 |
| 状态管理 | `.omc/` 目录 | 基于 MCP 的 `.omc/` |
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

## License

MIT

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**面向 GitHub Copilot 的多代理编排能力。**

</div>