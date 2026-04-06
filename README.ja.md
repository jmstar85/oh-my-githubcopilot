<h1 align="center">oh-my-githubcopilot</h1>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ko.md">한국어</a> | <a href="README.zh.md">中文</a> | 日本語 | <a href="README.es.md">Español</a>
</p>

<p align="center">
  <strong>GitHub Copilot のためのマルチエージェントオーケストレーション。開発生産性をさらに強化します。</strong>
</p>

<p align="center">
  <a href="https://github.com/jmstar85/oh-my-githubcopilot"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
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

## OMG とは？

**oh-my-githubcopilot (OMG)** は、[oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) が Claude Code 上で実現したマルチエージェントオーケストレーションの考え方を **GitHub Copilot** に持ち込むプロジェクトです。

OMC が専門エージェントとワークフロー自動化によって Claude Code を拡張したように、OMG は VS Code の Copilot agent mode 上で同じ発想を実装します。1つのアシスタントにすべてを任せるのではなく、**20 の専門エージェント** と **18 の再利用可能なスキル** を MCP サーバー経由で連携させ、計画、実装、レビュー、検証を構造化して進めます。

> **これは OMC のフォークやコピーではありません。** GitHub Copilot のエージェントカスタマイズ機能（`.agent.md`、`.prompt.md`、`SKILL.md`、MCP ツール）に合わせてゼロから独立実装されたもので、OMC のマルチエージェント設計思想から着想を得ています。

---

## なぜ OMG なのか？

- **VS Code 内でそのまま動作**。追加の CLI や外部ランタイムは不要
- **役割分担された専門エージェント**。読み取り専用の分析役から実装担当まで明確に分離
- **ワークフロー自動化**。自律実行の `autopilot`、完了まで粘る `ralph`、並列処理の `ultrawork`
- **安全ガードレール**。pre/post tool-use hooks による危険操作の防止
- **MCP ベースの状態管理**。ワークフロー状態、PRD、プロジェクトメモリをセッション間で保持
- **自然言語トリガー**。たとえば “autopilot build me a REST API” と入力するだけ
- **検証優先**。作成とレビューを分離し、完了宣言は証拠必須

---

## Quick Start

### 1. クローン

```bash
git clone https://github.com/jmstar85/oh-my-githubcopilot.git
cd oh-my-githubcopilot
```

### 2. MCP サーバーをビルド

```bash
cd mcp-server
npm install
npm run build
cd ..
```

### 3. VS Code で開く

GitHub Copilot Chat を有効にした VS Code でこのプロジェクトを開くと、MCP サーバー、エージェント、スキル、hooks の設定がワークスペースから自動検出されます。

### 4. すぐに作業開始

Copilot Chat の agent mode で次のように入力します。

```
autopilot: build a REST API for managing tasks
```

以降は OMG が計画、実装、レビュー、検証を進めます。

### どこから始めるべきかわからない場合

要件がまだ曖昧な場合や、設計の前に考えを整理したい場合は次を使えます。

```
deep-interview "I want to build a task management app"
```

OMG はソクラテス式の質問で隠れた前提をあぶり出し、コードを書く前に問題を明確化します。

---

## Agents

OMG には **20 の専門エージェント** があり、それぞれの役割とアクセス範囲が定義されています。定義ファイルは `.github/agents/` にあります。

| エージェント | 役割 | 権限 |
|-------|------|--------|
| **@omg-coordinator** | autopilot、ralph、team ワークフローを統括するメイン調整役 | Full |
| **@executor** | 実装担当。機能追加やバグ修正を行う | Full |
| **@debugger** | 根本原因分析、スタックトレース、ビルドエラー修正 | Full |
| **@architect** | アーキテクチャ分析、設計、構造レビュー | Read-only |
| **@planner** | 戦略的プランニングとインタビュー型計画立案 | Plans only |
| **@analyst** | 要件分析、抜け漏れ検出、スコープリスク確認 | Read-only |
| **@verifier** | 証拠ベースの完了確認、テスト妥当性評価 | Test runner |
| **@code-reviewer** | 重大度付きコードレビュー、ロジック欠陥検査 | Read-only |
| **@security-reviewer** | OWASP、秘密情報、認証認可、依存関係の監査 | Read-only |
| **@critic** | 厳格なプラン/コードレビューゲート | Read-only |
| **@test-engineer** | テスト戦略、TDD、flaky test 対策 | Full |
| **@designer** | UI/UX 設計とフロントエンド実装 | Full |
| **@writer** | README、API ドキュメント、アーキテクチャ文書作成 | Full |
| **@tracer** | 証拠ベースの因果追跡と仮説検証 | Full |
| **@scientist** | データ分析、統計、可視化 | Read-only |
| **@qa-tester** | VS Code ターミナルベースの CLI テスト、統合/E2E 検証 | Full |
| **@git-master** | 原子的コミット、rebase、履歴管理 | Git only |
| **@code-simplifier** | コード簡素化、複雑さ削減、重複除去 | Full |
| **@explore** | コード探索、ファイル検索、構造把握 | Read-only |
| **@document-specialist** | 外部ドキュメント調査、API リファレンス確認 | Read-only |

