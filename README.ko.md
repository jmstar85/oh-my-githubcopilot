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

**oh-my-githubcopilot (OMG)** 는 [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode)가 Claude Code에서 보여준 멀티 에이전트 오케스트레이션 패턴을 **GitHub Copilot** 환경으로 옮겨온 프로젝트로, 이제 **[Everything Claude Code (ECC)](https://github.com/GreatScottyMac/everything-claude-code)** 의 최고 기능까지 통합하여 더욱 강력해졌습니다.

OMC가 Claude Code를 특화된 에이전트와 워크플로 자동화로 확장했다면, OMG는 VS Code의 Copilot agent mode에서 같은 철학을 구현합니다. ECC 통합(v1.1.0)으로 OMG는 ECC의 검증된 패턴도 포함합니다: 8개 언어 전문 리뷰어 에이전트, TDD 적용, 빠른 보안 스캔, 표준 코딩 규범 등. 하나의 도우미가 모든 일을 처리하는 대신, OMG는 **28개의 전문 에이전트**와 **22개의 재사용 가능한 스킬**을 MCP 서버를 통해 조율하여 계획, 구현, 리뷰, 검증을 구조적으로 수행합니다.

> **이 프로젝트는 OMC나 ECC의 포크나 복제가 아닙니다.** GitHub Copilot의 에이전트 커스터마이징 기능(`.agent.md`, `.prompt.md`, `SKILL.md`, MCP 도구)에 맞춰 처음부터 독립적으로 구현되었으며, OMC의 멀티 에이전트 설계 방식에서 영감을 받고 ECC의 검증된 패턴을 선택적으로 통합했습니다.

---

## 왜 OMG인가?

- **VS Code 안에서 바로 동작** — 별도 CLI나 외부 런타임 없이 Copilot agent mode 위에서 작동합니다.
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
     ```bash
     code --install-extension ./vscode-omg/oh-my-githubcopilot-1.2.2.vsix
     ```
     > VSIX 파일을 다른 위치에 다운로드했다면, 해당 로컬 경로로 바꿔서 실행하세요.
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

### 어디서 시작해야 할지 모르겠다면?

요구사항이 아직 모호하거나 생각을 정리하고 싶다면:

```
deep-interview "I want to build a task management app"
```

OMG가 소크라테스식 질문을 통해 숨은 가정과 요구사항을 드러내고, 코드를 쓰기 전에 문제를 명확히 정리합니다.

### 다른 VS Code 프로젝트에서도 OMG 사용하기

OMG는 워크스페이스 단위로 동작하므로, 프로젝트별로 적용하는 방식을 권장합니다.

이 저장소에는 다른 프로젝트 적용을 위한 스크립트가 포함되어 있습니다.

```bash
scripts/omg-adopt.sh --target <대상-프로젝트-경로> --mode <template|submodule|subtree>
```

#### 운영팁 1: 템플릿 방식 (신규 프로젝트)

새 프로젝트에 OMG 구성을 바로 복사해 시작할 때 사용합니다.

```bash
scripts/omg-adopt.sh --target ~/work/my-new-app --mode template
```

#### 운영팁 2: submodule/subtree 방식 (업데이트 추적)

OMG 변경사항을 주기적으로 추적해 동기화하려면 아래 중 하나를 사용하세요.

```bash
# Submodule 방식
scripts/omg-adopt.sh --target ~/work/my-app --mode submodule

# Subtree 방식
scripts/omg-adopt.sh --target ~/work/my-app --mode subtree
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

OMG에는 워크플로 상태를 지속적으로 관리하는 TypeScript 기반 MCP 서버가 포함되어 있습니다. `.vscode/mcp.json`을 통해 등록되며 다음 도구 그룹을 제공합니다.

| 도구 그룹 | 도구 | 목적 |
|-----------|-------|---------|
| **State** | `omg_read_state`, `omg_write_state`, `omg_clear_state`, `omg_list_active` | 워크플로 상태 CRUD 및 활성 모드 목록 |
| **PRD** | `omg_create_prd`, `omg_read_prd`, `omg_update_story`, `omg_verify_story` | PRD 생성, 스토리 추적, 검증 |
| **Workflow** | `omg_check_completion`, `omg_next_phase`, `omg_get_phase_info` | 단계 전환, 완료 검증, 단계 상태 조회 |
| **Memory** | `omg_read_memory`, `omg_write_memory`, `omg_delete_memory` | 프로젝트 범위 지식 저장 |
| **Model Router** | `omg_select_model` | 작업 복잡도에 따른 모델 추천 |

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

### 프로젝트 스냅샷 (v1.2.0 기준)

| 지표 | 값 |
|------|----| 
| 전체 코드베이스 | 25,964 줄 |
| 개발 기간 | 12일 (2026년 4월 6–17일) |
| 총 커밋 수 | 33 |
| 에이전트 | 28개 (코어 20 + 언어 리뷰어 8) |
| 스킬 | 22개 |
| MCP 도구 | 19개 |

### 품질 지표

| 지표 | v1.0 (초기) | v1.2.0 (OMG 파이프라인 후) |
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
│   ├── skills/                    # 22개 스킬 루틴
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

Copyright © 2026 jmstar85. All rights reserved.

이 저장소의 모든 콘텐츠 — 소스 코드, 문서, 에이전트 정의, 스킬 정의, MCP 서버 구현, 프롬프트 템플릿, 구성 파일 등 — 에 대한 지적 재산권은 **jmstar85** (저장소 소유자)에게 있습니다. MIT 라이선스 조건 외의 무단 복제, 배포 또는 상업적 이용은 엄격히 금지됩니다.

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**GitHub Copilot을 위한 멀티 에이전트 오케스트레이션.**

</div>