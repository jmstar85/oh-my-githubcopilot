---
name: self-improve
description: >
  Autonomous evolutionary code improvement engine with tournament selection.
  Activate when user says: self-improve, self improve, evolve code,
  improve iteratively, tournament, benchmark loop, optimize code.
argument-hint: "[repo path] [--resume]"
---

# Self-Improvement Orchestrator

Autonomous loop controller for evolutionary code improvement. Manages the full lifecycle: setup, research, planning, execution, tournament selection, history recording, and stop-condition evaluation.

## When to Use
- You want to iteratively improve a codebase toward a measurable benchmark goal
- Optimization tasks: performance, bundle size, test coverage, accuracy
- Code quality improvement with measurable metrics

## When NOT to Use
- No measurable benchmark available
- One-shot fix or feature request → use `/omg-autopilot`
- Manual, interactive coding → use `/ralph`

## Autonomous Execution Policy

**NEVER stop or pause to ask the user during the improvement loop.** Once the gate check passes and the loop begins, run fully autonomously until a stop condition is met.

- Do not ask for confirmation between iterations
- On agent failure: retry once, then skip and continue
- On all plans rejected: log it, continue to next iteration
- The only things that stop the loop are the stop conditions in Step 11

## State Tracking

All state lives under `.omg/self-improve/`:

```
.omg/self-improve/
├── config/
│   ├── settings.json          # agents, benchmark, thresholds, sealed_files
│   ├── goal.md                # Improvement objective + target metric
│   ├── harness.md             # Guardrail rules (H001/H002/H003)
│   └── idea.md                # User experiment ideas
├── state/
│   ├── agent-settings.json    # iterations, best_score, status, counters
│   ├── iteration_state.json   # Within-iteration progress (resumability)
│   ├── research_briefs/       # Research output per round
│   ├── iteration_history/     # Full history per round
│   ├── merge_reports/         # Tournament results
│   └── plan_archive/          # Archived plans (permanent)
├── plans/                     # Active plans (current round)
└── tracking/
    ├── raw_data.json          # All candidate scores
    ├── baseline.json          # Initial benchmark score
    └── events.json            # Config changes
```

## Agent Mapping

| Step | Role | Agent | Purpose |
|------|------|-------|---------|
| Research | Codebase analysis | @explore + @architect | Hypothesis generation |
| Planning | Hypothesis → plan | @planner | Structured plan per agent |
| Architecture Review | 6-point review | @architect | Advisory review |
| Critic Review | Harness enforcement | @critic | Approve/reject plans |
| Execution | Implement + benchmark | @executor | Implement plan faithfully |
| Git Operations | Merge/tag/PR | @git-master | Atomic merge operations |

## Setup Phase

### Interactive Hook Protocol (Setup Only)

**MANDATORY**: Use `vscode_askQuestions` for all user decisions during setup (when available).
If `vscode_askQuestions` is NOT available (e.g., Copilot CLI), present numbered options in markdown and ask the user to respond with a number or freeform text.
Once the improvement loop begins (after gate passes), run fully autonomously — no hooks.

### When to Fire Hooks
| Trigger Point | Question Type |
|---------------|---------------|
| Step 1: Repo path | Confirm or select target repo |
| Step 4: Trust confirmation | Confirm benchmark execution consent |
| Step 5: Goal interview | Socratic goal-setting questions (Objective, Metric, Target, Scope) |
| Step 7: Harness rules | Confirm/customize harness rules |

1. Check if target repo path exists. If not configured:
   **HOOK**: Ask user for target repo path via `vscode_askQuestions`:
   ```
   header: "self-improve-target"
   question: "Which repository should be improved?"
   options: [
     { label: "[current workspace path]", recommended: true },
     { label: "Other — I'll specify the path" }
   ]
   allowFreeformInput: true
   ```
2. Create `.omg/self-improve/` directory structure.
3. Read `agent-settings.json`. Check setup flags.
4. **HOOK: Trust confirmation** (mandatory) via `vscode_askQuestions`:
   ```
   header: "self-improve-trust"
   question: "Self-improve will run benchmarks and modify code in [repo path]. This includes running tests, builds, and git operations. Confirm?"
   options: [
     { label: "Yes, I trust this — proceed", recommended: true },
     { label: "No, abort" }
   ]
   allowFreeformInput: false
   ```
   - If declined: abort immediately.
   - Record consent: `trust_confirmed: true`
