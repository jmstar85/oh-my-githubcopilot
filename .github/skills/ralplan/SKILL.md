---
name: ralplan
description: >
  Consensus planning with Planner/Architect/Critic iterative loop.
  Activate when user says: ralplan, consensus plan, consensus planning.
argument-hint: "[--deliberate] <task description>"
---

# Ralplan (Consensus Planning)

Shorthand for `/plan --consensus`. Triggers iterative planning with Planner, Architect, and Critic agents until consensus is reached.

## Flags
- `--deliberate`: Forces deliberate mode for high-risk work. Adds pre-mortem (3 scenarios) and expanded test planning.

## Interactive Hook Protocol

**MANDATORY**: Use `vscode_askQuestions` at every decision gate in this skill (when available).
If `vscode_askQuestions` is NOT available (e.g., Copilot CLI), present numbered options in markdown and ask the user to respond with a number or freeform text.

### When to Fire Hooks
| Trigger Point | Question Type |
|---------------|---------------|
| Options presentation | Present viable options with pros/cons for user selection |
| Architect concerns | Surface architectural trade-offs for user decision |
| Critic rejection | Show rejection reasons, ask user for direction |
| Consensus reached | Final plan approval before execution |
| `--deliberate` pre-mortem | Present risk scenarios for user prioritization |

## Workflow
1. **@planner** creates initial plan with RALPLAN-DR summary:
   - Principles (3-5)
   - Decision Drivers (top 3)
   - Viable Options (>=2) with pros/cons
2. **HOOK: Present options** via `vscode_askQuestions` when options have significant trade-offs:
   ```
   header: "ralplan-options"
   question: "Planner identified [N] viable approaches. Select preferred direction:"
   options: [
     { label: "Option A: [name]", description: "Pros: X, Y. Cons: Z" },
     { label: "Option B: [name]", description: "Pros: A, B. Cons: C" },
     { label: "Let agents decide based on technical merit", recommended: true }
   ]
   allowFreeformInput: true
   ```
3. **@architect** reviews for architectural soundness
   - If architect raises concerns: **HOOK** — present trade-offs for user decision
4. **@critic** validates quality and testability
   - If critic rejects: **HOOK** — show issues and ask for direction:
   ```
   header: "ralplan-critic-feedback"
   question: "Critic identified [N] issues: [summary]. How to proceed?"
   options: [
     { label: "Address all issues", recommended: true },
     { label: "Address critical issues only, skip minor" },
     { label: "Override — I accept the trade-offs" },
     { label: "Restart with different constraints" }
   ]
   ```
5. **Loop** until critic approves (max 5 iterations)
6. Final plan includes ADR (Decision, Drivers, Alternatives, Why chosen, Consequences)
7. **HOOK: Final approval** via `vscode_askQuestions`:
   ```
   header: "ralplan-approval"
   question: "Consensus reached after [N] iterations. Execute?"
   options: [
     { label: "Execute with team (parallel)", recommended: true },
     { label: "Execute with ralph (sequential + verification)" },
     { label: "Execute with omg-autopilot (full pipeline)" },
     { label: "Save plan — don't execute yet" }
   ]
   ```

### Deliberate Mode Hooks
When `--deliberate` is active, add:
- **HOOK: Pre-mortem scenarios** — present 3 risk scenarios, ask user to rank priority
- **HOOK: Test strategy** — present expanded test plan for user approval

## Pre-Execution Gate
Vague execution requests (e.g., "ralph improve the app") are redirected through ralplan first to ensure explicit scope, testable criteria, and multi-agent consensus.

**Passes gate** (specific enough): prompts with file paths, function names, issue numbers, numbered steps, or acceptance criteria.

**Gated** (needs scoping): prompts with only vague descriptions and no concrete anchors.

## After Approval
- Execute via `/team` (parallel agents, recommended) or `/ralph` (sequential with verification)
