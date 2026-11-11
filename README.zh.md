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
  <img src="https://img.shields.io/badge/IDE-VS%20Code-007ACC?logo=visualstudiocode" alt="VS Code">
  <img src="https://img.shields.io/badge/CLI-Copilot%20CLI-181717?logo=github" alt="Copilot CLI">
</p>

<p align="center">
  <a href="#quick-start">快速开始</a> •
  <a href="#agents">代理</a> •
  <a href="#skills">技能</a> •
  <a href="#mcp-server">MCP 服务器</a> •
  <a href="#architecture">架构</a>
</p>

---

<h1 align="center">Now, you can enjoy OMG's amazing features integrating OMC + ECC!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">
    <img src="https://img.youtube.com/vi/3Zyf4a7LAH8/maxresdefault.jpg" alt="在 YouTube 上观看 OMG 演示" width="720" />
  </a>
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">▶ 在 YouTube 上观看 OMG 演示</a>
</p>

---

## OMG 是什么？

**oh-my-githubcopilot (OMG)** 将 [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) 在 Claude Code 上实现的多代理编排理念带到了 **GitHub Copilot**，同时融入了 **[Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code)** 的精华特性，变得更加强大。

如果说 OMC 通过专业代理和工作流自动化增强了 Claude Code，那么 OMG 则在 VS Code 的 Copilot agent mode 中实现了类似能力。借助 ECC 集成（v1.1.0）以及 OMC 技能的 OMG-native 适配移植，OMG 现在包含语言专家审查、TDD 强制执行、快速安全扫描、`ultragoal` 检查点、研究辅助、发布指导和视觉 QA 等能力。它不再依赖单个助手处理所有事情，而是通过 MCP 服务器协调 **28 个专业代理** 和 **37 个可复用技能**，以结构化方式完成规划、实现、审查与验证。

> **这不是 OMC 或 ECC 的 fork 或复制品。** 它是一个面向 GitHub Copilot 的独立实现，基于 Copilot 的代理定制能力（`.agent.md`、`.prompt.md`、`SKILL.md`、MCP 工具）从零构建，参考了 OMC 的多代理架构思路，并选择性地集成了 ECC 的经过验证的模式。

---

## 为什么选择 OMG？

- **在 VS Code 和 Copilot CLI 中直接工作** — 无需额外外部进程，支持 VS Code agent mode 或独立的 `copilot` CLI
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

### 方法 A: VS Code Extension（推荐）

