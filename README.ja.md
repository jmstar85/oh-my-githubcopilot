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
  <img src="https://img.shields.io/badge/IDE-VS%20Code-007ACC?logo=visualstudiocode" alt="VS Code">
  <img src="https://img.shields.io/badge/CLI-Copilot%20CLI-181717?logo=github" alt="Copilot CLI">
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
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
    <img src="https://img.youtube.com/vi/3Zyf4a7LAH8/maxresdefault.jpg" alt="YouTube で OMG のデモを見る" width="720" />
  </a>
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">▶ YouTube で OMG のデモを見る</a>
</p>

---

## OMG とは？

**oh-my-githubcopilot (OMG)** は、[oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) が Claude Code 上で実現したマルチエージェントオーケストレーションの考え方を **GitHub Copilot** に持ち込むプロジェクトです。さらに **[Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code)** の優れた機能を統合し、より強力になりました。

OMC が専門エージェントとワークフロー自動化によって Claude Code を拡張したように、OMG は VS Code の Copilot agent mode 上で同じ発想を実装します。ECC 統合（v1.1.0）により、OMG は ECC の実証済みパターンも取り込んでいます: 8つの言語特化レビュアーエージェント、TDD 強制、高速セキュリティスキャン、標準コーディング規約など。1つのアシスタントにすべてを任せるのではなく、**28 の専門エージェント** と **22 の再利用可能なスキル** を MCP サーバー経由で連携させ、計画、実装、レビュー、検証を構造化して進めます。

> **これは OMC や ECC のフォークやコピーではありません。** GitHub Copilot のエージェントカスタマイズ機能（`.agent.md`、`.prompt.md`、`SKILL.md`、MCP ツール）に合わせてゼロから独立実装されたもので、OMC のマルチエージェント設計思想から着想を得て、ECC の実証済みパターンを選択的に統合しています。

---

## なぜ OMG なのか？

- **VS Code および Copilot CLI で動作**。VS Code agent mode または独立した `copilot` CLI で利用可能
- **役割分担された専門エージェント**。読み取り専用の分析役から実装担当まで明確に分離
- **ワークフロー自動化**。自律実行の `omg-autopilot`、完了まで粘る `ralph`、並列処理の `ultrawork`
- **安全ガードレール**。pre/post tool-use hooks による危険操作の防止
- **MCP ベースの状態管理**。ワークフロー状態、PRD、プロジェクトメモリをセッション間で保持
- **自然言語トリガー**。たとえば “omg-autopilot build me a REST API” と入力するだけ
- **検証優先**。作成とレビューを分離し、完了宣言は証拠必須

---

## Quick Start

### 前提条件

- GitHub Copilot Chat を有効化した VS Code
- Copilot 環境で agent mode または agent customization が利用可能であること
- MCP サーバーをローカルでビルドするための Node.js と npm
- MCP、prompts、カスタマイズ用ファイルを正しく読み込むため、信頼済みワークスペースとして開くこと

### 方法 A: VS Code Extension（推奨）

1. 拡張機能をインストール（以下のいずれか）:
   - **方法 1 — VSIX (CLI)**
     ```bash
     code --install-extension ./vscode-omg/oh-my-githubcopilot-1.2.3.vsix
     ```
     > VSIX を別の場所にダウンロードした場合は、ローカルパスに置き換えて実行してください。
   - **方法 2 — VS Code の拡張機能タブ (UI)**
     VS Code の **Extensions** (`⇧⌘X` / `Ctrl+Shift+X`) で **`oh-my-githubcopilot`** を検索してインストール。

2. VS Code でプロジェクトを開きます。

3. **⚡ `OMG: Initialize Workspace` を実行（必須）**
   ```
   Cmd+Shift+P (macOS) / Ctrl+Shift+P (Windows/Linux) → "OMG: Initialize Workspace"
   ```

> [!IMPORTANT]
> **拡張機能のインストールだけでは不十分です。** インストール後、必ず Command Palette から `OMG: Initialize Workspace` を実行してください。このコマンドが `.github/` 配下のすべてのコンベンションファイル（エージェント、スキル、hooks、prompts、copilot-instructions.md）を生成し、MCP サーバーをビルドします。このステップなしでは Copilot は OMG のエージェントやスキルを利用できません。

4. プロンプトが表示されたら **「ウィンドウの再読み込み (Reload Window)」** をクリックして全エージェント・スキルを有効化します
5. Copilot Chat（agent mode）で OMG の利用を開始