5. If goal not set → **HOOK: Socratic goal interview** via sequential `vscode_askQuestions`:
   - Q1: Objective ("What do you want to improve?") with options: performance, test coverage, bundle size, code quality, accuracy, other
   - Q2: Metric ("How should we measure it?") with context-derived options
   - Q3: Target ("What's the target value?") with freeform
   - Q4: Scope ("Which files/modules are in scope?") with codebase-derived options
   - Write to `goal.md`.
6. If benchmark not set → Survey repo, create/wrap benchmark, validate 3x, record baseline.
7. If harness not set → **HOOK: Confirm harness rules** via `vscode_askQuestions`:
   ```
   header: "self-improve-harness"
   question: "Default harness rules: H001 (no test deletion), H002 (no benchmark tampering), H003 (sealed files untouched). Accept?"
   options: [
     { label: "Accept defaults", recommended: true },
     { label: "Customize rules" },
     { label: "Add sealed files" }
   ]
   ```
8. **Gate**: All settings + trust must be true.
9. Create improvement branch: `improve/{goal_slug}` from target branch.
10. Write initial state via `omg_write_state`.

## Improvement Loop

**Gate**: All settings must be true. Execute continuously without stopping.

### Step 0 — Stale Worktree Cleanup
Remove orphaned worktrees from prior iterations.

### Step 1 — Refresh State
Update state to reset TTL.

### Step 2 — Check Stop Request
If state is cleared or status is `user_stopped`: exit gracefully.

### Step 3 — Check User Ideas
Read `idea.md`. If non-empty, pass to planners.

### Step 4 — Research
Spawn @explore + @architect to analyze codebase and generate hypotheses based on goal, history, and prior briefs.

### Step 5 — Plan
Spawn N @planner agents in parallel (N = `number_of_agents`). Each produces a plan with one testable hypothesis, approach_family tag, and history_reference.

### Step 6 — Review
For each plan:
- **6a. Architecture Review**: @architect with 6-point checklist (testability, novelty, scope, target files, implementation clarity, expected outcome). Advisory only.
- **6b. Critic Review**: @critic with harness rules (H001: one hypothesis, H002: no approach_family streak ≥3, H003: intra-round diversity). Sets `critic_approved: true/false`.

### Step 7 — Execute
For each approved plan, spawn @executor in parallel. Each executor works in a git worktree, implements the plan, runs validation, and benchmarks.

### Step 8 — Tournament Selection
1. Collect results, filter to `status: "success"`
2. Rank by `benchmark_score` (respecting direction)
3. For each candidate (best first):
   - No-regression check vs `best_score`
   - Merge via @git-master with `--no-ff`
   - Re-benchmark on merged state
   - If confirmed: accept winner, break
   - If regression: revert merge, try next
   - If conflict: abort merge, try next
4. Archive non-winner branches

### Step 9 — Record & Visualize
Write iteration history, update agent-settings (scores, plateau count, circuit breaker), append tracking data.

### Step 10 — Cleanup
Remove worktrees, update iteration state to `completed`.

### Step 11 — Stop Condition Check

| Condition | Check |
|-----------|-------|
| User stop | `status == "user_stopped"` |
| Target reached | `best_score` meets/exceeds `target_value` |
| Plateau | `plateau_consecutive_count >= plateau_window` |
| Max iterations | `iterations >= max_iterations` |
| Circuit breaker | `circuit_breaker_count >= circuit_breaker_threshold` |

If NO stop condition: immediately go back to Step 1.

## Resumability

On invocation:
1. Always run Step 0 (stale worktree cleanup)
2. Check `agent-settings.json`:
   - `user_stopped`: ask to resume
   - `running`: crashed — resume automatically
   - `idle`: fresh start
3. Check `iteration_state.json`: resume from last step if in-progress

## Completion

1. Update final status
2. Print summary (status, iterations, best score, baseline, improvement %)
3. Run `/cancel` for clean state cleanup

## Approach Family Taxonomy

Every plan must be tagged with exactly one:

| Tag | Description |
|-----|-------------|
| `architecture` | Model/component structure changes |
| `training_config` | Optimizer, LR, scheduler, batch size |
| `data` | Data loading, augmentation, preprocessing |
| `infrastructure` | Mixed precision, distributed training |
| `optimization` | Algorithmic/numerical optimizations |
| `testing` | Evaluation methodology changes |
| `documentation` | Documentation-only changes |
| `other` | Does not fit above |
