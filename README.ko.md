<h1 align="center">oh-my-githubcopilot</h1>

<p align="center">
  <a href="README.md">English</a> | 한국어 | <a href="README.zh.md">中文</a> | <a href="README.ja.md">日本語</a> | <a href="README.es.md">Español</a>
</p>

<p align="center">
  <strong>GitHub Copilot을 위한 멀티 에이전트 오케스트레이션. 더 강력한 생산성.</strong>
</p>

<p align="center">
  <a href="https://github.com/jmstar85/oh-my-githubcopilot"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/IDE-VS%20Code-007ACC?logo=visualstudiocode" alt="VS Code">
  <img src="https://img.shields.io/badge/CLI-Copilot%20CLI-181717?logo=github" alt="Copilot CLI">
</p>

<p align="center">
  <a href="#빠른-시작">시작하기</a> •
  <a href="#에이전트">에이전트</a> •
  <a href="#스킬">스킬</a> •
  <a href="#mcp-서버">MCP 서버</a> •
  <a href="#아키텍처">아키텍처</a>
</p>

---

<h1 align="center">Now, you can enjoy OMG's amazing features integrating OMC + ECC!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">
    <img src="https://img.youtube.com/vi/3Zyf4a7LAH8/maxresdefault.jpg" alt="YouTube에서 OMG 시연 보기" width="720" />
  </a>
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">▶ YouTube에서 OMG 시연 보기</a>
</p>

---

## OMG란?

**oh-my-githubcopilot (OMG)** 는 [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode)가 Claude Code에서 보여준 멀티 에이전트 오케스트레이션 패턴을 **GitHub Copilot** 환경으로 옮겨온 프로젝트로, 이제 **[Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code)** 의 최고 기능까지 통합하여 더욱 강력해졌습니다.

OMC가 Claude Code를 특화된 에이전트와 워크플로 자동화로 확장했다면, OMG는 VS Code의 Copilot agent mode에서 같은 철학을 구현합니다. ECC 통합(v1.1.0)과 OMC 스킬의 OMG-native 적응 포팅으로 OMG는 언어 전문 리뷰어, TDD 적용, 빠른 보안 스캔, `ultragoal` 체크포인트, 연구 보조, 릴리스 가이드, 시각 QA 등을 포함합니다. 하나의 도우미가 모든 일을 처리하는 대신, OMG는 **28개의 전문 에이전트**와 **37개의 재사용 가능한 스킬**을 MCP 서버를 통해 조율하여 계획, 구현, 리뷰, 검증을 구조적으로 수행합니다.

> **이 프로젝트는 OMC나 ECC의 포크나 복제가 아닙니다.** GitHub Copilot의 에이전트 커스터마이징 기능(`.agent.md`, `.prompt.md`, `SKILL.md`, MCP 도구)에 맞춰 처음부터 독립적으로 구현되었으며, OMC의 멀티 에이전트 설계 방식에서 영감을 받고 ECC의 검증된 패턴을 선택적으로 통합했습니다.

---

## 왜 OMG인가?

- **VS Code 및 Copilot CLI에서 바로 동작** — 별도 외부 프로세스 없이 VS Code agent mode 또는 독립 실행형 `copilot` CLI에서 작동합니다.
- **전문화된 에이전트** — 읽기 전용 분석가부터 전체 권한 실행가까지, 역할이 분리된 28개 에이전트 (20개 코어 + 8개 언어 리뷰어)
- **워크플로 자동화** — 자율 실행 `omg-autopilot`, 끝까지 밀어붙이는 `ralph`, 병렬 실행 `ultrawork`
- **안전 가드레일** — pre/post tool-use 훅으로 파괴적인 작업을 기본 차단
- **MCP 기반 상태 관리** — 워크플로 상태, PRD, 프로젝트 메모리를 세션 간 유지
- **자연어 트리거** — "omg-autopilot build me a REST API"처럼 말하면 오케스트레이션 시작
- **검증 우선 설계** — 작성과 리뷰를 분리하고, 완료 주장은 증거 기반으로만 허용

---

## 빠른 시작

### 사전 조건

- GitHub Copilot Chat이 활성화된 VS Code
- Copilot 환경에서 agent mode 또는 agent customization 지원 가능 상태
- MCP 서버를 로컬에서 빌드할 수 있도록 Node.js와 npm 설치
- MCP, 프롬프트, 커스터마이징 파일이 정상 로드되도록 신뢰된 워크스페이스로 열기

### 방법 A: VS Code Extension (권장)

