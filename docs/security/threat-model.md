# OMG Threat Model (draft)

- Status: **Draft v0** (Phase 0 of [ADR-0001](../adr/0001-replatform.md)). Describes OMG 1.5 as implemented and the constraints it places on the v2 design. Finalized in Phase 2.
- Scope: the files OMG installs into a workspace (`.github/{agents,skills,hooks,prompts}`, `.github/copilot-instructions.md`, `mcp-server/`, `.vscode/mcp.json`), the state it keeps under `.omg/`, and the VS Code extension that scaffolds them.
- Out of scope: the Copilot hosts themselves (model, permission prompts, sandboxing, cloud runners) and the user's own CI.

## 1. What OMG is, in security terms

OMG is **prompt content plus three pieces of code that run with the user's privileges**: hook scripts, a local MCP server, and a VS Code extension. Its guardrails are advisory controls layered on the host's own permission model. **Hooks are guardrails, not a sandbox**: they reduce accidents and raise the cost of simple attacks; they do not contain a determined or compromised agent.

| Component | Runs as | Reads / writes | Trust it requires |
|---|---|---|---|
| Instructions, agents, skills, prompts | Model context | — | Whoever can edit them steers the agent |
| Hook scripts (`pre-tool-use`, `post-tool-use`; bash and PowerShell) | User, on every tool call | Tool name/input/output; writes `.omg/state/*` | Repository script hooks execute repository code → **workspace trust is the boundary** |
| MCP server (`mcp-server/dist/index.js`, stdio) | User, started by the host | Only `.omg/` under `WORKSPACE_ROOT`; with `OMG_LEGACY_TOOLS=1` the bridge also reads `~/.claude/projects/<workspace>` and reads/writes `.omc/` | Local process, no network listener |
| VS Code extension | User | Copies bundled templates into the workspace; runs `npm install && npm run build` in `mcp-server/`; writes `.vscode/mcp.json` if absent | Extension install + the npm registry |

## 2. Assets

1. The repository, its history and its remotes (irreversible damage: force push, hard reset, deletion).
2. Secrets reachable from the workspace (`.env*`, credentials in tool output).
3. **Control files** — files that define what the agent may do: `.github/hooks/**`, `.github/copilot-instructions.md`, `.github/agents/**`, `.github/skills/**`, `.vscode/mcp.json`, `mcp-server/**`.
4. **Evidence files** — files that say work is done: `.omg/prd.json`, `.omg/ultragoal/ledger.json`, `.omg/state/*-state.json`, `.omg/state/session-checkpoint.json`.
5. The user's machine and account (everything the hooks, server and build step can reach).

## 3. Actors and trust boundaries

- **User / maintainer** — trusted.
- **Agent (model + subagents)** — *not* trusted to police itself. It follows instructions it reads, including ones planted in files, web pages and tool output.
- **Content the agent reads** (repository files, issues, web results, tool output, MCP results, stored memory, checkpoints) — untrusted data, even when OMG itself wrote it in an earlier session.
- **Repository contributors** — anyone who can land a change to a control file changes the agent's behaviour for everyone who trusts the workspace.

Boundaries that actually enforce something today: host permission prompts, workspace trust, and the `preToolUse` deny decision. Everything else is convention.

## 4. Threats

Severity is the maintainers' estimate for a typical developer workstation. "1.5" is what exists now; "Gap" is what does not; "Plan" is the intended v2 control (not yet built).