### 方法 B: 手動クローン

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
omg-autopilot: build a REST API for managing tasks
```

以降は OMG が計画、実装、レビュー、検証を進めます。

### 方法 C: Copilot CLI

OMG は独立した [Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)（`copilot` バイナリ）でも動作します。CLI は同じ `.github/` コンベンションファイル（エージェント、スキル、hooks、prompts）を読み込みます。

1. Copilot CLI バイナリをインストールします。
2. OMG をクローンして MCP サーバーをビルドします:
   ```bash
   git clone https://github.com/jmstar85/oh-my-githubcopilot.git
   cd oh-my-githubcopilot
   cd mcp-server && npm install && npm run build && cd ..
   ```
3. プロジェクトローカルの `.copilot/mcp-config.json` を作成します（`--global-mcp` で `~/.copilot/` にグローバルインストールも可）:
   ```bash
   scripts/omg-adopt.sh --target . --mode template --target-env cli
   ```
4. プロジェクトディレクトリで `copilot` を実行します:
   ```bash
   copilot
   ```
5. `/status` や `@omg-coordinator` で OMG の読み込みを確認します。

### どこから始めるべきかわからない場合

要件がまだ曖昧な場合や、設計の前に考えを整理したい場合は次を使えます。

```
deep-interview "I want to build a task management app"
```

OMG はソクラテス式の質問で隠れた前提をあぶり出し、コードを書く前に問題を明確化します。

### 他の VS Code プロジェクトで OMG を使う

OMG はワークスペース単位で動作するため、プロジェクトごとに適用する方式を推奨します。

このリポジトリには他プロジェクトへの適用スクリプトが含まれています。

**macOS / Linux (Bash):**
```bash
scripts/omg-adopt.sh --target <対象プロジェクトパス> --mode <template|submodule|subtree> [--target-env vscode|cli|both]
```

**Windows (PowerShell):**
```powershell
scripts/omg-adopt.ps1 -Target <対象プロジェクトパス> -Mode <template|submodule|subtree> [-TargetEnv vscode|cli|both]
```

`--target-env` フラグ（デフォルト: `both`）で設定対象を指定します:
- `vscode` — VS Code のみ（`.vscode/mcp.json`）
- `cli` — Copilot CLI のみ（`.copilot/mcp-config.json` + `hooks.json`）
- `both` — 両方の環境（デフォルト）

適用後、対象プロジェクトを信頼済みワークスペースとして開き、Copilot Chat（agent mode）で以下を実行して動作確認してください。

```text
/status
```

---

## Agents

OMG には **28 の専門エージェント** があり、それぞれの役割とアクセス範囲が定義されています。定義ファイルは `.github/agents/` にあります。

| エージェント | 役割 | 権限 |
|-------|------|--------|
| **@omg-coordinator** | omg-autopilot、ralph、team ワークフローを統括するメイン調整役 | Full |
| **@executor** | 実装担当。機能追加やバグ修正を行う | Full |
| **@debugger** | 根本原因分析、スタックトレース、7言語ビルドエラー解決ガイド | Full |
| **@architect** | アーキテクチャ分析、設計、構造レビュー | Read-only |
| **@planner** | 戦略的プランニングとインタビュー型計画立案 | Plans only |
| **@analyst** | 要件分析、抜け漏れ検出、スコープリスク確認 | Read-only |
| **@verifier** | 証拠ベースの完了確認、テスト妥当性評価 | Test runner |
| **@code-reviewer** | 重大度付きコードレビュー、コーディング標準適用 | Read-only |
| **@security-reviewer** | OWASP、シークレット検出 (sk-/ghp_/AKIA)、認証認可監査 | Read-only |
| **@critic** | 厳格なプラン/コードレビューゲート | Read-only |
| **@test-engineer** | テスト戦略、TDD、フレームワーク検出、flaky test 対策 | Full |
| **@designer** | UI/UX 設計とフロントエンド実装 | Full |
| **@writer** | README、API ドキュメント、CODEMAP 生成 | Full |
| **@tracer** | 証拠ベースの因果追跡と仮説検証 | Full |
| **@scientist** | データ分析、統計、可視化 | Read-only |
| **@qa-tester** | VS Code ターミナルベースの CLI テスト、Playwright POM、E2E | Full |
| **@git-master** | 原子的コミット、rebase、履歴管理 | Git only |
| **@code-simplifier** | コード簡素化、複雑度指標分析、重複除去 | Full |
| **@explore** | コード探索、ファイル検索、構造把握 | Read-only |
| **@document-specialist** | 外部ドキュメント調査、API リファレンス確認 | Read-only |


### 言語レビュアーエージェント — Tier 2 (8エージェント)

`@mention` で言語固有のコードレビューを依頼します。

| エージェント | 言語 | 主要ルール |
|-------|----------|----------|
| **@typescript-reviewer** | TypeScript | strictモード、no-any、型安全性 |
| **@python-reviewer** | Python | PEP 8、型ヒント、慣用的パターン |
| **@rust-reviewer** | Rust | 所有権、借用チェック、unsafe正当化 |
| **@go-reviewer** | Go | 慣用的Go、goroutine安全性、エラー処理 |
| **@java-reviewer** | Java | SOLID、Springパターン、null安全性 |
| **@csharp-reviewer** | C# | nullable分析、async/await、C#慣用句 |
| **@swift-reviewer** | Swift | Swift並行処理、メモリ安全性、SwiftUI |
| **@database-reviewer** | SQL/ORM | クエリ性能、パラメータ化、スキーマ設計 |

---

## Skills

スキルはスラッシュコマンドや自然言語キーワードで起動できる再利用可能なワークフロールーチンです。`.github/skills/` に定義されています。

### ワークフロースキル

| スキル | 内容 | トリガーキーワード |
|-------|-------------|-----------------|
| `/omg-autopilot` | アイデアから動くコードまでを自律実行 | `omg-autopilot`, `build me`, `create me` |
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
| `/tdd` | TDD強制 — レッド・グリーン・リファクタサイクル | `tdd`, `test driven`, `test first` |
| `/security-scan` | シークレット、CVE、入力検証、認証の迅速チェック | `security scan`, `check secrets`, `audit deps` |
| `/coding-standards` | 言語横断コーディング標準リファレンス | `coding standards`, `style guide`, `naming rules` |
| `/skill-stocktake` | スキルインベントリの品質・カバレッジ監査 | `skill audit`, `stocktake`, `skill inventory` |

### ユーティリティスキル

| スキル | 内容 | トリガーキーワード |
|-------|-------------|-----------------|
| `/remember` | 情報をプロジェクトメモリへ保存（品質ゲート：実行可能・持続性・固有性フィルタ） | `remember this`, `store this` |
| `/cancel` | 実行中のワークフローモードを停止 | `cancel`, `stop`, `abort` |
| `/status` | 現在状態とアクティブエージェントを表示 | `status`, `what's running` |