1. 익스텐션 설치 (아래 방법 중 하나):
   - **방법 1 — VSIX (CLI)**
     [최신 릴리스](https://github.com/jmstar85/oh-my-githubcopilot/releases/latest)에서 `oh-my-githubcopilot-1.5.0.vsix`를 다운로드한 뒤 실행합니다:
     ```bash
     code --install-extension ./oh-my-githubcopilot-1.5.0.vsix
     ```
     > 경로는 파일을 저장한 위치로 바꿔서 실행하세요.
   - **방법 2 — VS Code 확장 탭 (UI)**
     VS Code 좌측 **Extensions**(`⇧⌘X` / `Ctrl+Shift+X`)에서 **`oh-my-githubcopilot`** 검색 후 설치.

2. VS Code에서 프로젝트를 엽니다.

3. **⚡ `OMG: Initialize Workspace` 실행 (필수)**
   ```
   Cmd+Shift+P (macOS) / Ctrl+Shift+P (Windows/Linux) → "OMG: Initialize Workspace"
   ```

> [!IMPORTANT]
> **익스텐션 설치만으로는 충분하지 않습니다.** 설치 후 반드시 Command Palette에서 `OMG: Initialize Workspace`를 실행해야 합니다. 이 명령이 `.github/` 하위의 모든 컨벤션 파일(에이전트, 스킬, 훅, 프롬프트, copilot-instructions.md)을 생성하고 MCP 서버를 빌드합니다. 이 단계 없이는 Copilot이 OMG 에이전트나 스킬을 사용할 수 없습니다.

4. 프롬프트가 나타나면 **"창 다시 로드(Reload Window)"** 를 클릭하여 모든 에이전트와 스킬을 활성화합니다
5. Copilot Chat(agent mode)에서 OMG 사용 시작

### 방법 B: 수동 클론

### 1. 클론

```bash
git clone https://github.com/jmstar85/oh-my-githubcopilot.git
cd oh-my-githubcopilot
```

### 2. MCP 서버 빌드

```bash
cd mcp-server
npm install
npm run build
cd ..
```

### 3. VS Code에서 열기

GitHub Copilot Chat이 활성화된 VS Code에서 프로젝트를 열면, MCP 서버와 에이전트, 스킬, 훅 구성이 워크스페이스에서 자동으로 감지됩니다.

### 4. 바로 빌드 시작

Copilot Chat의 agent mode에서 다음처럼 입력하면 됩니다.

```
omg-autopilot: build a REST API for managing tasks
```

이후에는 OMG가 계획, 구현, 리뷰, 검증 흐름을 이어서 처리합니다.

### 방법 C: Copilot CLI

OMG는 독립 실행형 [Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) (`copilot` 바이너리)에서도 작동합니다. CLI는 동일한 `.github/` 컨벤션 파일(에이전트, 스킬, 훅, 프롬프트)을 읽습니다.

1. Copilot CLI 바이너리를 설치합니다.
2. OMG를 클론하고 MCP 서버를 빌드합니다:
   ```bash
   git clone https://github.com/jmstar85/oh-my-githubcopilot.git
   cd oh-my-githubcopilot
   cd mcp-server && npm install && npm run build && cd ..
   ```
3. 프로젝트 로컬 `.copilot/mcp-config.json`을 생성합니다 (또는 `--global-mcp`로 `~/.copilot/`에 전역 설치):
   ```bash
   scripts/omg-adopt.sh --target . --mode template --target-env cli
   ```
4. 프로젝트 디렉토리에서 `copilot`을 실행합니다:
   ```bash
   copilot
   ```
5. `/status` 또는 `@omg-coordinator`를 사용하여 OMG 로드를 확인합니다.

### 어디서 시작해야 할지 모르겠다면?

요구사항이 아직 모호하거나 생각을 정리하고 싶다면:

```
deep-interview "I want to build a task management app"
```

OMG가 소크라테스식 질문을 통해 숨은 가정과 요구사항을 드러내고, 코드를 쓰기 전에 문제를 명확히 정리합니다.

### 다른 VS Code 프로젝트에서도 OMG 사용하기

OMG는 워크스페이스 단위로 동작하므로, 프로젝트별로 적용하는 방식을 권장합니다.

이 저장소에는 다른 프로젝트 적용을 위한 스크립트가 포함되어 있습니다.

**macOS / Linux (Bash):**
```bash
scripts/omg-adopt.sh --target <대상-프로젝트-경로> --mode <template|submodule|subtree> [--target-env vscode|cli|both]
```

**Windows (PowerShell):**
```powershell
scripts/omg-adopt.ps1 -Target <대상-프로젝트-경로> -Mode <template|submodule|subtree> [-TargetEnv vscode|cli|both]
```

`--target-env` 플래그 (기본값: `both`)는 어떤 환경을 설정할지 지정합니다:
- `vscode` — VS Code만 (`.vscode/mcp.json`)
- `cli` — Copilot CLI만 (`.copilot/mcp-config.json` + `hooks.json`)
- `both` — 두 환경 모두 (기본값)

#### 운영팁 1: 템플릿 방식 (신규 프로젝트)

새 프로젝트에 OMG 구성을 바로 복사해 시작할 때 사용합니다.

```bash
# macOS / Linux
scripts/omg-adopt.sh --target ~/work/my-new-app --mode template
```
```powershell
# Windows
scripts/omg-adopt.ps1 -Target ~/work/my-new-app -Mode template
```

#### 운영팁 2: submodule/subtree 방식 (업데이트 추적)

OMG 변경사항을 주기적으로 추적해 동기화하려면 아래 중 하나를 사용하세요.

```bash
# macOS / Linux — Submodule 방식
scripts/omg-adopt.sh --target ~/work/my-app --mode submodule

# macOS / Linux — Subtree 방식
scripts/omg-adopt.sh --target ~/work/my-app --mode subtree
```
```powershell
# Windows — Submodule 방식
scripts/omg-adopt.ps1 -Target ~/work/my-app -Mode submodule

# Windows — Subtree 방식
scripts/omg-adopt.ps1 -Target ~/work/my-app -Mode subtree
```

스크립트가 대상 프로젝트에 적용하는 항목:

- `.github/copilot-instructions.md`
- `.github/agents/`
- `.github/skills/`
- `.github/hooks/`
- `.github/prompts/`
- `.vscode/mcp.json`
- `mcp-server/` (`--skip-build` 미사용 시 `npm install && npm run build` 자동 실행)

적용 후에는 대상 프로젝트를 신뢰된 워크스페이스로 열고 Copilot Chat(agent mode)에서 아래로 동작을 확인하세요.

```text
/status
```

---

## 에이전트

OMG는 **20개의 전문 에이전트**를 포함하며, 각 에이전트는 역할과 접근 권한이 분리되어 있습니다. 정의 파일은 `.github/agents/` 아래의 `.agent.md` 형식입니다.

| 에이전트 | 역할 | 권한 |
|-------|------|--------|
| **@omg-coordinator** | 메인 오케스트레이터, omg-autopilot/ralph/팀 워크플로 조율 | Full |
| **@executor** | 구현 담당, 기능 개발과 버그 수정 | Full |
| **@debugger** | 원인 분석, 스택 트레이스, 빌드 오류 해결 (7개 언어 가이드) | Full |
| **@architect** | 아키텍처 분석, 시스템 설계, 구조 검토 | Read-only |
| **@planner** | 전략적 계획 수립과 인터뷰 기반 플래닝 | Plans only |
| **@analyst** | 요구사항 분석, 누락 탐지, 범위 리스크 점검 | Read-only |
| **@verifier** | 증거 기반 완료 검증, 테스트 적절성 확인 | Test runner |
| **@code-reviewer** | 심각도 기반 코드 리뷰, 표준 코딩 가이드 적용 | Read-only |
| **@security-reviewer** | OWASP, 시크릿 탐지 (sk-/ghp_/AKIA), 인증/인가 점검 | Read-only |
| **@critic** | 계획/코드에 대한 엄격한 게이트 리뷰 | Read-only |
| **@test-engineer** | 테스트 전략, TDD, 프레임워크 감지, flaky test 강화 | Full |
| **@designer** | UI/UX 설계와 프론트엔드 구현 | Full |
| **@writer** | README, API 문서, CODEMAP 생성 | Full |
| **@tracer** | 증거 기반 인과 추적과 가설 검증 | Full |
| **@scientist** | 데이터 분석, 통계, 시각화 | Read-only |
| **@qa-tester** | VS Code 터미널 기반 CLI 테스트, Playwright POM, E2E | Full |
| **@git-master** | 커밋 분리, 리베이스, 히스토리 관리 | Git only |
| **@code-simplifier** | 코드 단순화, 복잡도 지표 분석, 중복 제거 | Full |
| **@explore** | 코드베이스 탐색, 파일 검색, 구조 파악 | Read-only |
| **@document-specialist** | 외부 문서 조사, API 레퍼런스 조회 | Read-only |


### 언어 리뷰어 에이전트 — Tier 2 (8)

`@mention`으로 언어별 코드 리뷰를 요청합니다.

| 에이전트 | 언어 | 핵심 규칙 |
|-------|----------|----------|
| **@typescript-reviewer** | TypeScript | strict 모드, no-any, 타입 안전성 |
| **@python-reviewer** | Python | PEP 8, 타입 힌트, 관용적 패턴 |
| **@rust-reviewer** | Rust | 소유권, 빌림 검사기, unsafe 정당화 |
| **@go-reviewer** | Go | 관용적 Go, 고루틴 안전성, 오류 처리 |
| **@java-reviewer** | Java | SOLID, Spring 패턴, null 안전성 |
| **@csharp-reviewer** | C# | nullable 분석, async/await, C# 관용구 |
| **@swift-reviewer** | Swift | Swift 동시성, 메모리 안전성, SwiftUI |
| **@database-reviewer** | SQL/ORM | 쿼리 성능, 파라미터화, 스키마 설계 |

---

## 스킬

스킬은 슬래시 명령이나 자연어 키워드로 활성화되는 재사용 가능한 워크플로 루틴입니다. `.github/skills/` 아래에 정의됩니다.

현재 OMG는 37개 스킬을 포함하며, `ultragoal`, `visual-verdict`, `release`, `deepinit`, `skillify`, `writer-memory`, `configure-notifications`, `wiki`, `autoresearch`, `hud`, `external-context`, `sciomc`, `ask` 등 OMC에서 영감을 받은 기능을 VS Code/Copilot 환경에 맞게 적응 포팅했습니다.

### 워크플로 스킬

| 스킬 | 설명 | 트리거 키워드 |
|-------|-------------|-----------------|
| `/omg-autopilot` | 아이디어부터 동작하는 코드까지 자율 실행 | `omg-autopilot`, `build me`, `create me` |
| `/ralph` | PRD 기반 지속 실행 루프, 검증될 때까지 멈추지 않음 | `ralph`, `don't stop`, `finish this` |
| `/ultrawork` | 고처리량 병렬 실행 엔진 | `ulw`, `ultrawork`, `parallel` |
| `/team` | 공유 작업 목록 위에서 여러 에이전트를 단계적으로 조율 | `team`, `multi-agent`, `swarm` |
| `/plan` | 인터뷰 옵션이 포함된 구조화된 계획 수립 | `plan this`, `let's plan` |
| `/ralplan` | Planner/Architect/Critic 합의 기반 플래닝 | `ralplan`, `consensus plan` |
| `/ccg` | Claude + Codex + Gemini 관점 결합 분석 | `ccg`, `tri-model`, `cross-validate` |

### 분석 및 품질 스킬

| 스킬 | 설명 | 트리거 키워드 |
|-------|-------------|-----------------|
| `/deep-interview` | 모호성을 줄이기 위한 소크라테스식 요구사항 인터뷰 | `deep interview`, `ask me everything` |
| `/deep-dive` | trace 후 deep-interview로 이어지는 2단계 분석 | `deep dive`, `investigate deeply` |
| `/trace` | 가설 경쟁 방식의 증거 기반 원인 추적 | `trace this`, `root cause analysis` |
| `/verify` | 변경 사항이 실제로 동작하는지 검증 | `verify this`, `prove it works` |
| `/review` | 심각도 기반 코드 리뷰 및 스펙 점검 | `review this`, `code review` |
| `/ultraqa` | 테스트-검증-수정 반복 루프 | `ultraqa`, `fix all tests` |
| `/ai-slop-cleaner` | AI가 만든 불필요한 코드 냄새 정리 | `deslop`, `anti-slop`, `cleanup slop` |
| `/self-improve` | 토너먼트 선택 기반 자율 개선 루프 | `self-improve`, `evolve code` |
| `/tdd` | TDD 강제 — 레드-그린-리팩터 사이클 | `tdd`, `test driven`, `test first` |
| `/security-scan` | 시크릿, CVE, 입력 검증, 인증 빠른 점검 | `security scan`, `check secrets`, `audit deps` |
| `/coding-standards` | 언어 공통 코딩 표준 참조 | `coding standards`, `style guide`, `naming rules` |
| `/skill-stocktake` | 스킬 인벤토리 품질·커버리지 감사 | `skill audit`, `stocktake`, `skill inventory` |

### 유틸리티 스킬

| 스킬 | 설명 | 트리거 키워드 |
|-------|-------------|-----------------|
| `/remember` | 정보를 프로젝트 메모리에 저장 (품질 게이트: 실행 가능·지속성·고유성 필터) | `remember this`, `store this` |
| `/cancel` | 활성 워크플로 모드 중단 | `cancel`, `stop`, `abort` |
| `/status` | 현재 상태와 활성 에이전트 표시 | `status`, `what's running` |

---

## MCP 서버

OMG에는 워크플로 상태를 지속적으로 관리하는 TypeScript 기반 MCP 서버가 포함되어 있습니다. `.vscode/mcp.json`을 통해 등록되며 다음 6개 도구를 제공합니다.

| 도구 | 목적 |
|------|---------|
| `omg_read` | `scope`별 워크플로 상태 조회: `state`, `prd`, `phase`, `ultragoal`, `checkpoint`, 또는 `all`(간략 요약) |
| `omg_write` | 상태 기록, PRD 및 스토리 생성, autopilot 단계 진행, ultragoal 마일스톤 기록 (`scope` + `op`: `set`, `clear`, `advance`) |
| `omg_verify` | PRD 스토리를 통과 처리하거나 ultragoal을 완료 처리 — fail-closed: 증거가 비어 있거나 통과하지 못한 항목이 하나라도 있으면 거부 |
| `omg_check_completion` | 완료 게이트: 활성 워크플로, 미검증 스토리, 활성 ultragoal 확인 |
| `omg_checkpoint` | 세션 체크포인트를 저장하고 다음 세션용 핸드오프 텍스트 반환 (`omg_read scope:"checkpoint"`로 복원) |
| `omg_memory` | 프로젝트 범위 지식: `get`, `search`, `set`, `delete` |

> **1.4.x에서 넘어오셨나요?** 이전 버전의 27개 도구는 v1.5.0에서 이 6개로 통합되었습니다([매핑](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/design/v1.5-context-diet.md#42-target-surface-6-tools)). 기존 이름을 2.0까지 deprecated 어댑터로 유지하려면 `.vscode/mcp.json`의 서버 `env`에 `OMG_LEGACY_TOOLS=1`을 설정하세요.

상태 데이터는 워크스페이스 내 `.omg/` 아래에 저장됩니다.

```text
.omg/
├── state/              # 모드별 워크플로 상태 파일
├── plans/              # 실행 계획
├── prd.json            # 제품 요구사항 문서
└── project-memory.json # 프로젝트 메모리 저장소
```

---

## Tool Guardrails

OMG는 `.github/hooks/`에 pre/post tool-use 훅을 포함하여 안전장치를 제공합니다.

**Pre-tool-use 가드:**
- `node_modules/` 수정 차단
- `.env` 직접 수정 차단
- `package.json`, `tsconfig.json`, `.gitignore` 삭제 방지
- `git push --force` 및 파괴적 git 명령 차단

**Post-tool-use 추적:**
- `OMG_DEBUG=1`일 때 도구 사용 로그 기록
- omg-autopilot 위상 추적을 위한 수정 파일 기록
- ultraqa 감지를 위한 테스트 결과 추적

---

## 벤치마크

> 모든 수치는 실제 git 이력, 테스트 스위트, `npm audit` 결과에서 추출한 것입니다. 합성 데이터가 아닙니다.

### 컨텍스트 풋프린트 (v1.5.0)

작업을 시작하기도 전에 OMG가 **모든** Copilot 요청에 추가하는 토큰 수입니다 (o200k 토크나이저 기준, MCP 도구는 실제 `tools/list` 응답으로 측정). `cd evals && npm install && npm run baseline`으로 재현할 수 있습니다.

| 항상 주입되는 컨텍스트 | v1.4.4 | v1.5.0 | 변화 |
|-------------------------|-------:|-------:|:------:|
| `copilot-instructions.md` | 3,594 | 549 | −85% |
| MCP 도구 정의 | 2,585 (27개 도구) | 863 (6개 도구) | −67% |
| 스킬 설명 (37) | 1,308 | 1,331 | +2% |
| 에이전트 설명 (28) | 1,213 | 1,213 | — |
| 프롬프트 파일 (3) | 38 | 38 | — |
| **합계** | **8,738** | **3,994** | **−54%** |

> 하한값입니다: 도구 목록을 감싸는 호스트 래퍼 텍스트와 훅이 실행될 때 주입하는 내용은 포함되지 않았습니다. 에이전트와 스킬 본문은 필요할 때만 로드됩니다. 제거된 키워드 표에 있던 모든 문구는 여전히 해당 스킬의 description과 대조해 검사합니다 (`npm run activation`: 80개 문구, 누락 0개).

### 프로젝트 스냅샷 (v1.3.0 기준)

| 지표 | 값 |
|------|----| 
| 전체 코드베이스 | 25,964 줄 |
| 개발 기간 | 12일 (2026년 4월 6–17일) |
| 총 커밋 수 | 33 |
| 에이전트 | 28개 (코어 20 + 언어 리뷰어 8) |
| 스킬 | 22개 |
| MCP 도구 | 19개 |

### 품질 지표

| 지표 | v1.0 (초기) | v1.3.0 (OMG 파이프라인 후) |
|------|:-:|:-:|
| 테스트 통과율 | 없음 | **46 / 46 (100%)** |
| TypeScript 오류 | 미검사 | **0개** |
| 알려진 CVE | 7개 (프로덕션 2 + 개발 5) | **0개** |
| Pre-hook 안전 가드 | 0개 | **6개** |
| Post-hook 추적 기능 | 0개 | **8개** |

### ECC 통합 — 단일 커밋 임팩트 (`9468c02`)

| 지표 | 값 |
|------|----|
| 변경된 파일 수 | 60개 |
| 추가된 라인 수 | 5,844줄 |
| 신규 에이전트 | 8개 언어 리뷰어 에이전트 |
| 신규 스킬 | 4개 (`/tdd`, `/security-scan`, `/coding-standards`, `/skill-stocktake`) |
| 머지 전 발견된 결함 | 훅 쉘 인젝션 + CVE 7개 |

### RALPLAN 합의 계획 결과

| 검토된 결정 수 | 통과 | `@critic` 거부 | 거부율 |
|:-:|:-:|:-:|:-:|
| 9 | 7 | **2** | **22%** |

> 코드 작성 전 계획 단계에서 설계 결정의 22%가 수정됨.

### 보안 스캔 결과

| 카테고리 | 발견 | 수정 |
|----------|:-:|:-:|
| 하드코딩된 시크릿 | 0 | — |
| 프로덕션 CVE | 2개 중간 위험 | ✅ |
| 개발 CVE | 5개 중간 위험 | ✅ |
| 쉘 인젝션 (훅 `FILE_PATH`) | 1개 | ✅ |
| `.env` `.gitignore` 누락 | 1개 | ✅ |
| **수정 후 총 취약점** | | **0개** |

### Pre-Tool-Use 안전 가드

| 가드 | 차단 대상 |
|------|----------|
| `node_modules` 쓰기 보호 | `node_modules/` 내부 편집·생성 |
| `.env` 시크릿 보호 | `.env` 직접 수정 |
| 핵심 설정 파일 삭제 방지 | `package.json`, `tsconfig.json`, `.gitignore` 삭제 |
| 강제 푸시 방지 | `git push --force` |
| 하드 리셋 방지 | `git reset --hard`, `git clean -fd` |
| 경로 순회 차단 | `FILE_PATH`의 `../` 및 특수문자 |

---

## 아키텍처

```text
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # 루트 오케스트레이션 지침
│   ├── agents/                    # 28개 전문 에이전트 정의 (20개 코어 + 8개 언어 리뷰어)
│   ├── skills/                    # 37개 스킬 루틴
│   ├── hooks/                     # pre/post tool-use 가드
│   └── prompts/                   # quick-fix, quick-plan, quick-review 템플릿
├── mcp-server/                    # TypeScript MCP 서버
│   └── src/
│       ├── index.ts               # 서버 진입점
│       ├── state-tools.ts         # 상태 관리
│       ├── prd-tools.ts           # PRD 및 스토리 추적
│       ├── workflow-tools.ts      # 단계 전환 및 완료 확인
│       ├── memory-tools.ts        # 프로젝트 메모리 관리
│       └── model-router.ts        # 작업 복잡도 기반 모델 라우팅
├── .vscode/mcp.json               # VS Code용 MCP 서버 등록
└── .omg/                          # 런타임 상태 디렉터리
```

### 동작 방식

1. **Instructions** (`.github/copilot-instructions.md`) 가 오케스트레이션 규칙과 위임 로직을 정의합니다.
2. **Agents** (`.github/agents/*.agent.md`) 는 역할별 페르소나와 도구 접근 범위를 설정합니다.
3. **Skills** (`.github/skills/*/SKILL.md`) 는 키워드나 슬래시 명령으로 필요할 때 로드됩니다.
4. **MCP Server** 가 상태, PRD, 프로젝트 메모리를 지속적으로 관리합니다.
5. **Hooks** 가 위험한 작업을 막고 워크플로 인지에 필요한 실행 흔적을 남깁니다.

---

## Commit Protocol

OMG는 의사결정 맥락을 남기기 위해 구조화된 git trailer를 사용합니다.

```text
fix(auth): prevent silent session drops during long-running ops

Auth service returns inconsistent status codes on token expiry,
so the interceptor catches all 4xx and triggers inline refresh.

Constraint: Auth service does not support token introspection
Rejected: Extend token TTL to 24h | security policy violation
Confidence: high
Scope-risk: narrow
```

사용 가능한 trailer: `Constraint`, `Rejected`, `Directive`, `Confidence`, `Scope-risk`, `Not-tested`

---

## OMC와의 비교

| 항목 | OMC (oh-my-claudecode) | OMG (oh-my-githubcopilot) |
|---------|----------------------|--------------------------|
| 대상 플랫폼 | Claude Code CLI | GitHub Copilot (VS Code) |
| 설치 방식 | npm 패키지 / 플러그인 마켓플레이스 | 저장소 클론 + MCP 서버 빌드 |
| 에이전트 수 | 19개 이상 | 20개 전문 에이전트 |
| 스킬 | 10개 이상 워크플로 스킬 | 18개 스킬과 키워드 트리거 |
| 상태 관리 | `.omc/` 디렉터리 | MCP 서버 기반 `.omg/` |
| 멀티 모델 | Codex/Gemini via tmux CLI | ccg 스킬 기반 보조 분석 |
| 설정 위치 | `~/.claude/settings.json` | `.github/` + `.vscode/mcp.json` |
| 안전장치 | 플러그인 레벨 훅 | 쉘 기반 pre/post 훅 |
| 상태 표시 | HUD 내장 | VS Code 네이티브 환경 활용 |

---

## 요구사항

- [VS Code](https://code.visualstudio.com/) 와 [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) 확장
- Agent mode가 활성화된 GitHub Copilot Chat
- Node.js 18 이상 (MCP 서버용)

---

## What's New

### v1.5.0 (2026-11-12) — 컨텍스트 다이어트

**이제 OMG가 요청마다 쓰는 컨텍스트가 절반 이하로 줄었습니다.** 항상 주입되는 토큰이 8,738에서 3,994로 줄었으며(−54%), 사용하는 워크플로는 달라지지 않습니다. 자세한 내용은 벤치마크 섹션의 컨텍스트 풋프린트 표를 참고하세요.

- **`copilot-instructions.md`: 3,594 → 549 토큰.** 에이전트·스킬·키워드·도구 카탈로그는 Copilot이 프론트매터와 도구 스키마로 이미 노출하는 내용과 중복이었습니다. 이제 상시 적용되는 의무 사항만 남습니다(완료 전 증거 확보, 별도 리뷰 패스, 커밋 트레일러, 훅 경계, graceful degradation).
- **MCP 도구: 27 → 6** (`omg_read`, `omg_write`, `omg_verify`, `omg_check_completion`, `omg_checkpoint`, `omg_memory`), 2,585 → 863 토큰. `.omg/` 아래의 디스크 포맷은 그대로이므로 1.4.x 상태를 마이그레이션 없이 읽습니다.
- **Fail-closed 검증**: PRD 스토리 통과 처리와 ultragoal 완료 처리는 모든 항목이 통과한, 비어 있지 않은 증거와 함께 `omg_verify`를 호출해야만 가능합니다.
- **트리거 문구 유지**: 키워드 표는 없어졌지만, 표에 있던 모든 문구는 스킬 description을 통해 여전히 해당 스킬을 활성화합니다(80개 문구 확인, 7개 복원 — `prd loop`, `story loop`, `stakeholder interview`, `check secrets`, `audit deps`, `cancel omg`, `cancelomc`).
- **세션 예산 규칙**: 컨텍스트 윈도우의 50%에 도달하면 에이전트는 진행 중인 편집을 마무리하고, 검증된 작업을 커밋하고, 체크포인트를 남긴 뒤 자기완결적인 프롬프트로 핸드오프합니다. `omg_checkpoint`가 핸드오프 텍스트를 반환합니다.
- **종료 보고 규칙**: 모든 작업 보고는 남은 과업 수와 완료된 과업 요약으로 끝납니다.
- **수정 사항**: `OMG: Update Convention Files`가 이제 MCP 서버를 다시 빌드합니다(이전에는 Initialize만 빌드했습니다). 최신 VS Code에서 확장 활성화가 실패하던 문제를 고쳤습니다: MCP provider id가 `package.json`에 선언되어 있지 않아 등록 시 예외가 발생했고, 그 결과 상태 표시줄과 외부 세션 감지가 시작되지 않았습니다. 이제 provider는 `.vscode/mcp.json`에 정의된 서버가 있으면 그것을 우선합니다. PowerShell 훅: force-push 가드가 도구 입력 끝에 오는 `--force` / `-f`를 놓쳤고, 두 훅 모두 Windows PowerShell 5.1에서 실패했습니다 — 수정되어 이제 bash 훅과 동일하게 동작합니다.
- **측정 가능**: `evals/`에 풋프린트 베이스라인(`npm run baseline`), 정적 활성화 검사(`npm run activation`), 선택적 라이브 CLI 프로브가 추가되었습니다.
- **문서**: [ADR-0001](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/adr/0001-replatform.md)(v2 방향), [위협 모델 초안](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/security/threat-model.md), [v1.5 설계 문서](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/design/v1.5-context-diet.md).

**1.4.x에서 업그레이드하기**

1. 1.5.0 VSIX를 설치하고 `OMG: Update Convention Files`를 실행한 다음 창을 다시 로드합니다. 수동 설치의 경우: `.github/`와 `mcp-server/`를 복사한 뒤 `cd mcp-server && npm install && npm run build`를 실행합니다.
2. 직접 작성한 프롬프트나 에이전트가 기존 도구 이름을 호출한다면 6개의 새 도구로 옮기거나, 서버 `env`(`.vscode/mcp.json`)에 `OMG_LEGACY_TOOLS=1`을 설정해 1.4 이름을 deprecated 어댑터로 유지하세요.

**Deprecated — 2.0에서 제거 예정**

- 1.4 MCP 도구 이름 (`OMG_LEGACY_TOOLS=1`일 때만 사용 가능).
- `/resume-claude`, `/push-omc` 및 OMC 브리지 도구 (1.5에서는 이들도 `OMG_LEGACY_TOOLS=1`이 필요합니다).
- `omg_select_model` (에이전트가 프론트매터에 `model:`을 선언합니다).

- **검증**: MCP 서버 빌드 및 테스트 51개(50개 통과; symlink 테스트는 Windows에서 symlink 권한이 필요), VS Code extension unit test 41개, 풋프린트 3,994 토큰, 활성화 80/80.
- VSIX: `oh-my-githubcopilot-1.5.0.vsix` — GitHub Release에 첨부됩니다(더 이상 저장소에 커밋하지 않습니다).

### v1.4.4 (2026-05-16) — OMC 스킬 적응 포팅 + Ultragoal MCP

**고가치 OMC 워크플로를 VS Code/Copilot 환경에 맞게 OMG-native 방식으로 포팅했습니다.** 이번 릴리스는 OMG 스킬을 24개에서 37개로 확장하고 MCP 기반 durable goal 추적을 추가합니다.

- **신규 MCP 기반 `ultragoal` 워크플로**: `omg_ultragoal_create`, `omg_ultragoal_status`, `omg_ultragoal_checkpoint`, `omg_ultragoal_complete`가 `.omg/ultragoal/` 아래에 fail-closed goal 아티팩트를 저장합니다.
- **13개 OMC-inspired 적응 스킬**: `visual-verdict`, `release`, `deepinit`, `skillify`, `writer-memory`, `configure-notifications`, `ultragoal`, `wiki`, `autoresearch`, `hud`, `external-context`, `sciomc`, `ask`.
- **라우팅/헬스체크 갱신**: 새 slash command, 키워드 트리거, ultragoal 완료 규칙, hook gate, 스킬 기준값(`CORE=24`, `EXTENDED=37`)을 반영했습니다.
- **템플릿 동기화**: extension 템플릿에 신규 스킬, `ultragoal` MCP 서버 소스, 테스트, README 변경이 포함됩니다.
- **검증**: MCP build/test 23개 통과, VS Code extension unit test 29개 통과, VSIX 20MB 미만 검증.
- VSIX: `oh-my-githubcopilot-1.4.4.vsix`.

### v1.4.3 (2026-05-11) — 양방향 브리지: OMG → OMC 푸시

**v1.4.0 단방향 브리지를 OMG ↔ OMC 양방향으로 완성합니다.** v1.4.0은 `omc → omg` 단방향 import만 제공했고, v1.4.3은 반대 방향 `omg → omc` export를 추가하여 GitHub Copilot에서 한 작업을 Claude Code에서 이어갈 수 있게 합니다.

- **신규 모듈 `mcp-server/src/bridge/omg-exporter.ts`**: 단순 복사가 아닌 컴포지션 방식 — `prd.json`과 `project-memory.json`은 파일 복사이지만, OMG 체크포인트의 `active_modes[]`는 모드별 `.omc/state/{mode}-state.json` 파일로 **분해**(decompose)됩니다(v1.4.0 omc-importer 컴포지션의 역연산). `.omc/state/session-checkpoint.json`은 변환된 provenance와 함께 새로 작성됩니다.
- **신규 공용 헬퍼 `mcp-server/src/bridge/conflict-utils.ts`**: `shouldSkipForConflict()`는 `session-checkpoint.json`의 충돌 판단에 임베디드 `timestamp` 필드를 우선 사용하고(다른 파일은 mtime 폴백 — git checkout이 mtime을 건드리는 문제 해소), `rotateBackup()`은 최대 N=3개의 타임스탬프 `.previous.{ISO}.json` 스냅샷을 import/export 양쪽에 동일하게 적용합니다.
- **신규 MCP 도구 `omg_export_external_session({target: "omc", force?})`** 원자성 보장: `.omg/state/last-export-token.json` 작성이 마지막 부수효과 — 부분 실패 시 토큰이 남지 않아 후속 작업이 트랜잭션을 미커밋으로 올바르게 인식합니다.
- **이중 토큰 기반 라운드트립 가드**: importer는 `.omg/state/last-export-token.json` 또는 대상 체크포인트의 `source_origin === "bridged-from-omg"` 중 하나만 일치해도 가드를 발동시킵니다. 한쪽이 삭제돼도 보호됩니다. 시간 기반 TTL은 없으며, 토큰은 대상의 `source_origin`이 `"native"`로 바뀌거나 `source_session_id`가 변경될 때 무효화됩니다.
- **provenance 스키마 확장** (하위 호환): 새 `source_origin` 필드(`"native" | "bridged-from-omc" | "bridged-from-claude-code" | "bridged-from-omg"`)가 권위 있는 provenance 신호이고, 기존 `source_tool: "copilot"`은 그대로 유지됩니다. 새 `workspace_root` 필드는 프로젝트 식별 가드를 구동하여, 소스 체크포인트의 워크스페이스 경로가 현재 워크스페이스와 다르면 **모든 파일 변경 전에** 중단합니다.
- **`/push-omc` 스킬 (6단계)**: detect → compare → confirm → export → summarize → continue. 트리거 키워드: `/push-omc`, `"push omc"`, `"omc 푸시"`, `"omc로 보내기"`, `"sync to omc"`, `"export to omc"`. 미러본 `vscode-omg/resources/templates/skills/push-omc/SKILL.md`.
- **VS Code 명령 `omg.pushExternal`** ("OMG: Push to External Session (OMC)"): 사용자 트리거 전용 — activation 시점 푸시 알림 없음(푸시는 항상 명시적 사용자 동작).
- **`omg_compare_checkpoints` 양방향 보고**: 이제 `newer_than_omg`와 `omg_newer_than_external`을 함께 반환하여 `/push-omc`와 `/resume-claude`가 같은 비교 surface를 공유합니다.
- **테스트 8 → 18+** 6개 존(Unit, Provenance, Round-trip guard, Composition, Conflict-path, Project-identity)에 분산.
- **v1.5.x로 보류**: `omg → claude-code` 방향. Claude Code의 resume-by-id 계약과 호환되는 유효한 `tool_use`/`tool_result` UUID 체인을 합성해야 함; tracking: TBD.
- VSIX: `oh-my-githubcopilot-1.4.3.vsix`.

### v1.4.2 (2026-05-10) — Opus 4.7 → 4.6 Fallback 배열

**Opus 4.7 라우팅을 cost-tier 안전하게 만들기 위해 `Claude Opus 4.6 (copilot)`를 인라인 fallback으로 추가했습니다.**

- 7개 심층 추론 에이전트(`analyst`, `architect`, `code-reviewer`, `critic`, `omg-coordinator`, `planner`, `security-reviewer`)의 `model:`을 YAML 배열로 변경: `["Claude Opus 4.7 (copilot)", "Claude Opus 4.6 (copilot)"]`.
- 배경: VS Code Copilot은 subagent 호출 시 현재 채팅 베이스 모델의 cost-tier 상한을 초과하면 차단합니다. 베이스가 `GPT-5.5`(7.5x)일 때 `Opus 4.7`(15x)만 지정하면 강등 없이 그대로 실패했습니다.
- 변경 후: 세션 상한이 허용하면 Opus 4.7을 사용하고, 아니면 자동으로 Opus 4.6으로 폴백합니다.
- GPT-5.5(15개) 및 Sonnet 4.6(6개) 라우팅은 그대로입니다.
- VSIX: `oh-my-githubcopilot-1.4.2.vsix`.

### v1.4.1 (2026-05-09) — 역할 기반 에이전트 모델 라우팅

**전체 28개 에이전트를 작업 성격에 맞는 Copilot 모델 선호값으로 재매핑**

- 에이전트 `model:` 프론트매터를 `GPT-5.5 (copilot)`, `Claude Sonnet 4.6 (copilot)` 같은 공식 qualified model-name 문자열로 업데이트.
- 고위험 추론/승인 에이전트는 Claude Opus 4.7 유지, 디버깅·검증·리서치·테스트·디자인·전문 리뷰 에이전트는 GPT-5.5로 라우팅, 실행·탐색·문서·QA 드라이빙·git·단순화 워크플로는 Claude Sonnet 4.6으로 라우팅.
- `omg_select_model` 추천도 동일한 허용 모델 집합과 역할 기반 에이전트 override를 사용하도록 업데이트하여 오래된 `gpt-4.1`, `gpt-4.1-mini`, dot-format Claude 모델 추천 제거.
- 모델 smoke test 결과: `GPT-5.5 (copilot)` 호출 성공. `Claude Opus 4.7 (copilot)`은 Copilot이 모델명을 인식했지만 현재 환경의 cost-tier 제한으로 차단되었으며, stale 모델 문자열 문제는 아님.

| 에이전트 | 모델 |
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

Opus 4.6은 기본 에이전트 모델이 아니라 모델 라우터의 명시적 fallback 대안으로만 유지됩니다.

### v1.4.0 (2026-05-03) — Claude Code / OMC 세션 브릿지

**단방향 브릿지: 중단된 Claude Code 또는 OMC 세션을 GitHub Copilot에서 이어서 작업**

- **Claude Code JSONL 임포터**: `~/.claude/projects/` 세션 로그를 파싱하여 수정된 파일, 마지막 사용자 프롬프트, 마지막 어시스턴트 응답을 추출. Write/Edit/MultiEdit tool_use 블록 감지 지원.
- **OMC 임포터**: `.omc/` 상태 디렉토리(PRD, 워크플로 상태, 체크포인트, 프로젝트 메모리)를 `.omg/` 등가물로 매핑. mtime 기반 충돌 해결.
- **새 MCP 도구 3종**: `omg_detect_external_session`(읽기 전용 감지), `omg_import_external_session`(백업 후 임포트), `omg_compare_checkpoints`(타임스탬프 비교).
- **VS Code 자동 감지**: 활성화 시 외부 세션을 감지하여 알림 표시 ("이어받기 / 무시 / 항상 무시"). OMG 체크포인트가 30분 이내이면 건너뜀.
- **`/resume-claude` 스킬**: 6단계 워크플로 — 감지 → 비교 → 확인 → 임포트 → 요약 → 계속. 키워드 트리거: "resume claude", "claude 이어받기", "이어서 작업".
- **보안**: 임포트된 체크포인트 파일에 `chmod 0600` 적용. 기존 체크포인트는 임포트 전 `.previous.json`으로 백업.
- **체크포인트 스키마 확장**: 4개 선택 필드 추가 — `source_tool`, `source_session_id`, `imported_at`, `imported_summary` (하위 호환).

### v1.3.1 (2026-04-23) — Copilot CLI 지원

**VS Code 에이전트 모드와 독립형 Copilot CLI 이중 호환** (Issue #4)

- **에이전트 프론트매터 정규화**: 전체 28개 에이전트의 `model:` 필드를 배열에서 문자열로 변경. CLI 도구 등가물(`read`, `edit`, `shell`, `create`, `delete`)을 `tools:` 목록에 추가.
- **훅 이중 모드 입력**: pre/post tool-use 훅이 VS Code 환경변수와 CLI stdin JSON 모두 수용. 도구명 정규화로 CLI 이름을 VS Code 등가물로 매핑 후 가드 로직 적용.
- **`hooks.json` 등록**: CLI 훅 래퍼 파일로 `preToolUse` / `postToolUse` 탐색 지원.
- **Adopt 스크립트 `--target-env`**: `--target-env vscode|cli|both` 플래그 추가(기본값: `both`). CLI 모드에서 `.copilot/mcp-config.json` 생성, `.vscode/mcp.json` 건너뜀. `--global-mcp`으로 `~/.copilot/`에 전역 설치 가능.
- **스킬 CLI 폴백**: 대화형 스킬 5개(`deep-interview`, `omg-autopilot`, `ralplan`, `plan`, `self-improve`)에 CLI 폴백 추가 — `vscode_askQuestions` 미사용 시 마크다운 번호 옵션 제시.
- **문서화**: CLI 배지, "방법 C: Copilot CLI" 빠른 시작, `--target-env` 사용법을 모든 README에 추가.

### v1.3.0 (2026-04-23) — Windows 지원, MIT 라이선스 & 비파괴 초기화

**커뮤니티 요청 개선 3건 (Issues #5, #6, #7)**

- **Windows PowerShell 지원** (Fixes #5): 모든 셸 스크립트의 `.ps1` 등가물 추가 — `pre-tool-use.ps1`, `post-tool-use.ps1`, `omg-adopt.ps1`. 훅 템플릿 번들링 포함. README에 PowerShell 예제 추가.
- **copilot-instructions.md 비파괴 처리** (Fixes #6): `initWorkspace`가 기존 파일을 덮어쓰지 않고 OMG 내용을 추가(append). 마커 기반 섹션 감지로 재초기화 시 업데이트 지원.
- **MIT 라이선스 명확화** (Fixes #7): GitHub API 감지용 루트 `LICENSE` 파일 추가. 모든 README에서 "All rights reserved" 모순 제거.

### v1.2.0 (2026-04-17) — 에이전트 모델 Claude Opus 4.7 업그레이드

**모든 에이전트 모델 참조를 Claude Opus 4.6에서 4.7로 업그레이드**

- `model: [claude-opus-4-6]` → `model: [claude-opus-4-7]` — Opus 라우팅 에이전트 8개 전체 변경
- 활성 에이전트(`.github/agents/`)와 익스텐션 템플릿(`vscode-omg/resources/templates/agents/`) 모두 적용
- 대상 에이전트: @architect, @code-reviewer, @planner, @security-reviewer, @analyst, @omg-coordinator, @code-simplifier, @critic
- 검증 완료: MCP 서버 빌드+테스트(**18/18**), vscode-omg 빌드+테스트(**28/28**), TypeScript 타입 체크 — 전체 통과

### v1.1.9 (2026-04-16) — `.omc` → `.omg` 상태 경로 마이그레이션

**소스/템플릿 전반의 상태 경로 일관성 개선**

- 남아 있던 `.omc/` 경로를 `.omg/`로 정리 (skills, agents, MCP/extension 템플릿 포함)
- 훅 상태 변수명 `OMC_STATE_DIR` → `OMG_STATE_DIR` 반영
- 마이그레이션 후 MCP 서버 빌드 및 테스트 검증 완료 (**18/18 통과**)
- OMC 비교 표의 `.omc/` 표기는 의도적으로 유지

### v1.1.8 (2026-04-13) — 컨텍스트 보존 & 메모리 고도화

**장기 실행 워크플로 안정성 대폭 강화**

- Tier-2 메모리 기능 고도화:
  - `omg_search_memory` 추가 (key/value/category/tags 통합 검색)
  - `omg_write_memory`에 `tags` 지원 추가
  - 기존 메모리 데이터와의 하위 호환 처리 강화
- Tier-3 컨텍스트 압력 대응 프로토콜 추가:
  - `omg_checkpoint`, `omg_restore_checkpoint`, `omg_context_status`
  - Tool I/O 누적 바이트 기반 자동 checkpoint advisory
  - `OMG_CONTEXT_THRESHOLD`로 임계치 설정 가능 (기본 400KB)
- Hook 안전성 및 라이프사이클 개선:
  - checkpoint 후 카운터 리셋으로 반복 advisory 루프 방지
  - force push 감지 강화 (`--force`, `-f`), `--force-with-lease`는 허용
  - 파괴적 git 명령 차단 패턴 확장
- `copilot-instructions.md`에 세션 복구/시작 시 checkpoint 복원 규칙 추가

### v1.1.7 (2026-04-12) — 인터랙티브 Hook 시스템

**OMC 동등 기능: `vscode_askQuestions`를 통한 워크플로 중간 사용자 의사결정**

5개의 핵심 스킬이 의사결정 게이트에서 구조화된 객관식 옵션을 표시합니다. OMC의 게이트웨이 레벨 인터럽트 훅과 동일한 방식으로, VS Code Copilot 내에서 네이티브로 동작합니다.

#### Hook이 추가된 스킬

| 스킬 | Hook 포인트 |
|------|------------|
| `/deep-interview` | 매 인터뷰 라운드 (모호성 %) · 스펙 승인 · 실행 경로 선택 |
| `/plan` | 인터뷰 질문 · 준비 완료 게이트 · 트레이드오프 선택 · 크리틱 거부 · 플랜 승인 |
| `/ralplan` | 옵션 선택 · 아키텍트 우려사항 · 크리틱 거부 · 최종 승인 |
| `/self-improve` | 타겟 리포 · 신뢰 확인 · 목표 인터뷰 · 하네스 규칙 (셋업 단계만 — 루프는 자율 실행) |
| `/omg-autopilot` | 모호한 입력 리다이렉트 · 스펙 확인 · QA 반복 실패 · 검증 거부 |

#### 동작 방식

- 각 의사결정 게이트에서 스킬이 3~5개 선택지, `recommended` 기본값, `allowFreeformInput: true`와 함께 `vscode_askQuestions`를 호출
- 사용자가 옵션을 선택하거나 직접 입력하면 워크플로가 그에 따라 계속 진행
- 모든 hook은 추적을 위해 고유한 `header` 사용 (예: `"interview-round-3"`, `"ralplan-approval"`)
- 전역 hook 프로토콜은 `copilot-instructions.md → Interactive Hook System`에 문서화됨

---

### v1.1.0 (2026-04-10) — ECC 통합

**대규모 업그레이드: ECC(Everything Claude Code)의 핵심 기능을 OMG에 통합**

#### 신규 에이전트 — 언어 리뷰어 Tier (8개)

각 에이전트에 13~21개의 언어별 스타일 규칙이 내장되어 있습니다.

- **@typescript-reviewer** — strict 모드, no-any, 완전한 판별 유니온
- **@python-reviewer** — PEP 8, 타입 힌트, 관용적 패턴
- **@rust-reviewer** — 소유권, 빌림 검사기, unsafe 정당화
- **@go-reviewer** — 관용적 Go, 고루틴 안전성, 명시적 오류 처리
- **@java-reviewer** — SOLID, Spring 패턴, null 안전성
- **@csharp-reviewer** — nullable 분석, async/await, C# 관용구
- **@swift-reviewer** — Swift 동시성, 메모리 안전성, SwiftUI 패턴
- **@database-reviewer** — 쿼리 성능, 파라미터화, 스키마 설계

#### 신규 스킬 (4개)

- **`/tdd`** — 완전한 TDD 강제: 레드-그린-리팩터 사이클, 프레임워크 참조 (Jest/pytest/Cargo/Go test)
- **`/security-scan`** — 빠른 보안 점검: 시크릿 패턴 (sk-/ghp_/AKIA), CVE 감사, 입력 검증, 인증 확인
- **`/coding-standards`** — 언어 공통 코딩 표준 참조 (명명, 함수, 오류, 안티패턴, SOLID). 모든 리뷰어 에이전트가 인용.
- **`/skill-stocktake`** — 스킬 인벤토리 감사: 프론트매터 유효성, 템플릿 동기화, 스텁, 커버리지 갭

#### 기존 핵심 에이전트 강화 (7개)

| 에이전트 | 추가 내용 |
|-------|----------------|
| **@debugger** | 7개 언어 빌드 오류 해결 가이드 (Node/TS, Python, Rust, Go, Java, C#, Swift) |
| **@security-reviewer** | 시크릿 탐지 정규식 패턴, JWT/세션/암호화 규칙, OWASP 주석 |
| **@qa-tester** | Playwright Page Object Model 패턴, E2E 분류 테이블 |
| **@writer** | CODEMAP 생성 템플릿 + 자동 업데이트 워크플로 |
| **@code-reviewer** | D9 정규 코딩 표준 테이블 내장 |
| **@test-engineer** | 프레임워크 감지 테이블, 커버리지 갭 프로토콜, flaky test 근본 원인 |
| **@code-simplifier** | 복잡도 지표 테이블, 단순화 패턴, 안정성 예외 처리 |

#### 기존 스킬 강화 (1개)

- **`/remember`** — 품질 게이트 추가: 실행 가능성·지속성·고유성 3단계 필터로 저장 전 검증

#### 인프라

- **계층적 에이전트/스킬 임계값**: warn <20/18, info <28/22, silent ≥28/22 (하위 호환)
- **트리뷰 카테고리 그룹화**: 에이전트 수 >20이면 "Core Agents" + "Language Reviewers" 자동 분리
- **post-tool-use 훅** (`OMG_LINT_ON_EDIT=1`): 파일 편집 시 opt-in 타입체크/ESLint + `FILE_PATH` 위생 처리
- **보안 패치**: hono/node-server CVE 수정, vitest 4.1.4 업그레이드, `.env*` `.gitignore` 추가

---

### v1.0.5 (2026-04-10)

**버그 수정: VS Code 내장 Autopilot과의 스킬 이름 충돌**

- **이름 변경**: `/autopilot` 스킬을 `/omg-autopilot`으로 변경하여 VS Code 내장 "Autopilot (Preview)" 권한 모드와의 충돌 해결
- **YAML 프론트매터 수정**: 모든 SKILL.md 파일에서 지원되지 않는 `allowed-tools` 필드 제거, `hint`를 VS Code 스펙에 맞게 `argument-hint`로 변경
- **근본 원인**: 스킬 이름 `autopilot`이 OMG 스킬 명령어 대신 VS Code 내부 권한 모드 전환을 트리거함
- **적용 범위**: 스킬 디렉토리, MCP 서버 코드, 에이전트 정의, 상호 참조, 테스트, 전체 문서 업데이트

---

## 라이선스

MIT

---

## 저작권

Copyright (c) 2026 jmstar85. [MIT 라이선스](LICENSE)에 따라 배포됩니다.

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**GitHub Copilot을 위한 멀티 에이전트 오케스트레이션.**

</div>