| ID | Threat | 1.5 control | Gap | Plan |
|---|---|---|---|---|
| T1 | **Agent edits control files** (rewrites a hook, removes a rule) and thereby disables the guardrails that constrain it. High | None specific; host permission prompts | Hooks do not protect themselves. A worker that can edit its own guardrails gives them no independent force | `preToolUse` **deny** for writes to `.github/hooks/**` and other control files; enterprises: policy/managed hooks outside the repository |
| T2 | **Forged completion.** The agent marks work done without doing it: edits `.omg/prd.json` or the ultragoal ledger directly, or passes invented evidence to `omg_verify`. High | `omg_verify` is fail-closed on *shape* (non-empty evidence, every item passed, non-blank command and output); `omg_write` refuses `passes:true`; instructions require a separate verifier/reviewer pass | Evidence is self-attested — the server cannot tell whether a command ran. Evidence files are ordinary files the agent can edit. `OMG_LEGACY_TOOLS=1` re-enables the permissive `omg_update_story` | Task journal as the source of truth (task id, tested tree hash, verifier result, terminal status); `preToolUse` deny for direct edits to evidence files; the stop hook only consults the journal |
| T3 | **Prompt injection** through tool output, web content, repository files or MCP results leads the agent to run destructive commands or leak data. High | The `preToolUse` guards; host permission prompts | Guards match text; they cannot recognise intent. No output filtering. No egress control | Treat all tool output as untrusted in agent prompts; keep irreversible-operation checks in `preToolUse`; document that OMG adds no egress control |
| T4 | **Irreversible operation slips past a guard** (force push, `reset --hard`, `clean -f`, deleting config, writing `node_modules`/`.env`). Medium–High | Regex guards in `pre-tool-use.{sh,ps1}` | Best-effort pattern matching: aliases, `git -c`, wrapper scripts, other shells, chained or encoded commands and equivalent commands (`rm -rf`, `git push +ref`) are not covered. The bash and PowerShell scripts are maintained by hand and **had diverged** — until 1.5 the PowerShell force-push guard missed a flag at the end of a JSON string | Hook fixture replay: one table of inputs asserted against both scripts (arguments, paths, exit codes) in CI; one rule source for both shells |
| T5 | **Hook fails open.** A hook that errors, times out or prints nothing lets the tool call proceed. Medium | — | Until 1.5 the PowerShell hooks printed no decision on Windows PowerShell 5.1 and silently skipped context tracking. Hosts differ in how they treat a missing decision | Fixture replay covering timeouts and empty output on each supported shell; explicit, documented behaviour per host |
| T6 | **Checks that run too late.** `postToolUse` fires after the side effect; a stop hook can be ignored after repeated blocks or time out. Medium | Destructive-operation checks are in `preToolUse` only; `postToolUse` only records state | The opt-in `OMG_LINT_ON_EDIT=1` path runs `npx tsc` / `npx eslint` from the workspace after an edit — repository-controlled tooling executed automatically | Keep every irreversible-operation check in `preToolUse`; never treat `postToolUse` or `agentStop` as a gate; document `OMG_LINT_ON_EDIT` as code execution |
| T7 | **Malicious repository.** Opening and trusting a repository that ships `.github/hooks/*` runs its scripts on the next tool call, as the user. High (generic to repository script hooks) | Workspace trust (host) | OMG's adopt scripts and `Initialize Workspace` *install* hook scripts into the user's repository, normalising their presence; later changes to them arrive through ordinary pull requests | Recommend review rules (CODEOWNERS) for control files; plugin-delivered hooks so the scripts are versioned outside the repository |
| T8 | **Memory and checkpoint poisoning.** Text stored via `omg_memory` or in a checkpoint is replayed into later sessions (`omg_read scope:"checkpoint"`, `handoff_text`, recent memory) and can carry instructions. Medium | Size limits (500 entries, 10,000 characters per value); stored only under `.omg/` | No provenance; replayed text is not marked as data | Record origin and session for stored entries; present restored content as quoted data; keep task state separate from native memory |
| T9 | **Secrets at rest in `.omg/`.** Checkpoints, memory, `modified-files.txt`, `last-test-result.json` and the optional tool log can capture sensitive output. Medium | `.env*` edits are blocked (reads are not) | `Initialize Workspace` does not add `.omg/` to the user's `.gitignore`, so state can be committed by accident | Add `.omg/` to `.gitignore` at install; document what is stored |
| T10 | **MCP server input abuse** (path traversal, symlink tricks, oversized or polluted JSON). Low | Mode names restricted to `[A-Za-z0-9_-]`; symlinks refused on read and write; 5 MB read cap; `__proto__`/`constructor`/`prototype` keys stripped; fixed file names under `.omg/` | Unit test for the symlink refusal cannot run on Windows without symlink privilege | Keep; run the suite on Linux in CI |
| T11 | **Supply chain of the install step.** `Initialize Workspace` and `Update Convention Files` run `npm install` (not `npm ci`) and a build inside the workspace; install scripts of dependencies run as the user. Medium | Lockfile shipped; dependencies limited to the MCP SDK (runtime) | Network install on the user's machine on every init/update; `npm install` may move versions | Ship a prebuilt server with the plugin (no install step); until then switch to `npm ci` |
| T12 | **Legacy mode widens the surface.** `OMG_LEGACY_TOOLS=1` registers 25 more tools, including permissive story updates and the bridge that reads Claude Code session files and writes `.omc/`. Low (opt-in) | Off by default; deprecation notice on stderr | — | Removed in 2.0 |
| T13 | **A "read-only" director is not read-only in effect** (v2): it holds change authority through the workers it instructs. Medium | n/a (v2) | — | Scope worker permissions per task; the director's tool list is not the security boundary |
| T14 | **Evaluation and CI exposure.** Live agent runs in CI need credentials; a pull request can modify the hooks those runs execute. High if done | Live probes are manual only; PR checks are static | — | Never gate PRs on live runs; scheduled jobs with a budget, on trusted refs only |

## 5. What OMG 1.5 does and does not promise

Promises
- The `preToolUse` guards deny the patterns listed in the README (writes to `node_modules` and `.env*`, deletion of critical config files, force push, hard reset / clean) in both the bash and the PowerShell hook. For 1.5 this was checked with an 11-case input table on Windows PowerShell 5.1, PowerShell 7 and bash (manual run, env-var input mode; not yet a CI fixture).
- A PRD story or ultragoal cannot be marked passed **through the default MCP tools** without non-empty, all-passed evidence.
- The MCP server confines its own reads and writes to `.omg/` under the workspace root in default mode.

Non-promises
- OMG does not sandbox the agent, restrict network egress, scan output for secrets, or stop an agent from editing the files that configure it.
- "Verified" means the agent supplied evidence in the required shape and, by instruction, a separate reviewer agreed — not that an independent system re-ran the commands.
- Guard patterns are not complete; treat them as a seatbelt.

## 6. Recommendations for adopters (today)

1. Review `.github/hooks/*` before trusting a workspace, and require review (CODEOWNERS / branch protection) for changes to control files.
2. Add `.omg/` to `.gitignore`.
3. Keep the host's own approval prompts enabled for terminal commands; do not rely on OMG's guards alone.
4. Leave `OMG_LEGACY_TOOLS` and `OMG_LINT_ON_EDIT` unset unless needed.
5. Enterprises: enforce guardrails with policy/managed hooks rather than repository scripts, which a workspace contributor (or the agent) can change.

## 7. Open questions for Phase 1b / 2

- How does each host treat a hook that prints no decision, exits non-zero, or times out? (Determines the real severity of T5.)
- Can `preToolUse` reliably see the target path for every edit-capable tool on every surface, so that control-file denial (T1, T2) is enforceable rather than cosmetic?
- What is the cheapest independent check for T2 — re-running the recorded command in the journal, or binding evidence to a tree hash and a verifier identity?
- Limits of approximating mid-generation rule enforcement with hooks: checks happen after the fact, cannot interrupt generation, and repeated injected reminders are themselves a context cost — they need de-duplication and a budget.