1. 安装扩展（以下任选其一）:
   - **方式 1 — VSIX (CLI)**
     从[最新发布版本](https://github.com/jmstar85/oh-my-githubcopilot/releases/latest)下载 `oh-my-githubcopilot-1.5.0.vsix`，然后运行：
     ```bash
     code --install-extension ./oh-my-githubcopilot-1.5.0.vsix
     ```
     > 请将路径替换为你保存该文件的实际位置。
   - **方式 2 — VS Code 扩展面板 (UI)**
     在 VS Code 左侧 **Extensions**（`⇧⌘X` / `Ctrl+Shift+X`）中搜索 **`oh-my-githubcopilot`** 并安装。

2. 在 VS Code 中打开你的项目。

3. **⚡ 运行 `OMG: Initialize Workspace`（必须）**
   ```
   Cmd+Shift+P (macOS) / Ctrl+Shift+P (Windows/Linux) → "OMG: Initialize Workspace"
   ```

> [!IMPORTANT]
> **仅安装扩展是不够的。** 安装后必须通过 Command Palette 运行 `OMG: Initialize Workspace`。此命令会在工作区中生成所有 `.github/` 下的约定文件（代理、技能、hooks、prompts、copilot-instructions.md）并构建 MCP 服务器。没有此步骤，Copilot 将无法使用任何 OMG 代理或技能。

4. 出现提示时点击 **“重新加载窗口 (Reload Window)”** 激活所有代理和技能
5. 在 Copilot Chat（agent mode）中开始使用 OMG

### 方法 B: 手动克隆

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

### 方法 C: Copilot CLI

OMG 也可以在独立的 [Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)（`copilot` 二进制文件）中使用。CLI 读取相同的 `.github/` 约定文件（代理、技能、hooks、prompts）。

1. 安装 Copilot CLI 二进制文件。
2. 克隆 OMG 并构建 MCP 服务器：
   ```bash
   git clone https://github.com/jmstar85/oh-my-githubcopilot.git
   cd oh-my-githubcopilot
   cd mcp-server && npm install && npm run build && cd ..
   ```
3. 创建项目本地的 `.copilot/mcp-config.json`（或使用 `--global-mcp` 全局安装到 `~/.copilot/`）：
   ```bash
   scripts/omg-adopt.sh --target . --mode template --target-env cli
   ```
4. 在项目目录中运行 `copilot`：
   ```bash
   copilot
   ```
5. 使用 `/status` 或 `@omg-coordinator` 验证 OMG 已加载。

### 不知道从哪里开始？

如果需求还比较模糊，或者你想先理清思路：

```
deep-interview "I want to build a task management app"
```

OMG 会通过苏格拉底式提问找出隐藏假设，在写代码前先澄清问题。

### 在其他 VS Code 项目中使用 OMG

OMG 以工作区为单位运行，因此建议按项目单独应用。

本仓库包含一个用于应用到其他项目的脚本：

**macOS / Linux (Bash):**
```bash
scripts/omg-adopt.sh --target <目标项目路径> --mode <template|submodule|subtree> [--target-env vscode|cli|both]
```

**Windows (PowerShell):**
```powershell
scripts/omg-adopt.ps1 -Target <目标项目路径> -Mode <template|submodule|subtree> [-TargetEnv vscode|cli|both]
```

`--target-env` 参数（默认值：`both`）控制要设置的环境：
- `vscode` — 仅 VS Code（`.vscode/mcp.json`）
- `cli` — 仅 Copilot CLI（`.copilot/mcp-config.json` + `hooks.json`）
- `both` — 两种环境都设置（默认）

应用后，以受信任工作区方式打开目标项目，并在 Copilot Chat（agent mode）中运行以下命令验证：

```text
/status
```

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

OMG 现在包含 37 个技能，包括面向 VS Code/Copilot 适配的 OMC-inspired 工作流：`ultragoal`、`visual-verdict`、`release`、`deepinit`、`skillify`、`writer-memory`、`configure-notifications`、`wiki`、`autoresearch`、`hud`、`external-context`、`sciomc` 和 `ask`。

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

OMG 包含一个 TypeScript 实现的 MCP 服务器，用于持久化工作流状态。它通过 `.vscode/mcp.json` 注册，并暴露以下六个工具：

| 工具 | 用途 |
|------|---------|
| `omg_read` | 按 `scope` 读取工作流状态：`state`、`prd`、`phase`、`ultragoal`、`checkpoint` 或 `all`（精简摘要） |
| `omg_write` | 写入状态、创建 PRD 与故事、推进 autopilot 阶段、记录 ultragoal 里程碑（`scope` + `op`：`set`、`clear`、`advance`） |
| `omg_verify` | 将 PRD 故事标记为通过，或完成 ultragoal — fail-closed：除非证据非空且每一项均已通过，否则一律拒绝 |
| `omg_check_completion` | 完成门禁：活跃的工作流、未验证的故事、活跃的 ultragoal |
| `omg_checkpoint` | 保存会话检查点，并返回供下一个会话使用的交接文本（通过 `omg_read scope:"checkpoint"` 恢复） |
| `omg_memory` | 项目级知识：`get`、`search`、`set`、`delete` |

> **从 1.4.x 升级？** 早期版本的 27 个工具已在 v1.5.0 中合并为这六个（[对照表](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/design/v1.5-context-diet.md#42-target-surface-6-tools)）。如需在 2.0 之前以已弃用适配器的形式保留旧名称，请在 `.vscode/mcp.json` 中服务器的 `env` 里设置 `OMG_LEGACY_TOOLS=1`。

状态数据保存在工作区的 `.omg/` 目录下。

```text
.omg/
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

## 基准测试

> 所有数据均来源于实际的 git 提交历史、测试套件和 `npm audit` 结果，无合成数据。

### 上下文占用（v1.5.0）

在你的任务开始之前，OMG 为**每一次** Copilot 请求额外增加的 token 数（o200k tokenizer；MCP 工具基于实际的 `tools/list` 响应测量）。可通过 `cd evals && npm install && npm run baseline` 复现。

| 始终注入的上下文 | v1.4.4 | v1.5.0 | 变化 |
|-------------------------|-------:|-------:|:------:|
| `copilot-instructions.md` | 3,594 | 549 | −85% |
| MCP 工具定义 | 2,585（27 个工具） | 863（6 个工具） | −67% |
| 技能描述（37 个） | 1,308 | 1,331 | +2% |
| 代理描述（28 个） | 1,213 | 1,213 | — |
| Prompt 文件（3 个） | 38 | 38 | — |
| **合计** | **8,738** | **3,994** | **−54%** |

> 此为下限值：宿主在工具列表外围附加的包装文本，以及 hooks 触发时注入的内容均未计入。代理和技能的正文按需加载。已移除的关键字表中的每个短语，仍会与所属技能的描述逐一核对（`npm run activation`：80 个短语，0 个缺失）。

### 项目快照（v1.3.0）

| 指标 | 值 |
|------|----| 
| 代码库总量 | 25,964 行 |
| 开发周期 | 12 天（2026年4月6–17日） |
| 总提交数 | 33 |
| 代理数量 | 28（核心 20 + 语言审查 8） |
| 技能数量 | 22 |
| MCP 工具数 | 19 |

### 质量指标

| 指标 | v1.0（初始） | v1.3.0（OMG 流水线后） |
|------|:-:|:-:|
| 测试通过率 | 无 | **46 / 46（100%）** |
| TypeScript 错误 | 未检查 | **0** |
| 已知 CVE | 7 个（生产 2 + 开发 5） | **0** |
| Pre-hook 安全守卫 | 0 | **6** |
| Post-hook 追踪功能 | 0 | **8** |

### ECC 集成 — 单次提交影响（`9468c02`）

| 指标 | 值 |
|------|----|
| 变更文件数 | 60 |
| 新增行数 | 5,844 |
| 新增代理 | 8 个语言审查代理 |
| 新增技能 | 4 个（`/tdd`、`/security-scan`、`/coding-standards`、`/skill-stocktake`） |
| 合并前发现缺陷 | Hook Shell 注入 + 7 个 CVE |

### RALPLAN 共识规划结果

| 审查决策数 | 通过 | `@critic` 拒绝 | 拒绝率 |
|:-:|:-:|:-:|:-:|
| 9 | 7 | **2** | **22%** |

> 22% 的设计决策在编写任何代码之前就在规划阶段得到了修正。

### 安全扫描结果

| 类别 | 发现 | 修复 |
|------|:-:|:-:|
| 硬编码密钥 | 0 | — |
| 生产 CVE | 中危 2 个 | ✅ |
| 开发 CVE | 中危 5 个 | ✅ |
| Shell 注入（Hook `FILE_PATH`） | 1 个 | ✅ |
| `.env` 未加入 `.gitignore` | 1 个 | ✅ |
| **修复后总漏洞数** | | **0** |

### Pre-Tool-Use 安全守卫

| 守卫 | 拦截操作 |
|------|----------|
| `node_modules` 写保护 | 编辑/创建 `node_modules/` 内文件 |
| `.env` 密钥保护 | 直接修改 `.env` 文件 |
| 关键配置文件删除防护 | 删除 `package.json`、`tsconfig.json`、`.gitignore` |
| 强制推送防护 | `git push --force` |
| 硬重置防护 | `git reset --hard`、`git clean -fd` |
| 路径穿越防护 | `FILE_PATH` 中的 `../` 及特殊字符 |

---

## Architecture

```text
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # 根级编排说明
│   ├── agents/                    # 28 个专业代理定义（20 核心 + 8 语言审查）
│   ├── skills/                    # 37 个技能例程
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
└── .omg/                          # 运行时状态目录
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
| 技能 | 10+ 个工作流技能 | 37 个技能与关键字触发 |
| 状态管理 | `.omc/` 目录 | 基于 MCP 的 `.omg/` |
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

### v1.5.0 (2026-11-11) — 上下文瘦身

**OMG 现在每次请求占用的上下文不到原来的一半。** 始终注入的 token 从 8,738 降至 3,994（−54%），而你调用的工作流没有任何变化。详见“基准测试”一节中的“上下文占用（v1.5.0）”表。

- **`copilot-instructions.md`：3,594 → 549 tokens。** 代理、技能、关键字和工具目录与 Copilot 已从 frontmatter 和工具 schema 中获得的信息重复；现在只保留始终生效的约束（完成前必须有证据、独立的审查环节、提交 trailer、hook 边界、优雅降级）。
- **MCP 工具：27 → 6**（`omg_read`、`omg_write`、`omg_verify`、`omg_check_completion`、`omg_checkpoint`、`omg_memory`），2,585 → 863 tokens。`.omg/` 下的磁盘格式保持不变 — 1.4.x 的状态无需迁移即可读取。
- **Fail-closed 验证**：只有通过 `omg_verify` 并提供每一项均已通过的非空证据，才能将 PRD 故事标记为通过，或将 ultragoal 标记为完成。
- **触发短语保留**：关键字表已移除，但其中列出的每个短语仍会通过技能描述激活对应技能（已核对 80 个短语；恢复 7 个 — `prd loop`、`story loop`、`stakeholder interview`、`check secrets`、`audit deps`、`cancel omg`、`cancelomc`）。
- **会话预算规则**：上下文窗口用到 50% 时，代理会完成正在进行的编辑、提交已验证的工作、创建检查点，并以自包含的提示词完成交接；`omg_checkpoint` 会返回交接文本。
- **修复**：`OMG: Update Convention Files` 现在会重新构建 MCP 服务器（此前只有 Initialize 会这样做）。PowerShell hooks：force-push 守卫会漏掉位于工具输入末尾的 `--force` / `-f`，且两个 hook 在 Windows PowerShell 5.1 上都会失败 — 现已修复，行为与 bash hooks 一致。
- **可度量**：`evals/` 新增占用基线（`npm run baseline`）、静态激活检查（`npm run activation`）以及可选的实时 CLI 探测。
- **文档**：[ADR-0001](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/adr/0001-replatform.md)（v2 方向）、[威胁模型草案](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/security/threat-model.md)以及 [v1.5 设计文档](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/design/v1.5-context-diet.md)。

**从 1.4.x 升级**

1. 安装 1.5.0 VSIX，运行 `OMG: Update Convention Files`，然后重新加载窗口。手动安装的用户：复制 `.github/` 和 `mcp-server/`，然后执行 `cd mcp-server && npm install && npm run build`。
2. 如果你自己的 prompts 或代理调用了旧的工具名称，请将它们迁移到六个新工具，或在服务器的 `env`（`.vscode/mcp.json`）中设置 `OMG_LEGACY_TOOLS=1`，以已弃用适配器的形式保留 1.4 的名称。

**已弃用 — 将在 2.0 中移除**

- 1.4 的 MCP 工具名称（仅在设置 `OMG_LEGACY_TOOLS=1` 时可用）。
- `/resume-claude`、`/push-omc` 以及 OMC 桥接工具（在 1.5 中同样需要 `OMG_LEGACY_TOOLS=1`）。
- `omg_select_model`（代理在 frontmatter 中声明 `model:`）。

- **验证**：MCP 服务器构建及 51 项测试（50 项通过；symlink 测试在 Windows 上需要符号链接权限），VS Code extension 29 项单元测试，上下文占用 3,994 tokens，激活检查 80/80。
- VSIX：`oh-my-githubcopilot-1.5.0.vsix`，作为附件随 GitHub Release 发布（不再提交到仓库）。

### v1.4.4 (2026-05-16) — OMC 技能适配移植 + Ultragoal MCP

**将高价值 OMC 工作流以 VS Code/Copilot-native 的方式移植到 OMG。** 本版本将 OMG 扩展到 37 个技能，并加入 MCP 支撑的 durable goal tracking。

- `ultragoal` MCP 工具：`omg_ultragoal_create`、`omg_ultragoal_status`、`omg_ultragoal_checkpoint`、`omg_ultragoal_complete`。
- 新增 13 个适配技能：`visual-verdict`、`release`、`deepinit`、`skillify`、`writer-memory`、`configure-notifications`、`ultragoal`、`wiki`、`autoresearch`、`hud`、`external-context`、`sciomc`、`ask`。
- 更新 Copilot instructions、关键字触发、hook gates 和技能阈值（`CORE=24`、`EXTENDED=37`）。
- 验证：MCP 23 项测试通过，VS Code extension 29 项测试通过，VSIX <20MB。
- VSIX：`oh-my-githubcopilot-1.4.4.vsix`。

### v1.4.3 (2026-05-11) — 双向桥接:OMG → OMC 推送

**将 v1.4.0 的单向桥接补齐为 OMG ↔ OMC 完整往返。** v1.4.0 只提供 `omc → omg` 单向导入,v1.4.3 增加了反向的 `omg → omc` 导出,使 GitHub Copilot 中的工作可以在 Claude Code 中继续。

- **新模块 `mcp-server/src/bridge/omg-exporter.ts`**:采用组合(composition)而非简单复制 — `prd.json` 和 `project-memory.json` 为文件级复制;OMG 检查点中的 `active_modes[]` 会被**分解(decompose)**为按模式拆分的 `.omc/state/{mode}-state.json` 文件(v1.4.0 omc-importer 组合操作的反向);`.omc/state/session-checkpoint.json` 以转换后的来源信息(provenance)重新组合。
- **新共享辅助 `mcp-server/src/bridge/conflict-utils.ts`**:`shouldSkipForConflict()` 在判断 `session-checkpoint.json` 冲突时,优先使用嵌入的 `timestamp` 字段(其他文件回退到 mtime — 解决 git checkout 触碰 mtime 的脆弱性);`rotateBackup()` 保留最近 N=3 个带时间戳的 `.previous.{ISO}.json` 快照,在 import/export 两侧对称应用。
- **新 MCP 工具 `omg_export_external_session({target: "omc", force?})`** 的原子性契约:`.omg/state/last-export-token.json` 的写入是最后一个副作用 — 部分写入失败时不会留下 token,后续操作将事务正确地视为未提交。
- **双写循环守卫保证往返安全**:importer 读取 `.omg/state/last-export-token.json` 或目标检查点的 `source_origin === "bridged-from-omg"`,任意一侧匹配即触发守卫。一侧被擦除也仍然受保护。无时间 TTL;只有当目标的 `source_origin` 翻为 `"native"` 或 `source_session_id` 改变时,token 才失效。
- **来源元数据 schema 扩展**(向后兼容):新增 `source_origin` 字段(`"native" | "bridged-from-omc" | "bridged-from-claude-code" | "bridged-from-omg"`)为权威 provenance 信号;旧的 `source_tool: "copilot"` 保留。新增 `workspace_root` 字段驱动项目身份守卫,当源检查点的 workspace 路径与当前 workspace 不一致时,在**任何文件变更之前**中止。
- **`/push-omc` 技能(6 步)**:detect → compare → confirm → export → summarize → continue。触发关键字:`/push-omc`、`"push omc"`、`"omc 푸시"`、`"omc로 보내기"`、`"sync to omc"`、`"export to omc"`。镜像位于 `vscode-omg/resources/templates/skills/push-omc/SKILL.md`。
- **VS Code 命令 `omg.pushExternal`** ("OMG: Push to External Session (OMC)"):仅由用户触发 — 激活时不弹出推送通知(推送始终为显式用户操作)。
- **`omg_compare_checkpoints` 双向报告**:除 `newer_than_omg` 外现在还返回 `omg_newer_than_external`,使 `/push-omc` 与 `/resume-claude` 共用同一比较表面。
- **测试 8 → 18+**,分布在 6 个分区(Unit、Provenance、Round-trip guard、Composition、Conflict-path、Project-identity)。
- **延后至 v1.5.x**:`omg → claude-code` 方向。需要合成与 Claude Code resume-by-id 契约兼容的有效 `tool_use`/`tool_result` UUID 链;tracking:TBD。
- VSIX:`oh-my-githubcopilot-1.4.3.vsix`。

### v1.4.2 (2026-05-10) — Opus 4.7 → 4.6 回退数组

**通过将 `Claude Opus 4.6 (copilot)` 作为内联回退,使 Opus 4.7 路由对 cost-tier 安全。**

- 7 个深度推理代理(`analyst`、`architect`、`code-reviewer`、`critic`、`omg-coordinator`、`planner`、`security-reviewer`)的 `model:` 改为 YAML 数组:`["Claude Opus 4.7 (copilot)", "Claude Opus 4.6 (copilot)"]`。
- 背景:VS Code Copilot 会阻止超过当前聊天模型 cost-tier 上限的子代理调用。当基础模型为 `GPT-5.5`(7.5x)时,仅指定 `Opus 4.7`(15x)会直接失败,而不会降级。
- 新行为:如会话上限允许则使用 Opus 4.7;否则代理会透明回退到 Opus 4.6,而不是失败。
- GPT-5.5(15 个代理)和 Sonnet 4.6(6 个代理)的路由不变。
- VSIX:`oh-my-githubcopilot-1.4.2.vsix`。

### v1.4.1 (2026-05-09) — 基于代理角色的模型路由

**将全部 28 个代理重新映射到更适合任务类型的 Copilot 模型偏好**

- 将代理 `model:` frontmatter 更新为 `GPT-5.5 (copilot)`、`Claude Sonnet 4.6 (copilot)` 等 qualified model name 字符串。
- 高风险推理与审批代理保持使用 Claude Opus 4.7；调试、验证、研究、测试、设计和专业审查代理使用 GPT-5.5；执行、探索、文档、QA 驱动、git 和简化工作流使用 Claude Sonnet 4.6。
- `omg_select_model` 现在使用同一组允许模型和基于角色的代理 override，移除过时的 `gpt-4.1`、`gpt-4.1-mini` 和点格式 Claude 模型推荐。
- 模型 smoke test: `GPT-5.5 (copilot)` 调用成功；`Claude Opus 4.7 (copilot)` 被 Copilot 识别，但在当前环境中因 cost-tier 限制被阻止，并非 stale 模型字符串问题。

| 代理 | 模型 |
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

Opus 4.6 仅作为模型路由器中的显式 fallback 备选保留，不作为任何代理的默认模型。

### v1.4.0 (2026-05-03) — Claude Code / OMC 会话桥接

**单向桥接：在 GitHub Copilot 中恢复中断的 Claude Code 或 OMC 会话**

- **Claude Code JSONL 导入器**: 解析 `~/.claude/projects/` 会话日志，提取修改的文件、最后的用户提示和最后的助手回复。支持 Write/Edit/MultiEdit tool_use 块检测。
- **OMC 导入器**: 将 `.omc/` 状态目录（PRD、工作流状态、检查点、项目记忆）映射到 `.omg/` 等价物，基于 mtime 解决冲突。
- **3 个新 MCP 工具**: `omg_detect_external_session`（只读检测）、`omg_import_external_session`（备份后导入）、`omg_compare_checkpoints`（时间戳对比）。
- **VS Code 自动检测**: 激活时检测外部会话并显示通知（"继续 / 忽略 / 始终忽略"）。OMG 检查点在 30 分钟内则跳过。
- **`/resume-claude` 技能**: 6 步工作流 — 检测 → 对比 → 确认 → 导入 → 摘要 → 继续。关键词触发："resume claude"、"继续接手"、"继续工作"。
- **安全**: 导入的检查点文件设置为 `chmod 0600`。现有检查点在导入前备份为 `.previous.json`。
- **检查点模式扩展**: 4 个新可选字段 — `source_tool`、`source_session_id`、`imported_at`、`imported_summary`（向后兼容）。

### v1.3.1 (2026-04-23) — Copilot CLI 支持

**VS Code 代理模式和独立 Copilot CLI 双兼容** (Issue #4)

- **代理前置元数据规范化**: 全部28个代理的 `model:` 字段从数组改为字符串格式。CLI 工具等价物（`read`、`edit`、`shell`、`create`、`delete`）添加到 `tools:` 列表。
- **Hook 双模式输入**: pre/post tool-use hook 同时接受 VS Code 环境变量和 CLI stdin JSON。工具名规范化将 CLI 名称映射为 VS Code 等价物后执行防护逻辑。
- **`hooks.json` 注册**: CLI hook 包装器文件，用于 `preToolUse` / `postToolUse` 发现。
- **Adopt 脚本 `--target-env`**: 新增 `--target-env vscode|cli|both` 标志（默认：`both`）。CLI 模式生成 `.copilot/mcp-config.json`，跳过 `.vscode/mcp.json`。`--global-mcp` 在 `~/.copilot/` 全局安装。
- **技能 CLI 回退**: 5个交互技能（`deep-interview`、`omg-autopilot`、`ralplan`、`plan`、`self-improve`）添加 CLI 回退 — `vscode_askQuestions` 不可用时显示 Markdown 编号选项。
- **文档更新**: CLI 徽章、"方法 C: Copilot CLI" 快速开始、`--target-env` 用法添加到所有 README。

### v1.3.0 (2026-04-23) — Windows 支持、MIT 许可证 & 非破坏性初始化

**三项社区请求改进 (Issues #5, #6, #7)**

- **Windows PowerShell 支持** (Fixes #5): 为所有 shell 脚本添加 `.ps1` 等价物 — `pre-tool-use.ps1`、`post-tool-use.ps1`、`omg-adopt.ps1`。Hook 模板已打包到扩展中。README 添加 PowerShell 示例。
- **copilot-instructions.md 非破坏处理** (Fixes #6): `initWorkspace` 不再覆盖现有文件，改为追加 OMG 内容。基于标记的段落检测支持重新初始化时更新。
- **MIT 许可证明确化** (Fixes #7): 添加根目录 `LICENSE` 文件供 GitHub API 检测。移除所有 README 中“All rights reserved”矛盾表述。

### v1.2.0 (2026-04-17) — Agent 模型升级至 Claude Opus 4.7

**所有 agent 模型引用从 Claude Opus 4.6 升级到 4.7**

- `model: [claude-opus-4-6]` → `model: [claude-opus-4-7]`：覆盖全部 8 个 Opus 路由 agent
- 同时更新活跃 agents（`.github/agents/`）和扩展模板（`vscode-omg/resources/templates/agents/`）
- 涉及 agents: @architect, @code-reviewer, @planner, @security-reviewer, @analyst, @omg-coordinator, @code-simplifier, @critic
- 验证通过: MCP server build+test（**18/18**）、vscode-omg build+test（**28/28**）、TypeScript 类型检查

### v1.1.9 (2026-04-16) — `.omc` → `.omg` 状态路径迁移

**统一源码与模板中的状态路径**

- 将剩余 `.omc/` 引用统一替换为 `.omg/`（覆盖 skills、agents、MCP/extension 模板）
- Hook 状态变量名由 `OMC_STATE_DIR` 更新为 `OMG_STATE_DIR`
- 迁移后已完成 MCP server build/test 验证（**18/18 通过**）
- 仅在 OMC 对比表中保留有意的 `.omc/` 文案

### v1.1.8 (2026-04-13) — 上下文保留与内存增强

**显著提升长流程执行的稳定性**

- Tier-2 内存能力增强：
  - 新增 `omg_search_memory`（跨 key/value/category/tags 检索）
  - `omg_write_memory` 新增 `tags` 支持
  - 对历史内存数据保持向后兼容
- Tier-3 上下文压力协议：
  - `omg_checkpoint`, `omg_restore_checkpoint`, `omg_context_status`
  - 基于 Tool I/O 累积字节的自动 checkpoint 提示
  - 通过 `OMG_CONTEXT_THRESHOLD` 配置阈值（默认 400KB）
- Hook 安全与生命周期强化：
  - checkpoint 后重置计数器，避免 advisory 循环
  - 强化 force push 检测（`--force`, `-f`），允许 `--force-with-lease`
  - 扩展高风险 git 命令拦截规则
- 在 `copilot-instructions.md` 中新增会话恢复与启动恢复规则

### v1.1.7 (2026-04-12) — 交互式 Hook 系统

**OMC 同等功能：通过 `vscode_askQuestions` 实现工作流中途用户决策**

五个核心技能现在会在决策节点弹出结构化多选提示，与 OMC 的网关级中断钩子完全对等——并且原生运行在 VS Code Copilot 中。

#### 已添加 Hook 的技能

| 技能 | Hook 触发点 |
|------|-------------|
| `/deep-interview` | 每轮访谈（含歧义 %）· 规格确认 · 执行路径选择 |
| `/plan` | 访谈问题 · 就绪门控 · 权衡选择 · 批评者拒绝 · 方案审批 |
| `/ralplan` | 选项选择 · 架构师关注点 · 批评者拒绝 · 最终审批 |
| `/self-improve` | 目标仓库 · 信任确认 · 目标访谈 · 约束规则（仅设置阶段——循环自主运行） |
| `/omg-autopilot` | 模糊输入重定向 · 规格确认 · QA 重复失败 · 验证拒绝 |

#### 工作原理

- 在每个决策节点，技能调用 `vscode_askQuestions`，提供 3~5 个带标签的选项、`recommended` 默认值和 `allowFreeformInput: true`
- 用户选择选项或自由输入后，工作流按响应继续执行
- 所有 hook 调用使用唯一的 `header` 以便追踪（如 `"interview-round-3"`、`"ralplan-approval"`）
- 全局 hook 协议记录在 `copilot-instructions.md → Interactive Hook System`

---

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

Copyright (c) 2026 jmstar85. 根据 [MIT 许可证](LICENSE) 分发。

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**面向 GitHub Copilot 的多代理编排能力。**

</div>