---

## MCP Server

OMG にはワークフロー状態を永続管理する TypeScript 製 MCP サーバーが含まれています。.vscode/mcp.json 経由で登録され、以下のツール群を提供します。

| ツールグループ | ツール | 目的 |
|-----------|-------|---------|
| **State** | `omg_read_state`, `omg_write_state`, `omg_clear_state`, `omg_list_active` | ワークフロー状態 CRUD とアクティブモード一覧 |
| **PRD** | `omg_create_prd`, `omg_read_prd`, `omg_update_story`, `omg_verify_story` | PRD 作成、ストーリー追跡、検証 |
| **Workflow** | `omg_check_completion`, `omg_next_phase`, `omg_get_phase_info` | フェーズ遷移、完了確認、フェーズ状態照会 |
| **Memory** | `omg_read_memory`, `omg_write_memory`, `omg_delete_memory` | プロジェクトスコープの知識永続化 |
| **Model Router** | `omg_select_model` | タスク複雑度に応じたモデル推奨 |

状態データはワークスペース内の `.omg/` に保存されます。

```text
.omg/
├── state/              # モードごとの状態ファイル
├── plans/              # 実行プラン
├── prd.json            # プロダクト要件ドキュメント
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
- omg-autopilot の進行把握のため変更ファイルを追跡
- ultraqa のためテスト結果を追跡

---

## ベンチマーク

> すべての数値は実際の git 履歴、テストスイート、`npm audit` の結果から抽出したものです。合成データは含みません。

### プロジェクトスナップショット（v1.3.0 時点）

| 指標 | 値 |
|------|----| 
| コードベース総量 | 25,964 行 |
| 開発期間 | 12日間（2026年4月6〜17日） |
| 総コミット数 | 33 |
| エージェント数 | 28（コア20 + 言語レビュアー8） |
| スキル数 | 22 |
| MCP ツール数 | 19 |

### 品質指標

| 指標 | v1.0（初期） | v1.3.0（OMG パイプライン後） |
|------|:-:|:-:|
| テスト通過率 | なし | **46 / 46（100%）** |
| TypeScript エラー | 未確認 | **0** |
| 既知の CVE | 7件（本番2 + 開発5） | **0** |
| Pre-hook 安全ガード | 0 | **6** |
| Post-hook 追跡機能 | 0 | **8** |

### ECC 統合 — 単一コミットのインパクト（`9468c02`）

| 指標 | 値 |
|------|----|
| 変更ファイル数 | 60 |
| 追加行数 | 5,844 |
| 新規エージェント | 言語レビュアー8エージェント |
| 新規スキル | 4件（`/tdd`、`/security-scan`、`/coding-standards`、`/skill-stocktake`） |
| マージ前に検出した欠陥 | フック Shell インジェクション + CVE 7件 |

### RALPLAN 合意計画の結果

| レビューした決定数 | 承認 | `@critic` 却下 | 却下率 |
|:-:|:-:|:-:|:-:|
| 9 | 7 | **2** | **22%** |

> 設計決定の 22% がコード作成前の計画段階で修正されました。

### セキュリティスキャン結果

| カテゴリ | 検出 | 修正 |
|----------|:-:|:-:|
| ハードコードされた秘密情報 | 0 | — |
| 本番 CVE | 中程度2件 | ✅ |
| 開発 CVE | 中程度5件 | ✅ |
| Shell インジェクション（フック `FILE_PATH`） | 1件 | ✅ |
| `.env` の `.gitignore` 未記載 | 1件 | ✅ |
| **修正後の総脆弱性** | | **0** |

### Pre-Tool-Use 安全ガード

| ガード | ブロック対象 |
|--------|------------|
| `node_modules` 書き込み保護 | `node_modules/` 内の編集・作成 |
| `.env` 秘密情報保護 | `.env` への直接変更 |
| 重要設定ファイル削除防止 | `package.json`、`tsconfig.json`、`.gitignore` の削除 |
| 強制プッシュ防止 | `git push --force` |
| ハードリセット防止 | `git reset --hard`、`git clean -fd` |
| パストラバーサル防止 | `FILE_PATH` 内の `../` および特殊文字 |

---

## Architecture

```text
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # ルートオーケストレーション指示
│   ├── agents/                    # 28 の専門エージェント定義 (20コア + 8言語レビュアー)
│   ├── skills/                    # 22 のスキルルーチン
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
└── .omg/                          # ランタイム状態ディレクトリ
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
| エージェント数 | 19+ | 28エージェント (20コア + 8言語レビュアー) |
| スキル | 10+ のワークフロースキル | 22 スキルとキーワードトリガー |
| 状態管理 | `.omc/` ディレクトリ | MCP サーバー経由の `.omg/` |
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

