---
name: omg-autopilot
description: >
  Full autonomous execution from idea to working code.
  Activate when user says: autopilot, auto-pilot, autonomous,
  build me, create me, make me, full auto, handle it all,
  or "I want a/an..."
argument-hint: "<product idea or task description>"
---

# OMG Autopilot

OMG Autopilot takes a brief product idea and autonomously handles the full lifecycle: requirements analysis, technical design, planning, parallel implementation, QA cycling, and multi-perspective validation.

## When to Use
- User wants end-to-end autonomous execution from an idea to working code
- Task requires multiple phases: planning, coding, testing, and validation
- User wants hands-off execution

## When NOT to Use
- User wants to explore options → use `/plan`
- Single focused code change → use `/ralph` or delegate to @executor
- Quick fix or small bug → delegate directly to @executor

## Interactive Hook Protocol

Use `vscode_askQuestions` at critical decision gates during autopilot execution (when available).
If `vscode_askQuestions` is NOT available (e.g., Copilot CLI), present numbered options in markdown.
Autopilot is designed to be mostly autonomous, but hooks fire at ambiguity points and failure recovery.

### When to Fire Hooks
| Trigger Point | Question Type |
|---------------|---------------|
| Phase 0: Vague input | Redirect to deep-interview or proceed with assumptions |
| Phase 0: Spec review | Confirm extracted spec before planning |
| Phase 3: Repeated QA failure | Ask user for direction on persistent errors |
| Phase 4: Validation rejection | Surface reviewer concerns for user decision |

## Execution Pipeline

### Phase 0 - Expansion
Turn the user's idea into a detailed spec.
- If ralplan consensus plan exists (`.omg/plans/ralplan-*.md`): Skip Phase 0 AND Phase 1 → jump to Phase 2
- If deep-interview spec exists (`.omg/specs/deep-interview-*.md`): Use pre-validated spec, skip to Phase 1
- If input is vague: **HOOK** via `vscode_askQuestions`:
  ```
  header: "autopilot-vague-input"
  question: "Your request is broad. How should I proceed?"
  options: [
    { label: "Run /deep-interview first", description: "Thorough requirements gathering", recommended: true },
    { label: "Proceed with my best interpretation", description: "I'll extract requirements and show you for approval" },
    { label: "Let me clarify — here's more detail..." }
  ]
  allowFreeformInput: true
  ```
- Otherwise: @analyst extracts requirements, @architect creates technical specification
- **HOOK: Spec confirmation** before proceeding to planning:
  ```
  header: "autopilot-spec-review"
  question: "Here's what I understood: [1-line summary]. Proceed?"
  options: [
    { label: "Looks good — proceed", recommended: true },
    { label: "Mostly right, but adjust..." },
    { label: "Wrong direction — let me re-explain" }
  ]
  allowFreeformInput: true
  ```
- Output: `.omg/autopilot/spec.md`
- Track phase: `omg_write_state(phase="expansion_done")`

### Phase 1 - Planning
Create an implementation plan from the spec.
- @architect creates plan (direct mode)
- @critic validates plan
- Output: `.omg/plans/autopilot-impl.md`
- Track: `omg_write_state(phase="planning_done")`

### Phase 2 - Execution
Implement the plan using parallel execution.
- Route tasks by complexity to @executor
- Run independent tasks in parallel
- Track: `omg_write_state(phase="execution_done")`

### Phase 3 - QA
Cycle until all tests pass (max 5 cycles).
- Build, lint, test, fix failures
- Stop early if the same error repeats 3 times (fundamental issue)
- **HOOK: On 2nd repeat of same failure** via `vscode_askQuestions`:
  ```
  header: "autopilot-qa-stuck"
  question: "Same error persists after [N] cycles: [error summary]. How to proceed?"
  options: [
    { label: "Try a different approach", recommended: true },
    { label: "Skip this check — it's acceptable" },
    { label: "I know the fix — let me explain..." },
    { label: "Abort autopilot" }
  ]
  allowFreeformInput: true
  ```
- Track: `omg_write_state(phase="qa_done")`

### Phase 4 - Validation
Multi-perspective review in parallel.
- @architect: Functional completeness
- @security-reviewer: Vulnerability check
- @code-reviewer: Quality review
- All must approve; on rejection:
  **HOOK** via `vscode_askQuestions`:
  ```
  header: "autopilot-validation-rejection"
  question: "[Reviewer] flagged: [issue summary]. Action?"
  options: [
    { label: "Fix the issues", recommended: true },
    { label: "Accept risk — proceed anyway" },
    { label: "I need to review this myself first" }
  ]
  allowFreeformInput: true
  ```
- Fix and re-validate on rejection
- Track: `omg_write_state(phase="validation_done")`

### Phase 5 - Cleanup
Delete all state files on successful completion.
- Run `/cancel` for clean exit

## Stop Conditions
- Same QA error persists across 3 cycles → report fundamental issue
- Validation keeps failing after 3 rounds → report issues
- User says "stop", "cancel", or "abort"

## Checklist
- [ ] All 5 phases completed
- [ ] All validators approved in Phase 4
- [ ] Tests pass (verified with fresh output)
- [ ] Build succeeds
- [ ] State files cleaned up
