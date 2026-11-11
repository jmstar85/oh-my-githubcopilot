# ADR-0001: Re-platform OMG as Copilot plugins in this repository; ship a compatible context diet first

- Status: Accepted (2026-11-09; reviewed and amended the same day)
- Deciders: OMG maintainers
- Related: [v1.5 context diet design](../design/v1.5-context-diet.md) · [threat model (draft)](../security/threat-model.md) · [release assets plan](../design/release-assets.md)

## Context

OMG v1 is a customization layer for GitHub Copilot: `.github/{agents,skills,hooks,prompts}`, a TypeScript MCP server for workflow state, and a VSIX that scaffolds those files into a workspace. Three things changed since it was designed.

1. **The platform absorbed several v1 mechanisms.** As documented for Copilot at the time of this decision (2026-11), hooks cover the whole agent lifecycle (`preToolUse`, `postToolUse`, `agentStop`, `preCompact`, `sessionStart`, `subagentStart/Stop`, …), plugins and a marketplace exist as a distribution model, and subagents, skills, memory and todo are native. v1's prompt-only "never stop" rule, byte-counting context tracker, VSIX scaffolder and keyword catalog overlap with these.
2. **The context cost was measured, and it was large.** `evals/context-baseline.mjs` showed v1.4.4 injecting 8,738 tokens into every request before the user's task starts: instructions 41%, MCP tool definitions 30%, skill and agent descriptions 29%.
3. **Hygiene debt accumulated.** Release binaries committed to git, model names hard-coded in agent frontmatter, an OMC/Claude Code bridge few users can exercise, and no evaluation of prompt or skill behaviour.

What keeps its value regardless of platform is the prompt content (28 agents, 37 skills), the evidence-before-completion discipline, and the guardrail hooks, whose `hooks.json` format already matches the platform's.

## Options considered

| | A. Keep extending v1.x | B. New repository / project | C. Re-platform inside this repository as v2 |
|---|---|---|---|
| What | Add new patterns to the v1 structure | Start over under a new name | Rebuild on the plugin model on a `v2` line; `v1-maintenance` frozen |
| For | Fast, compatible | Clean design | Keeps prompts, community, issues, docs and search presence while replacing the structure; a migration path can be offered |
| Against | Debt stays; duplicated platform features and context cost persist | Rewrites 28 agents, resets the community, two projects to maintain; no reason to drop the name | Intentional major-version break; up-front refactoring |
| Verdict | Rejected | Rejected | **Chosen** |

## Decision

