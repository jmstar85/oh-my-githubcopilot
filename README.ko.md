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

<h1 align="center">Now, you can also use this amazing features such as OMC for GitHub Copilot!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

---

## OMG란?

**oh-my-githubcopilot (OMG)** 는 [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode)가 Claude Code에서 보여준 멀티 에이전트 오케스트레이션 패턴을 **GitHub Copilot** 환경으로 옮겨온 프로젝트입니다.

OMC가 Claude Code를 특화된 에이전트와 워크플로 자동화로 확장했다면, OMG는 VS Code의 Copilot agent mode에서 같은 철학을 구현합니다. 하나의 도우미가 모든 일을 처리하는 대신, OMG는 **20개의 전문 에이전트**와 **18개의 재사용 가능한 스킬**을 MCP 서버를 통해 조율하여 계획, 구현, 리뷰, 검증을 구조적으로 수행합니다.

> **이 프로젝트는 OMC의 포크나 복제가 아닙니다.** GitHub Copilot의 에이전트 커스터마이징 기능(`.agent.md`, `.prompt.md`, `SKILL.md`, MCP 도구)에 맞춰 처음부터 독립적으로 구현되었으며, OMC의 멀티 에이전트 설계 방식에서 영감을 받았습니다.

---

## 왜 OMG인가?

- **VS Code 안에서 바로 동작** — 별도 CLI나 외부 런타임 없이 Copilot agent mode 위에서 작동합니다.
- **전문화된 에이전트** — 읽기 전용 분석가부터 전체 권한 실행가까지, 역할이 분리된 20개 에이전트
- **워크플로 자동화** — 자율 실행 `autopilot`, 끝까지 밀어붙이는 `ralph`, 병렬 실행 `ultrawork`
- **안전 가드레일** — pre/post tool-use 훅으로 파괴적인 작업을 기본 차단
- **MCP 기반 상태 관리** — 워크플로 상태, PRD, 프로젝트 메모리를 세션 간 유지
- **자연어 트리거** — "autopilot build me a REST API"처럼 말하면 오케스트레이션 시작
- **검증 우선 설계** — 작성과 리뷰를 분리하고, 완료 주장은 증거 기반으로만 허용

---

## 빠른 시작

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
autopilot: build a REST API for managing tasks
```

이후에는 OMG가 계획, 구현, 리뷰, 검증 흐름을 이어서 처리합니다.

### 어디서 시작해야 할지 모르겠다면?

요구사항이 아직 모호하거나 생각을 정리하고 싶다면:

```
deep-interview "I want to build a task management app"
```

OMG가 소크라테스식 질문을 통해 숨은 가정과 요구사항을 드러내고, 코드를 쓰기 전에 문제를 명확히 정리합니다.

---

## 에이전트

OMG는 **20개의 전문 에이전트**를 포함하며, 각 에이전트는 역할과 접근 권한이 분리되어 있습니다. 정의 파일은 `.github/agents/` 아래의 `.agent.md` 형식입니다.

| 에이전트 | 역할 | 권한 |
|-------|------|--------|
| **@omg-coordinator** | 메인 오케스트레이터, autopilot/ralph/팀 워크플로 조율 | Full |
| **@executor** | 구현 담당, 기능 개발과 버그 수정 | Full |
| **@debugger** | 원인 분석, 스택 트레이스, 빌드 오류 해결 | Full |
| **@architect** | 아키텍처 분석, 시스템 설계, 구조 검토 | Read-only |
| **@planner** | 전략적 계획 수립과 인터뷰 기반 플래닝 | Plans only |
| **@analyst** | 요구사항 분석, 누락 탐지, 범위 리스크 점검 | Read-only |
| **@verifier** | 증거 기반 완료 검증, 테스트 적절성 확인 | Test runner |
| **@code-reviewer** | 심각도 기반 코드 리뷰, 논리 결함 점검 | Read-only |
| **@security-reviewer** | OWASP, 시크릿, 인증/인가, 의존성 보안 점검 | Read-only |
| **@critic** | 계획/코드에 대한 엄격한 게이트 리뷰 | Read-only |
| **@test-engineer** | 테스트 전략, TDD, flaky test 강화 | Full |
| **@designer** | UI/UX 설계와 프론트엔드 구현 | Full |
| **@writer** | README, API 문서, 아키텍처 문서 작성 | Full |
| **@tracer** | 증거 기반 인과 추적과 가설 검증 | Full |
| **@scientist** | 데이터 분석, 통계, 시각화 | Read-only |
| **@qa-tester** | tmux 기반 CLI 테스트, 통합/E2E 검증 | Full |
| **@git-master** | 커밋 분리, 리베이스, 히스토리 관리 | Git only |
| **@code-simplifier** | 코드 단순화, 복잡도 축소, 중복 제거 | Full |
| **@explore** | 코드베이스 탐색, 파일 검색, 구조 파악 | Read-only |
| **@document-specialist** | 외부 문서 조사, API 레퍼런스 조회 | Read-only |

---

## 스킬

스킬은 슬래시 명령이나 자연어 키워드로 활성화되는 재사용 가능한 워크플로 루틴입니다. `.github/skills/` 아래에 정의됩니다.

### 워크플로 스킬

| 스킬 | 설명 | 트리거 키워드 |
|-------|-------------|-----------------|
| `/autopilot` | 아이디어부터 동작하는 코드까지 자율 실행 | `autopilot`, `build me`, `create me` |
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

### 유틸리티 스킬

| 스킬 | 설명 | 트리거 키워드 |
|-------|-------------|-----------------|
| `/remember` | 정보를 프로젝트 메모리에 저장 | `remember this`, `store this` |
| `/cancel` | 활성 워크플로 모드 중단 | `cancel`, `stop`, `abort` |
| `/status` | 현재 상태와 활성 에이전트 표시 | `status`, `what's running` |

---

## MCP 서버

OMG에는 워크플로 상태를 지속적으로 관리하는 TypeScript 기반 MCP 서버가 포함되어 있습니다. `.vscode/mcp.json`을 통해 등록되며 다음 도구 그룹을 제공합니다.

| 도구 그룹 | 도구 | 목적 |
|-----------|-------|---------|
| **State** | `omg_read_state`, `omg_write_state` | autopilot, ralph, ultrawork 등 모드별 상태 관리 |
| **PRD** | `omg_read_prd`, `omg_update_story`, `omg_verify_story` | 사용자 스토리 추적이 포함된 PRD 관리 |
| **Workflow** | `omg_check_completion`, `omg_next_phase` | 단계 전환과 완료 여부 검증 |
| **Memory** | `omg_read_memory`, `omg_write_memory` | 프로젝트 지식 저장 |
| **Model Router** | `omg_select_model` | 작업 복잡도에 따른 모델 추천 |

상태 데이터는 워크스페이스 내 `.omc/` 아래에 저장됩니다.

```text
.omc/
├── state/              # 모드별 워크플로 상태 파일
├── plans/              # 실행 계획
├── sessions/           # 세션 추적
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
- autopilot 위상 추적을 위한 수정 파일 기록
- ultraqa 감지를 위한 테스트 결과 추적

---

## 아키텍처

```text
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # 루트 오케스트레이션 지침
│   ├── agents/                    # 20개 전문 에이전트 정의
│   ├── skills/                    # 18개 스킬 루틴
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
└── .omc/                          # 런타임 상태 디렉터리
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
| 상태 관리 | `.omc/` 디렉터리 | MCP 서버 기반 `.omc/` |
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

## 라이선스

MIT

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**GitHub Copilot을 위한 멀티 에이전트 오케스트레이션.**

</div>