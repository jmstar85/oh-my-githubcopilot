---
marp: true
theme: default
paginate: true
backgroundColor: #ffffff
style: |
  section {
    font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  }
  section.lead {
    text-align: center;
    background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a2332 100%);
    color: #e6edf3;
  }
  section.lead h1 {
    color: #58a6ff;
    font-size: 2.5em;
  }
  section.lead h2 {
    color: #8b949e;
    font-weight: 400;
  }
  section.invert {
    background: #0d1117;
    color: #e6edf3;
  }
  section.invert h1, section.invert h2 {
    color: #58a6ff;
  }
  h1 { color: #0969da; }
  h2 { color: #1a7f37; }
  table { font-size: 0.75em; }
  code { background: #f6f8fa; color: #0550ae; }
  strong { color: #0969da; }
  blockquote { border-left: 4px solid #58a6ff; padding-left: 16px; color: #656d76; }
  .columns { display: flex; gap: 2em; }
  .col { flex: 1; }
  em { color: #8250df; font-style: normal; }
---

<!-- _class: lead -->

# oh-my-githubcopilot

## Multi-Agent Orchestration for GitHub Copilot

**28 Agents · 22 Skills · MCP-Powered State**

![w:200](https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github)

---

# 목차

1. OMG란 무엇인가?
2. 왜 OMG인가? — 핵심 가치
3. 아키텍처 개요
4. 28개 전문 에이전트
5. 22개 재사용 스킬
6. 핵심 워크플로: omg-autopilot / ralph / ultrawork
7. MCP 서버 & 상태 관리
8. 안전장치 (Tool Guardrails)
9. 벤치마크 & 품질 지표
10. 설치 및 시작 방법
11. 활용 시나리오
12. 요약 & 다음 단계

---

<!-- _class: invert -->

# 1. OMG란 무엇인가?

---

# OMG = oh-my-githubcopilot

> **GitHub Copilot Agent Mode 위에서 동작하는 멀티 에이전트 오케스트레이션 레이어**

<div class="columns">
<div class="col">

### 기존 Copilot
- 단일 AI 어시스턴트
- 모든 작업을 하나가 처리
- 상태 유지 불가
- 구조화된 워크플로 없음

</div>
<div class="col">

### OMG 적용 후
- **28개 전문 에이전트**가 역할 분담
- **22개 스킬**로 워크플로 자동화
- **MCP 서버**로 세션 간 상태 유지
- **안전장치(Hook)**로 파괴적 작업 차단

</div>
</div>

---

# 탄생 배경

```
oh-my-claudecode (OMC)        Everything Claude Code (ECC)
   Claude Code CLI                 검증된 패턴들
   멀티 에이전트 설계               8개 언어 리뷰어
   워크플로 자동화                   TDD, 보안스캔
         \                          /
          \                        /
           ┌──────────────────────┐
           │  oh-my-githubcopilot │
           │       (OMG)          │
           │  GitHub Copilot +    │
           │  VS Code Agent Mode  │
           └──────────────────────┘
```

> OMC/ECC의 포크가 아닌, Copilot의 `.agent.md`, `SKILL.md`, MCP 도구를 활용한 **독립 구현**

---

<!-- _class: invert -->

# 2. 왜 OMG인가?

---

# 7가지 핵심 가치

| # | 가치 | 설명 |
|---|------|------|
| 1 | **VS Code 네이티브** | 추가 CLI, 외부 프로세스 불필요. Copilot agent mode 위에서 바로 동작 |
| 2 | **전문화된 에이전트** | 읽기 전용 분석가 ~ 전체 권한 실행가까지 역할·권한 분리 |
| 3 | **워크플로 자동화** | omg-autopilot(자율), ralph(끝까지), ultrawork(병렬) |
| 4 | **안전 가드레일** | pre/post 훅으로 `node_modules` 수정, `.env` 편집, force push 자동 차단 |
| 5 | **MCP 상태 관리** | PRD, 워크플로 상태, 프로젝트 메모리를 세션 간 유지 |
| 6 | **자연어 트리거** | "build me a REST API" → 자동으로 오케스트레이션 시작 |
| 7 | **검증 우선** | 작성 ↔ 리뷰를 분리, 완료는 증거 기반으로만 인정 |

---

<!-- _class: invert -->

# 3. 아키텍처 개요

---

# 프로젝트 구조

```
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    ← 오케스트레이션 규칙 (루트)
│   ├── agents/                    ← 28개 에이전트 정의 (.agent.md)
│   ├── skills/                    ← 22개 스킬 루틴 (SKILL.md)
│   ├── hooks/                     ← pre/post tool-use 안전장치
│   └── prompts/                   ← quick-fix, quick-plan 템플릿
├── mcp-server/                    ← TypeScript MCP 서버
│   └── src/
│       ├── state-tools.ts         ← 워크플로 상태 관리
│       ├── prd-tools.ts           ← PRD/스토리 추적
│       ├── workflow-tools.ts      ← 단계 전환, 완료 검증
│       ├── memory-tools.ts        ← 프로젝트 메모리
│       └── model-router.ts        ← 복잡도 기반 모델 라우팅
├── .vscode/mcp.json               ← MCP 서버 등록
└── .omg/                          ← 런타임 상태 (gitignored)
```

---

# 동작 원리

```
사용자 입력: "build me a REST API for tasks"
         │
         ▼
┌─────────────────────────────────┐
│  copilot-instructions.md        │  ← 키워드 "build me" 감지
│  → omg-autopilot 스킬 로드      │
└─────────┬───────────────────────┘
          │
    ┌─────┼──────────────────────────────┐
    ▼     ▼              ▼               ▼
 @planner  @executor  @code-reviewer  @verifier
  계획      구현        리뷰            검증
    │        │            │              │
    └────────┴────────────┴──────────────┘
                    │
                    ▼
            MCP Server (.omg/)
         상태·PRD·메모리 저장
```

---

<!-- _class: invert -->

# 4. 28개 전문 에이전트

---

# 코어 에이전트 (20개)

<div class="columns">
<div class="col">

### 🔧 실행 그룹
| 에이전트 | 역할 |
|---------|------|
| @omg-coordinator | 메인 오케스트레이터 |
| @executor | 코드 구현 |
| @debugger | 원인 분석·빌드 수정 |
| @designer | UI/UX 설계·구현 |
| @git-master | 커밋·리베이스 |
| @code-simplifier | 코드 단순화 |
| @test-engineer | 테스트 전략·TDD |
| @qa-tester | CLI/E2E 테스트 |
| @writer | 문서 작성 |
| @tracer | 인과 추적 |

</div>
<div class="col">

### 🔍 분석 그룹 (Read-Only)
| 에이전트 | 역할 |
|---------|------|
| @architect | 아키텍처 분석 |
| @planner | 전략 계획 수립 |
| @analyst | 요구사항 분석 |
| @verifier | 증거 기반 검증 |
| @code-reviewer | 코드 리뷰 |
| @security-reviewer | OWASP 보안 점검 |
| @critic | 계획/코드 게이트 |
| @scientist | 데이터 분석 |
| @explore | 코드베이스 탐색 |
| @document-specialist | 외부 문서 조사 |

</div>
</div>

---

# 언어 리뷰어 에이전트 — Tier 2 (8개)

`@mention`으로 언어별 전문 코드 리뷰를 요청

| 에이전트 | 언어 | 핵심 체크 포인트 |
|---------|------|----------------|
| @typescript-reviewer | TypeScript | strict 모드, no-any, 타입 안전성, exhaustive 체크 |
| @python-reviewer | Python | PEP 8, 타입 힌트, 관용적 패턴 |
| @rust-reviewer | Rust | 소유권, 빌림 검사기, unsafe 정당화 |
| @go-reviewer | Go | 관용적 Go, 고루틴 안전성, 오류 처리 |
| @java-reviewer | Java | SOLID, Spring 패턴, null 안전성 |
| @csharp-reviewer | C# | nullable 분석, async/await, C# 관용구 |
| @swift-reviewer | Swift | Swift 동시성, 메모리 안전성, SwiftUI |
| @database-reviewer | SQL/ORM | 쿼리 성능, 파라미터화, 스키마 설계 |

> 역할이 분리된 에이전트가 각자의 전문성으로 리뷰 → **품질 ↑, 실수 ↓**

---

<!-- _class: invert -->

# 5. 22개 재사용 스킬

---

# 워크플로 스킬 (7개)

자연어 키워드 또는 `/명령어`로 즉시 활성화

| 스킬 | 설명 | 트리거 |
|------|------|--------|
| `/omg-autopilot` | 아이디어 → 동작하는 코드까지 자율 실행 | `build me`, `create me` |
| `/ralph` | PRD 기반 끈질긴 실행, 검증까지 멈추지 않음 | `ralph`, `finish this` |
| `/ultrawork` | 고처리량 병렬 실행 엔진 | `ultrawork`, `parallel` |
| `/team` | 여러 에이전트를 단계적으로 조율 | `team`, `swarm` |
| `/plan` | 인터뷰 기반 구조화된 계획 수립 | `plan this` |
| `/ralplan` | Planner + Architect + Critic 합의 기반 플래닝 | `consensus plan` |
| `/ccg` | Claude + Codex + Gemini 3관점 분석 | `ccg`, `tri-model` |

---

# 분석·품질·유틸리티 스킬 (15개)

<div class="columns">
<div class="col">

### 분석 & 품질
| 스킬 | 설명 |
|------|------|
| `/deep-interview` | 소크라테스식 요구사항 인터뷰 |
| `/deep-dive` | trace → deep-interview 2단계 |
| `/trace` | 증거 기반 원인 추적 |
| `/verify` | 완료 증거 검증 |
| `/review` | 심각도 기반 코드 리뷰 |
| `/ultraqa` | 테스트-수정 반복 루프 |
| `/ai-slop-cleaner` | AI 코드 냄새 정리 |
| `/self-improve` | 자율 진화 코드 개선 |

</div>
<div class="col">

### 품질 & 유틸리티
| 스킬 | 설명 |
|------|------|
| `/tdd` | 레드-그린-리팩터 강제 |
| `/security-scan` | 시크릿·CVE 빠른 스캔 |
| `/coding-standards` | 언어 공통 코딩 표준 |
| `/skill-stocktake` | 스킬 품질 감사 |
| `/remember` | 프로젝트 메모리 저장 |
| `/cancel` | 활성 모드 중단 |
| `/status` | 현재 상태 표시 |

</div>
</div>

---

<!-- _class: invert -->

# 6. 핵심 워크플로

---

# omg-autopilot — 자율 실행

> "build me a REST API" → OMG가 **전 과정을 자동 수행**

```
Phase 1: SPEC          사용자 입력 → 요구사항 정리
    ↓
Phase 2: PLAN          @planner가 작업 계획 수립
    ↓
Phase 3: EXECUTE       @executor가 코드 구현
    ↓
Phase 4: VALIDATE      @verifier가 테스트·검증
    ↓
Phase 5: COMPLETE      모든 기준 통과 확인 후 완료
```

- 단계마다 MCP에 상태 저장 → 중단 후 재개 가능
- `@critic`의 22% 거부율로 설계 결함을 코딩 전에 포착

---

# ralph — 끝까지 밀어붙이기

> "don't stop until it works" — PRD 기반 끈질긴 실행 루프

```
┌──────────────────────────────────────┐
│  PRD 생성 → 스토리 분해               │
│       ↓                              │
│  스토리 실행 → 테스트 → 검증           │
│       ↓              ↑               │
│  실패 시 ──────────────┘ (재시도)      │
│       ↓                              │
│  모든 스토리 PASS → 완료              │
└──────────────────────────────────────┘
```

- 각 스토리에 acceptance criteria 부여
- 완료 주장은 `omg_verify_story`로 증거 기반 검증

---

# ultrawork — 병렬 실행 엔진

> 독립적인 작업을 **동시에** 처리하여 처리량 극대화

```
입력: 5개 독립 작업
         │
    ┌────┼────┬────┬────┐
    ▼    ▼    ▼    ▼    ▼
  Task1 Task2 Task3 Task4 Task5
    │    │    │    │    │
    └────┴────┴────┴────┘
         │
    완료 취합 & 검증
```

- 복잡도 기반 Tiered 라우팅 (단순 → 직접, 복잡 → 에이전트 위임)
- 2개 이상 독립 작업 시 자동 병렬 실행

---

<!-- _class: invert -->

# 7. MCP 서버 & 상태 관리

---

# MCP 서버 — 15개 도구

| 도구 그룹 | 도구 | 목적 |
|-----------|------|------|
| **State** | `omg_read_state` `omg_write_state` `omg_clear_state` `omg_list_active` | 워크플로 CRUD |
| **PRD** | `omg_create_prd` `omg_read_prd` `omg_update_story` `omg_verify_story` | PRD·스토리 관리 |
| **Workflow** | `omg_check_completion` `omg_next_phase` `omg_get_phase_info` | 단계 전환·완료 검증 |
| **Memory** | `omg_read_memory` `omg_write_memory` `omg_search_memory` `omg_delete_memory` | 프로젝트 지식 저장 |
| **Context** | `omg_checkpoint` `omg_restore_checkpoint` `omg_context_status` | 세션 체크포인트 |
| **Router** | `omg_select_model` | 복잡도 기반 모델 추천 |

---

# 상태 저장 구조

```
.omg/                          ← gitignored, 런타임 전용
├── state/
│   ├── omg-autopilot.json     ← autopilot 현재 phase
│   ├── ralph.json             ← ralph 루프 상태
│   └── session-checkpoint.json ← 컨텍스트 체크포인트
├── plans/
│   └── work-plan.json         ← 실행 계획
├── prd.json                   ← 제품 요구사항 문서
└── project-memory.json        ← 프로젝트 메모리
```

- 세션이 끊겨도 상태 유지 → **작업 연속성 보장**
- 컨텍스트 압축 대비 체크포인트 자동 생성 (400KB 임계값)

---

<!-- _class: invert -->

# 8. 안전장치 (Tool Guardrails)

---

# Pre/Post Tool-Use 훅

<div class="columns">
<div class="col">

### 🛡️ Pre-Tool-Use (차단)
| 가드 | 차단 대상 |
|------|----------|
| node_modules 보호 | `node_modules/` 수정 |
| .env 보호 | `.env` 직접 편집 |
| 설정 파일 보호 | `package.json` 등 삭제 |
| force push 방지 | `git push --force` |
| hard reset 방지 | `git reset --hard` |
| 경로 순회 차단 | `../` 메타문자 |

</div>
<div class="col">

### 📊 Post-Tool-Use (추적)
| 기능 | 역할 |
|------|------|
| 디버그 로깅 | `OMG_DEBUG=1` 시 도구 로그 |
| 파일 수정 추적 | autopilot phase 인식 |
| 테스트 결과 추적 | ultraqa 감지 |
| 컨텍스트 압력 | 누적 I/O 바이트 추적 |
| 체크포인트 권고 | 400KB 초과 시 자동 권고 |

</div>
</div>

> 개발자가 안심하고 에이전트에게 권한을 위임할 수 있는 구조

---

<!-- _class: invert -->

# 9. 벤치마크 & 품질 지표

---

# 프로젝트 스냅샷

| 지표 | 값 |
|------|----|
| 전체 코드베이스 | **28,907줄** |
| 개발 기간 | **6일** (2026. 4. 6–11) |
| 총 커밋 | 23회 |
| 에이전트 | 28개 (코어 20 + 언어 리뷰어 8) |
| 스킬 | 22개 |
| MCP 도구 | 15개 |

### 품질 개선 효과

| 지표 | v1.0 (초기) | v1.1.x (OMG 파이프라인) |
|------|:-----------:|:----------------------:|
| 테스트 통과율 | N/A | **18/18 (100%)** |
| TypeScript 오류 | 미검사 | **0개** |
| 알려진 CVE | 7개 | **0개** |
| 안전 가드 | 0개 | **6개 pre + 8개 post** |

---

# RALPLAN 합의 계획 결과

```
총 9건의 설계 결정 검토
  ├── 7건 통과
  └── 2건 @critic이 거부 (22% 거부율)

→ 코드를 쓰기 전에 22%의 설계 결함을 포착
```

### 보안 스캔 결과

| 카테고리 | 발견 | 수정 |
|---------|:----:|:----:|
| 하드코딩된 시크릿 | 0 | — |
| 프로덕션 CVE | 2 (moderate) | ✅ |
| 개발 CVE | 5 (moderate) | ✅ |
| 쉘 인젝션 (hook) | 1 | ✅ |
| `.env` gitignore 누락 | 1 | ✅ |
| **수정 후 취약점** | | **0** |

---

<!-- _class: invert -->

# 10. 설치 및 시작 방법

---

# 설치 — 2가지 방법

### 방법 A: VS Code Extension (권장)

```bash
code --install-extension oh-my-githubcopilot-1.1.9.vsix
# → Cmd+Shift+P → "OMG: Initialize Workspace" (필수!)
# → Reload Window
```

### 방법 B: 수동 클론

```bash
git clone https://github.com/jmstar85/oh-my-githubcopilot.git
cd oh-my-githubcopilot
cd mcp-server && npm install && npm run build && cd ..
# → VS Code에서 열기
```

### 다른 프로젝트에 적용

```bash
scripts/omg-adopt.sh --target ~/work/my-app --mode template
# 또는 --mode submodule / --mode subtree
```

---

<!-- _class: invert -->

# 11. 활용 시나리오

---

# 이렇게 사용하세요

### 🚀 신규 개발
```
omg-autopilot: build a REST API for managing tasks
```
→ SPEC → PLAN → EXECUTE → VALIDATE → COMPLETE 자동 수행

### 🤔 요구사항이 모호할 때
```
deep-interview "I want to build a task management app"
```
→ 소크라테스식 질문으로 숨은 가정과 요구사항 발굴

### 🔍 코드 리뷰
```
review this
```
→ 심각도별 코드 리뷰 + 8개 언어 전문 리뷰어 지원

### 🐛 디버깅
```
trace this error: TypeError: Cannot read property 'id' of undefined
```
→ 가설 경쟁 기반 증거 추적

---

<!-- _class: lead -->

# 12. 요약

**oh-my-githubcopilot (OMG)** 는
GitHub Copilot을 **멀티 에이전트 오케스트레이션 플랫폼**으로 확장합니다.

| | |
|---|---|
| **28 Agents** | 역할·권한 분리된 전문가 팀 |
| **22 Skills** | 자연어로 트리거되는 워크플로 |
| **MCP Server** | 세션 간 상태·메모리 유지 |
| **Guardrails** | 안전한 자동화를 위한 훅 시스템 |

> *"Just say what you want. OMG handles the rest."*

**GitHub**: `github.com/jmstar85/oh-my-githubcopilot`

---

<!-- _class: lead -->

# Thank You

### Questions?

**GitHub** github.com/jmstar85/oh-my-githubcopilot
**License** MIT
