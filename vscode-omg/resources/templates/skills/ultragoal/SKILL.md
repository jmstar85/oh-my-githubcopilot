---
name: ultragoal
description: >
  Durable multi-goal workflow with MCP-backed goal status, checkpoints, and completion evidence.
  Activate when: ultragoal, goal loop, durable goal, persistent goal, keep goal.
argument-hint: "<durable goal objective>"
---

# Ultragoal

> **OMG adapted scope:** OMG does not use Claude Code goal commands or hidden dynamic prompt injection. Durable goal context is carried through MCP tools and the visible task plan.

## Workflow
1. Create or inspect the active goal with `omg_read scope:"ultragoal"` (returns the active goal and handoff text).
2. If no active goal exists, create one with `omg_write scope:"ultragoal" op:"set" value:{objective}` using a concrete objective.
3. Keep the active goal reflected in the chat/task TODO state.
4. After each meaningful milestone, call `omg_write scope:"ultragoal" op:"advance" key:<goal-id> value:{evidence, note?}` with concrete evidence.
5. Before stopping, call `omg_read scope:"ultragoal"` and verify the active goal state.
6. Complete the goal only with `omg_verify target:"ultragoal" id:<goal-id> evidence:[{command, output_excerpt, passed:true}]` — rejected unless every evidence item passed.

## Fail-Closed Rules
- Missing objective, invalid goal id, malformed ledger, or missing evidence must not write artifacts.
- Use `.omg/ultragoal/` artifacts only.
- Do not use OMC-only runtime assumptions as execution requirements.

## Output
- Active goal id and objective
- Handoff text
- Checkpoint evidence
- Remaining work or completion evidence