---

## Skills

スキルはスラッシュコマンドや自然言語キーワードで起動できる再利用可能なワークフロールーチンです。`.github/skills/` に定義されています。

### ワークフロースキル

| スキル | 内容 | トリガーキーワード |
|-------|-------------|-----------------|
| `/autopilot` | アイデアから動くコードまでを自律実行 | `autopilot`, `build me`, `create me` |
| `/ralph` | PRD ベースの継続実行ループ。検証完了まで止まらない | `ralph`, `don't stop`, `finish this` |
| `/ultrawork` | 高スループットな並列実行エンジン | `ulw`, `ultrawork`, `parallel` |
| `/team` | 共有タスクリスト上で複数エージェントを段階的に調整 | `team`, `multi-agent`, `swarm` |
| `/plan` | インタビュー付きの構造化プランニング | `plan this`, `let's plan` |
| `/ralplan` | Planner/Architect/Critic による合意形成型プランニング | `ralplan`, `consensus plan` |
| `/ccg` | Claude、Codex、Gemini 視点を組み合わせた分析 | `ccg`, `tri-model`, `cross-validate` |

### 分析・品質スキル

| スキル | 内容 | トリガーキーワード |
|-------|-------------|-----------------|
| `/deep-interview` | ソクラテス式質問で要件の曖昧さを解消 | `deep interview`, `ask me everything` |
| `/deep-dive` | trace から deep-interview へつなぐ二段階分析 | `deep dive`, `investigate deeply` |
| `/trace` | 複数仮説を競わせる証拠駆動の原因分析 | `trace this`, `root cause analysis` |
| `/verify` | 変更が本当に動くかを検証 | `verify this`, `prove it works` |
| `/review` | 重大度付きコードレビューと仕様確認 | `review this`, `code review` |
| `/ultraqa` | テスト、検証、修正を繰り返して完了まで進める | `ultraqa`, `fix all tests` |
| `/ai-slop-cleaner` | AI 生成コードの冗長さや雑味を整理 | `deslop`, `anti-slop`, `cleanup slop` |
| `/self-improve` | トーナメント選択ベースの自律改善ループ | `self-improve`, `evolve code` |

### ユーティリティスキル

| スキル | 内容 | トリガーキーワード |
|-------|-------------|-----------------|
| `/remember` | 情報をプロジェクトメモリへ保存 | `remember this`, `store this` |
| `/cancel` | 実行中のワークフローモードを停止 | `cancel`, `stop`, `abort` |
| `/status` | 現在状態とアクティブエージェントを表示 | `status`, `what's running` |

---

## MCP Server

OMG にはワークフロー状態を永続管理する TypeScript 製 MCP サーバーが含まれています。.vscode/mcp.json 経由で登録され、以下のツール群を提供します。

| ツールグループ | ツール | 目的 |
|-----------|-------|---------|
| **State** | `omg_read_state`, `omg_write_state` | autopilot、ralph、ultrawork などの状態管理 |
| **PRD** | `omg_read_prd`, `omg_update_story`, `omg_verify_story` | ユーザーストーリー追跡付き PRD 管理 |
| **Workflow** | `omg_check_completion`, `omg_next_phase` | フェーズ遷移と完了確認 |
| **Memory** | `omg_read_memory`, `omg_write_memory` | プロジェクト知識の保存 |
| **Model Router** | `omg_select_model` | タスク複雑度に応じたモデル推奨 |