1. **Re-platform in this repository (option C).** `main` continues the v1 line; `v1-maintenance` marks the frozen v1.4.4 state. v2 is developed here and offered as an opt-in channel until it is validated on every supported surface.
2. **Reusing the repository does not mean rewrite-first.** Everything that can be delivered compatibly ships first as **v1.5** (the context diet). The v1 install path is not replaced before the v2 path is proven; success on one surface (the CLI) does not justify a claim about the others.
3. **The KPI is total OMG-attributable injected tokens**, not the size of the instructions file. Targets: v1.5 ≤ 4,000 (result: 3,994, −54% vs v1.4.4); v2 with only `omg-core` installed ≤ 2,000.
4. **Completion truth lives in an MCP task journal**, not in a hook. An `agentStop` hook only *consults* the journal to decide whether to block. Hook-based blocking is not treated as fail-closed (it can time out or be exhausted), so the journal records task id, the tested tree hash, verifier result and a terminal status, and a hook failure or exhausted budget leaves the task **unverified** rather than complete. Budgets (attempts, elapsed time, parallelism, spend) and stagnation detection are part of the design.
5. **The advisor is a subagent, not a hook.** The coordinator delegates to it explicitly at phase gates and receives an ordinary subagent result; hooks only validate output format afterwards. The advisor never reviews its own work, and an unavailable advisor is reported as "skipped".
6. **The OMC/Claude Code bridge is removed in 2.0** (`/resume-claude`, `/push-omc`, the bridge MCP tools). It is deprecated in 1.5.
7. **No legacy shim in v2.** v2 ships a one-time `omg migrate` (backup, dry-run, rollback, explicit errors for unsupported tools) instead of a compatibility plugin that pretends old tools still exist. The `OMG_LEGACY_TOOLS=1` adapters in 1.5 are a one-release grace period *within* v1 and are removed in 2.0.
8. **Cross-runtime compatibility is limited to shared content.** For other agent runtimes that read the same files (specifically [oh-my-pi](https://github.com/can1357/oh-my-pi)), OMG promises tool-neutral skills and instructions only. Agents and hooks stay native to each runtime; no converter is promised without an owner, pinned versions and conformance fixtures.
9. **Content OMG does not have the right to redistribute stays out of public branches and releases.** Enterprise-specific material derived from non-public sources is excluded until redistribution rights are confirmed. Skills derived from other open-source projects keep the upstream copyright notice and are recorded in a `PROVENANCE.md`.
10. **Live model evaluations are never a pull-request gate.** PR gates are deterministic: schema checks, migration tests, hook fixture replay, and the static activation and footprint checks in `evals/`. Live `copilot -p` probes run manually or on a schedule with a budget, and record model and client versions.
11. **Plugin boundaries follow lifecycle ownership.** `omg-core` (director, executor, explore, verifier, critic, planner, core skills, guardrail and checkpoint hooks, the task-journal MCP server) is the single owner of the stop decision and result normalization. `omg-reviewers` carries the language and security reviewers, the verdict schema and the advisor as an experimental feature. `omg-workflows` is optional. `omg-core` must work alone, and supported install combinations are tested.
12. **On the cloud agent, materialize only what plugins cannot deliver.** Plugin behaviour is verified per component first; generated files are version-pinned, hashed, drift-checked in CI, never overwrite user customization, and never double-register a hook that an installed plugin already provides.

## Phases

| Phase | Content | State |
|---|---|---|
| 0 — Baseline and freeze | `v1-maintenance`, footprint and activation baselines, this ADR, threat model draft, plan for moving binaries to Releases | Done except executing the binaries plan |
| 1a — v1.5 compatible diet | Instructions 3,594 → 549 tokens, MCP tools 27 → 6, legacy trigger phrases kept, footprint KPI published | Implemented on `feat/v1.5-context-diet` |
| 1b — v2 proof of concept (parallel) | Journal-based completion gate with a consulting `agentStop` hook, journal-based checkpoint recovery, plugin install on each surface, hook fixture replay harness | Not started |
| 2 — v2 core and reviewers | `omg-core`, `omg-reviewers`, `omg migrate`, threat model finalized | Not started |
| 3 — Ecosystem | `omg-workflows`, shared-content compatibility checks, four-surface smoke tests, 2.0.0 opt-in channel → GA | Not started |

## Consequences

Positive
- Every request is cheaper now (v1.5), independent of the v2 schedule.
- Enforcement moves from prompt rules toward code (journal, hooks) where the platform supports it, with explicit behaviour when it does not.
- Users install only the plugins they need; the footprint scales with what is installed.

Negative
- 2.0 is a deliberate breaking change: tool names, state layout and the install path change, and the bridge disappears. A migration command and guide are required work, not optional.
- Two lines (v1 maintenance, v2) must be kept releasable during the transition.
- Several decisions above rest on platform behaviour that differs between surfaces and is still in preview on some. Decisions 4, 5 and 12 are validated in Phase 1b before Phase 2 depends on them; if validation fails, this ADR is amended rather than worked around.

## Rejected along the way

- **`agentStop` as the completion gate.** Rejected because a hook that can time out or be ignored after repeated blocks cannot be the source of truth for "done".
- **Advisor implemented as a stop hook.** Rejected because command and HTTP hooks cannot invoke agents; the hook output contract only carries a decision and a reason.
- **A legacy plugin that shims v1 tool names in v2.** Rejected because a faithful shim must re-implement old schemas, state semantics and cancellation; a one-time migration is smaller and honest about what is gone.
- **"Dual runtime" compatibility for agents and hooks.** Rejected because discovering the same files is not behavioural compatibility (permissions, delegation, model selection and failure behaviour all differ).
- **Live evaluations in PR CI.** Rejected because of unattended credentials, fork-PR exposure and running PR-modified hooks next to secrets.