---

## What's New

### v1.3.1 (2026-04-23) — Copilot CLI サポート

**VS Code エージェントモードとスタンドアロン Copilot CLI のデュアル互換性** (Issue #4)

- **エージェントフロントマター正規化**: 全28エージェントの `model:` フィールドを配列から文字列に変更。CLI ツール等価物（`read`, `edit`, `shell`, `create`, `delete`）を `tools:` リストに追加。
- **フックデュアルモード入力**: pre/post tool-use フックが VS Code 環境変数と CLI stdin JSON の両方を受け入れ。ツール名正規化で CLI 名を VS Code 等価物にマッピング。
- **`hooks.json` 登録**: CLI フック検出用の `preToolUse` / `postToolUse` ラッパーファイル。
- **Adopt スクリプト `--target-env`**: `--target-env vscode|cli|both` フラグ追加（デフォルト: `both`）。CLI モードで `.copilot/mcp-config.json` を生成、`.vscode/mcp.json` をスキップ。`--global-mcp` で `~/.copilot/` にグローバルインストール。
- **スキル CLI フォールバック**: 対話型スキル5つ（`deep-interview`, `omg-autopilot`, `ralplan`, `plan`, `self-improve`）に CLI フォールバック追加 — `vscode_askQuestions` 未使用時は Markdown 番号オプションを提示。
- **ドキュメント**: CLI バッジ、「方法 C: Copilot CLI」クイックスタート、`--target-env` 使用法を全 README に追加。

### v1.3.0 (2026-04-23) — Windows サポート、MIT ライセンス & 非破壊初期化

**コミュニティリクエスト 3件の改善 (Issues #5, #6, #7)**

- **Windows PowerShell サポート** (Fixes #5): 全シェルスクリプトの `.ps1` 版を追加 — `pre-tool-use.ps1`, `post-tool-use.ps1`, `omg-adopt.ps1`。フックテンプレートもバンドル。README に PowerShell 例を追加。
- **copilot-instructions.md 非破壊処理** (Fixes #6): `initWorkspace` が既存ファイルを上書きせず OMG 内容を追記。マーカーベースのセクション検出で再初期化時の更新に対応。
- **MIT ライセンス明確化** (Fixes #7): GitHub API 検出用のルート `LICENSE` ファイルを追加。全 README から「All rights reserved」の矛盾を解消。

### v1.2.0 (2026-04-17) — エージェントモデル Claude Opus 4.7 へアップグレード

**全エージェントのモデル参照を Claude Opus 4.6 から 4.7 にアップグレード**

- `model: [claude-opus-4-6]` → `model: [claude-opus-4-7]`：Opus ルーティング対象の全 8 エージェントを更新
- アクティブエージェント（`.github/agents/`）とエクステンションテンプレート（`vscode-omg/resources/templates/agents/`）の両方に適用
- 対象: @architect, @code-reviewer, @planner, @security-reviewer, @analyst, @omg-coordinator, @code-simplifier, @critic
- 検証完了: MCP サーバー build+test（**18/18**）、vscode-omg build+test（**28/28**）、TypeScript 型チェック — 全パス

### v1.1.9 (2026-04-16) — `.omc` → `.omg` 状態パスマイグレーション

**ソース + テンプレート全体の状態パス整合性を改善**

- 残っていた `.omc/` 参照を `.omg/` に統一（skills、agents、MCP/extension テンプレート）
- フック状態変数名を `OMC_STATE_DIR` から `OMG_STATE_DIR` に更新
- マイグレーション後に MCP サーバーの build/test を検証（**18/18 pass**）
- OMC 比較表の `.omc/` 表記は意図的に維持

### v1.1.8 (2026-04-13) — コンテキスト保持 & メモリ強化

**長時間ワークフローの信頼性を大幅に強化**

- Tier-2 メモリ機能を強化:
  - `omg_search_memory` を追加（key/value/category/tags 横断検索）
  - `omg_write_memory` に `tags` サポートを追加
  - 既存メモリエントリとの後方互換を確保
- Tier-3 コンテキスト圧力プロトコルを追加:
  - `omg_checkpoint`, `omg_restore_checkpoint`, `omg_context_status`
  - Tool I/O 累積バイトに基づく自動 checkpoint advisory
  - `OMG_CONTEXT_THRESHOLD` で閾値設定可能（既定 400KB）
- Hook 安全性とライフサイクルを改善:
  - checkpoint 後にカウンタをリセットし、advisory ループを防止
  - force push 検知を強化（`--force`, `-f`）、`--force-with-lease` は許可
  - 破壊的な git 操作ガードを拡張
- `copilot-instructions.md` にセッション復元ルールを追加

### v1.1.7 (2026-04-12) — インタラクティブ Hook システム

**OMC 同等機能: `vscode_askQuestions` によるワークフロー中間ユーザー意思決定**

5 つのコアスキルが意思決定ゲートで構造化された選択肢プロンプトを表示するようになりました。OMC のゲートウェイレベルの割り込みフックと同等の機能を、VS Code Copilot 内でネイティブに実現します。

#### フック追加済みスキル

| スキル | フックポイント |
|--------|---------------|
| `/deep-interview` | 各インタビューラウンド（曖昧度 %）· スペック承認 · 実行パス選択 |
| `/plan` | インタビュー質問 · 準備完了ゲート · トレードオフ選択 · 批評者却下 · プラン承認 |
| `/ralplan` | オプション選択 · アーキテクト懸念 · 批評者却下 · 最終承認 |
| `/self-improve` | ターゲットリポ · 信頼確認 · 目標インタビュー · ハーネスルール（セットアップのみ — ループは自律実行） |
| `/omg-autopilot` | 曖昧な入力リダイレクト · スペック確認 · QA 繰り返し失敗 · 検証却下 |

#### 仕組み

- 各意思決定ゲートでスキルが 3〜5 個の選択肢・`recommended` デフォルト・`allowFreeformInput: true` とともに `vscode_askQuestions` を呼び出す
- ユーザーが選択肢を選ぶか自由入力するとワークフローが継続
- すべてのフック呼び出しは追跡のため固有の `header` を使用（例: `"interview-round-3"`、`"ralplan-approval"`）
- グローバルフックプロトコルは `copilot-instructions.md → Interactive Hook System` に文書化済み

---

### v1.1.0 (2026-04-10) — ECC 統合

**大規模アップグレード: ECC (Everything Claude Code) のベスト機能を OMG に統合**

#### 新規エージェント — 言語レビュアー Tier (8エージェント)

各エージェントに13〜21個の言語固有スタイルルールが内蔵されています。

- **@typescript-reviewer** — strictモード、no-any、完全判別共用体
- **@python-reviewer** — PEP 8、型ヒント、慣用的パターン
- **@rust-reviewer** — 所有権、借用チェック、unsafe正当化
- **@go-reviewer** — 慣用的Go、goroutine安全性、明示的エラー処理
- **@java-reviewer** — SOLID、Springパターン、null安全性
- **@csharp-reviewer** — nullable分析、async/await、C#慣用句
- **@swift-reviewer** — Swift並行処理、メモリ安全性、SwiftUIパターン
- **@database-reviewer** — クエリ性能、パラメータ化、スキーマ設計

#### 新規スキル (4個)

- **`/tdd`** — 完全TDD強制: レッド・グリーン・リファクタサイクル、フレームワーク参照 (Jest/pytest/Cargo/Go test)
- **`/security-scan`** — 迅速セキュリティチェック: シークレットパターン (sk-/ghp_/AKIA)、CVE監査、入力検証、認証確認
- **`/coding-standards`** — 言語横断コーディング標準参照 (命名、関数、エラー、アンチパターン、SOLID)。全レビュアーエージェントから参照される。
- **`/skill-stocktake`** — スキルインベントリ監査: フロントマター検証、テンプレート同期、スタブ、カバレッジギャップ

#### 既存コアエージェントの強化 (7個)

| エージェント | 追加内容 |
|-------|----------------|
| **@debugger** | 7言語ビルドエラー解決ガイド (Node/TS, Python, Rust, Go, Java, C#, Swift) |
| **@security-reviewer** | シークレット検出正規表現パターン、JWT/セッション/暗号化ルール、OWASPアノテーション |
| **@qa-tester** | Playwright Page Object Modelパターン、E2E分類テーブル |
| **@writer** | CODEMAPジェネレートテンプレート + 自動更新ワークフロー |
| **@code-reviewer** | D9標準コーディング規則テーブル内蔵 |
| **@test-engineer** | フレームワーク検出テーブル、カバレッジギャッププロトコル、flaky testの根本原因 |
| **@code-simplifier** | 複雑度指標テーブル、簡素化パターン、安定性例外処理 |

#### 既存スキルの強化 (1個)

- **`/remember`** — 品質ゲート追加: 実行可能性・持続性・固有性の3段階フィルタで保存前に検証

#### インフラ

- **階層的エージェント/スキル閾値**: warn <20/18, info <28/22, silent ≥28/22 (後方互換)
- **ツリービューカテゴリ分類**: エージェント数>20で「Core Agents」+「Language Reviewers」に自動分割
- **post-tool-useフック** (`OMG_LINT_ON_EDIT=1`): ファイル編集時のオプトインTypeScriptチェック/ESLint + FILEPATHサニタイズ
- **セキュリティパッチ**: hono/node-server CVE修正、vitest 4.1.4アップグレード、`.env*`を`.gitignore`に追加

---

### v1.0.5 (2026-04-10)

**バグ修正: VS Code 内蔵 Autopilot とのスキル名衝突**

- **名前変更**: `/autopilot` スキルを `/omg-autopilot` に変更し、VS Code 内蔵「Autopilot (Preview)」権限モードとの衝突を解消
- **YAML フロントマター修正**: すべての SKILL.md ファイルで未対応の `allowed-tools` フィールドを削除、`hint` を VS Code 仕様に準拠した `argument-hint` に変更
- **根本原因**: スキル名 `autopilot` が OMG スキル読み込みではなく VS Code 内部の権限モード切替をトリガーしていた
- **対象範囲**: スキルディレクトリ、MCP サーバーコード、エージェント定義、相互参照、テスト、全ドキュメントを更新

## License

MIT

Copyright (c) 2026 jmstar85. [MIT License](LICENSE) に基づいて配布されています。

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**GitHub Copilot 向けのマルチエージェントオーケストレーション。**

</div>