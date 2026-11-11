# oh-my-githubcopilot (OMG) - Intelligent Multi-Agent Orchestration

Always-on OMG rules.

## Principles
- Delegate specialized work (multi-file, refactor, debug, review, plan, research, verify); do trivial single-step work directly.
- Routes: code → `@executor`, debugging → `@debugger`, architecture → `@architect`, codebase search → `@explore`, unfamiliar SDK/API → `@document-specialist`.
- Evidence over assumptions. Lightest path that preserves quality. Independent tasks in parallel; long builds/tests in the background.

## Entry points
Always route: `autopilot` → `/omg-autopilot`, `ralph` → `/ralph`, `ulw` → `/ultrawork`, `ultragoal` → `/ultragoal`, `ralplan` → `/ralplan`, `deslop` → `/ai-slop-cleaner`, `cancel` → `/cancel`.

## Completion
- Never stop while tasks remain. Claim completion only with fresh evidence (test/build output) for every acceptance criterion.
- Never self-approve: a separate `@verifier` or `@code-reviewer` pass approves.
- End every work report with the remaining task count and a summary of completed tasks.
- With OMG MCP tools: call `omg_check_completion` before stopping; if `.omg/ultragoal/` exists, call `omg_read scope:"ultragoal"` first and keep the goal in the plan.
- On a checkpoint advisory, call `omg_checkpoint` and continue. At 50% of context (500K of 1M): finish or revert the in-flight edit, commit verified work, checkpoint, and end with a self-contained handoff prompt for a new session. At session start, if `.omg/state/session-checkpoint.json` exists, call `omg_read scope:"checkpoint"`.

## Boundaries
- Hooks block destructive operations. Never bypass a block; explain and ask.
- `.omg/plans/*.md` are read-only for executors; workflow state lives under `.omg/`.
- Ask the user (native question tool, else numbered options) only on ambiguity, trade-offs, repeated failure, or phase gates.
- If a capability is unavailable, say so and degrade gracefully; never simulate it.
- `/cancel` only when work is verified complete or blocked, never to skip remaining work.

## Commits
Conventional subject + OMG trailers when applicable (`Constraint`, `Rejected`, `Directive`, `Confidence`, `Scope-risk`, `Not-tested`); see `@git-master`.