状態データはワークスペース内の `.omc/` に保存されます。

```text
.omc/
├── state/              # モードごとの状態ファイル
├── plans/              # 実行プラン
├── sessions/           # セッション追跡
└── project-memory.json # プロジェクトメモリ
```

---

## Tool Guardrails

OMG は `.github/hooks/` 内の pre/post tool-use hooks により安全性を確保します。

**Pre-tool-use ガード:**
- `node_modules/` の変更を防止
- `.env` の直接編集を防止
- `package.json`、`tsconfig.json`、`.gitignore` の削除を防止
- `git push --force` や破壊的 git 操作を防止

**Post-tool-use トラッキング:**
- `OMG_DEBUG=1` のときツール使用ログを記録
- autopilot の進行把握のため変更ファイルを追跡
- ultraqa のためテスト結果を追跡

---

## Architecture

```text
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # ルートオーケストレーション指示
│   ├── agents/                    # 20 の専門エージェント定義
│   ├── skills/                    # 18 のスキルルーチン
│   ├── hooks/                     # pre/post tool-use ガード
│   └── prompts/                   # quick-fix、quick-plan、quick-review テンプレート
├── mcp-server/                    # TypeScript MCP サーバー
│   └── src/
│       ├── index.ts               # サーバーエントリポイント
│       ├── state-tools.ts         # 状態管理
│       ├── prd-tools.ts           # PRD とストーリー追跡
│       ├── workflow-tools.ts      # フェーズ遷移と完了確認
│       ├── memory-tools.ts        # プロジェクトメモリ管理
│       └── model-router.ts        # 複雑度ベースのモデルルーティング
├── .vscode/mcp.json               # VS Code 用 MCP 登録
└── .omc/                          # ランタイム状態ディレクトリ
```

### 仕組み

1. **Instructions** (`.github/copilot-instructions.md`) がオーケストレーションルールと委譲ロジックを定義します。
2. **Agents** (`.github/agents/*.agent.md`) が役割、ツールアクセス範囲、モデル選好を定義します。
3. **Skills** (`.github/skills/*/SKILL.md`) はキーワードやスラッシュコマンドで必要時に読み込まれます。
4. **MCP Server** が状態、PRD、プロジェクトメモリを永続管理します。
5. **Hooks** が危険操作を防ぎ、ワークフロー把握に必要な実行痕跡を残します。

---

## Commit Protocol

OMG は意思決定の文脈を残すため、構造化された git trailer を使用します。

```text
fix(auth): prevent silent session drops during long-running ops

Auth service returns inconsistent status codes on token expiry,
so the interceptor catches all 4xx and triggers inline refresh.

Constraint: Auth service does not support token introspection
Rejected: Extend token TTL to 24h | security policy violation
Confidence: high
Scope-risk: narrow
```

利用可能な trailer: `Constraint`、`Rejected`、`Directive`、`Confidence`、`Scope-risk`、`Not-tested`

---

## OMC との比較

| 項目 | OMC (oh-my-claudecode) | OMG (oh-my-githubcopilot) |
|---------|----------------------|--------------------------|
| 対象プラットフォーム | Claude Code CLI | GitHub Copilot (VS Code) |
| 導入方法 | npm パッケージ / プラグインマーケットプレイス | リポジトリをクローンして MCP サーバーをビルド |
| エージェント数 | 19+ | 20 の専門エージェント |
| スキル | 10+ のワークフロースキル | 18 スキルとキーワードトリガー |
| 状態管理 | `.omc/` ディレクトリ | MCP サーバー経由の `.omc/` |
| マルチモデル | tmux CLI 経由で Codex/Gemini | ccg スキルによる助言型分析 |
| 設定場所 | `~/.claude/settings.json` | `.github/` + `.vscode/mcp.json` |
| 安全機構 | プラグインレベル hooks | Shell ベースの pre/post hooks |
| 可視化 | 内蔵 HUD | VS Code ネイティブ環境 |

---

## Requirements

- [VS Code](https://code.visualstudio.com/) と [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) 拡張
- agent mode を有効化した GitHub Copilot Chat
- Node.js 18 以上（MCP サーバー用）

---

## License

MIT

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**GitHub Copilot 向けのマルチエージェントオーケストレーション。**

</div>