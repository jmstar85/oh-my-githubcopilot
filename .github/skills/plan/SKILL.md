---
name: plan
description: >
  Strategic planning with optional interview workflow.
  Activate when user says: plan this, plan the, let's plan,
  make a plan, how should we approach.
argument-hint: "[--direct|--consensus|--review] <task description>"
---

# Plan

Creates comprehensive, actionable work plans through intelligent interaction. Auto-detects whether to interview (broad requests) or plan directly (detailed requests).

## Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| Interview | Default for broad requests | Interactive requirements gathering |
| Direct | `--direct`, or detailed request | Skip interview, generate plan directly |
| Consensus | `--consensus`, "ralplan" | Planner → Architect → Critic loop |
| Review | `--review` | Critic evaluation of existing plan |

## Interactive Hook Protocol

**MANDATORY**: Use `vscode_askQuestions` for ALL user-facing decision points in this skill (when available).
If `vscode_askQuestions` is NOT available (e.g., Copilot CLI), present numbered options in markdown and ask the user to respond with a number or freeform text.

### When to Fire Hooks
| Trigger Point | Question Type |
|---------------|---------------|
| Interview mode: each question round | Scope/preference/constraint question with options |
| Interview mode: readiness check | "Ready to generate plan?" gate |
| Consensus mode: plan trade-offs | Present design options with pros/cons |
| Consensus mode: critic rejection | Show rejection reasons, ask for direction |
| All modes: plan approval | Final plan review before execution |

## Interview Mode (broad/vague requests)
1. Classify request: broad triggers interview
2. **HOOK: Ask ONE focused question via `vscode_askQuestions`** for preferences, scope, constraints
   - Provide 3-5 contextual options derived from codebase analysis
   - Always include freeform input (`allowFreeformInput: true`)
3. Gather codebase facts via @explore BEFORE asking user
4. Consult @analyst for hidden requirements
5. **HOOK: Readiness gate** — ask user if ready to generate plan:
   ```
   header: "plan-readiness"
   question: "I've gathered enough context. Ready to generate the plan?"
   options: [
     { label: "Yes, generate the plan", recommended: true },
     { label: "I have more requirements to add" },
     { label: "Show me what you've gathered so far" }
   ]
   ```
6. Create plan when user signals readiness

## Direct Mode (detailed requests)
1. Optional brief @analyst consultation
2. Generate comprehensive work plan immediately

## Consensus Mode (`--consensus` / "ralplan")
1. @planner creates initial plan with RALPLAN-DR summary (Principles, Decision Drivers, Options)
2. **HOOK: Present design trade-offs** when viable options have significant trade-offs:
   ```
   header: "design-trade-off"
   question: "The planner identified competing approaches. Which direction?"
   options: [derived from RALPLAN-DR viable options with pros/cons in descriptions]
   ```
3. @architect reviews for architectural soundness (sequential, NOT parallel with critic)
4. @critic evaluates quality criteria (after architect completes)
5. If critic rejects: **HOOK** — show rejection reasons, ask user for direction:
   ```
   header: "critic-rejection"
   question: "Critic flagged issues: [summary]. How to proceed?"
   options: [
     { label: "Address all issues", recommended: true },
     { label: "Address critical issues only" },
     { label: "Override — accept plan as-is" },
     { label: "Start over with different approach" }
   ]
   ```
6. Re-review loop (max 5 iterations)
7. Final plan includes ADR (Decision, Drivers, Alternatives, Why chosen, Consequences)

## Review Mode (`--review`)
1. Read plan from `.omg/plans/`
2. @critic evaluates
3. Return verdict: APPROVED / REVISE / REJECT

## Plan Approval Hook (all modes)
**HOOK**: After plan generation, present plan summary for user approval:
```
header: "plan-approval"
question: "[N] tasks identified. Review the plan and choose next step:"
options: [
  { label: "Approve & execute with autopilot", recommended: true },
  { label: "Approve & execute with ralph" },
  { label: "Approve & execute with team" },
  { label: "Revise — I have feedback" },
  { label: "Save plan only — don't execute yet" }
]
```

## Output
Plans saved to `.omg/plans/`. Include:
- Requirements Summary
- Testable Acceptance Criteria
- Implementation Steps (with file references)
- Risks and Mitigations
- Verification Steps
