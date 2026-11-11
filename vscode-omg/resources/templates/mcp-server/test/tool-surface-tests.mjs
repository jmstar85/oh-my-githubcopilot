import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { encode } from "gpt-tokenizer/encoding/o200k_base";

import { createServer, TOOL_NAMES } from "../dist/server.js";
import { LEGACY_TOOL_NAMES } from "../dist/legacy-tools.js";
import { resetDeprecationNotice } from "../dist/utils.js";

const TOOL_TOKEN_BUDGET = 900;

// ──────────────────────────────────────────────
// helpers
// ──────────────────────────────────────────────

async function connect(legacy) {
  const server = createServer({ legacy });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(a);
  const client = new Client({ name: "omg-tests", version: "0" });
  await client.connect(b);
  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}

async function call(client, name, args = {}) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content?.[0]?.text ?? "";
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // non-JSON (e.g. SDK validation error text)
  }
  return { isError: res.isError === true, json, text };
}

function toolTokens(tools) {
  return tools.reduce(
    (sum, t) => sum + encode(JSON.stringify({ name: t.name, description: t.description, inputSchema: t.inputSchema })).length,
    0
  );
}

function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

/** A workspace as left behind by OMG 1.4.x — no migration must be needed to read it. */
function seedLegacyWorkspace(root) {
  writeJson(path.join(root, ".omg", "state", "ralph-state.json"), {
    active: true,
    mode: "ralph",
    iteration: 2,
    updated_at: "2026-11-01T10:00:00.000Z",
  });
  writeJson(path.join(root, ".omg", "state", "omg-autopilot-state.json"), {
    active: true,
    current_phase: 2,
    phase_name: "execution",
    updated_at: "2026-11-01T10:00:00.000Z",
  });
  writeJson(path.join(root, ".omg", "prd.json"), {
    title: "Legacy PRD",
    description: "written by 1.4",
    stories: [
      {
        id: "s1",
        title: "First",
        description: "",
        acceptance_criteria: ["a"],
        passes: true,
        verification_evidence: "npm test passed",
        priority: 1,
      },
      { id: "s2", title: "Second", description: "", acceptance_criteria: ["b", "c"], passes: false, priority: 5 },
    ],
    created_at: "2026-11-01T09:00:00.000Z",
    updated_at: "2026-11-01T10:00:00.000Z",
  });
  writeJson(path.join(root, ".omg", "ultragoal", "ledger.json"), {
    version: 1,
    active_goal_id: "goal0001",
    goals: [
      {
        id: "goal0001",
        objective: "Ship 1.5",
        status: "active",
        created_at: "2026-11-01T09:00:00.000Z",
        updated_at: "2026-11-01T09:00:00.000Z",
        checkpoints: [],
      },
    ],
  });
  writeJson(path.join(root, ".omg", "project-memory.json"), {
    entries: [
      {
        key: "build",
        value: "run npm run build",
        category: "reference",
        tags: ["ci"],
        created_at: "2026-11-01T09:00:00.000Z",
        updated_at: "2026-11-01T09:00:00.000Z",
      },
    ],
  });
  writeJson(path.join(root, ".omg", "state", "session-checkpoint.json"), {
    timestamp: "2026-11-01T10:30:00.000Z",
    summary: "legacy checkpoint",
    key_decisions: ["keep formats"],
    active_modes: [],
    recent_memory: [],
    modified_files: ["a.ts"],
    context_bytes_estimate: 1000,
    estimated_tokens: 250,
    source_tool: "copilot",
    source_origin: "native",
    source_session_id: null,
    imported_at: null,
    imported_summary: null,
    workspace_root: root,
  });
}

function useTempWorkspace(prefix, seed) {
  let tmpDir;
  let previous;
  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    previous = process.env.WORKSPACE_ROOT;
    process.env.WORKSPACE_ROOT = tmpDir;
    if (seed) seed(tmpDir);
  });
  after(() => {
    if (previous === undefined) delete process.env.WORKSPACE_ROOT;
    else process.env.WORKSPACE_ROOT = previous;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
  return () => tmpDir;
}

// ──────────────────────────────────────────────
// tool surface
// ──────────────────────────────────────────────

describe("tool surface", () => {
  it("registers exactly the six 1.5 tools by default", async () => {
    const { client, close } = await connect(false);
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((t) => t.name).sort(), [...TOOL_NAMES].sort());
    await close();
  });

  it(`keeps the default tool definitions within ${TOOL_TOKEN_BUDGET} o200k tokens`, async () => {
    const { client, close } = await connect(false);
    const { tools } = await client.listTools();
    const tokens = toolTokens(tools);
    assert.ok(tokens <= TOOL_TOKEN_BUDGET, `tool definitions use ${tokens} tokens (budget ${TOOL_TOKEN_BUDGET})`);
    await close();
  });

  it("adds the 25 legacy names only when legacy mode is on", async () => {
    const { client, close } = await connect(true);
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    assert.equal(LEGACY_TOOL_NAMES.length, 25);
    assert.deepEqual(names, [...TOOL_NAMES, ...LEGACY_TOOL_NAMES].sort());
    for (const t of tools) {
      if (LEGACY_TOOL_NAMES.includes(t.name)) assert.match(t.description, /deprecated/i, `${t.name} is not marked deprecated`);
    }
    await close();
  });
});

// ──────────────────────────────────────────────
// omg_read over a 1.4 workspace
// ──────────────────────────────────────────────

describe("omg_read reads 1.4 state without migration", () => {
  const root = useTempWorkspace("omg-read-", seedLegacyWorkspace);

  it("scope=all summarises modes, PRD, ultragoal, checkpoint and context", async () => {
    const { client, close } = await connect(false);
    const { json, isError } = await call(client, "omg_read", { scope: "all" });
    assert.equal(isError, false);
    assert.deepEqual(json.active_modes.map((m) => m.mode).sort(), ["omg-autopilot", "ralph"]);
    assert.equal(json.prd.total_stories, 2);
    assert.deepEqual(json.prd.open_stories, ["s2"]);
    assert.equal(json.prd.next_story_id, "s2");
    assert.equal(json.ultragoal.id, "goal0001");
    assert.equal(json.checkpoint.summary, "legacy checkpoint");
    assert.equal(typeof json.context.percent_used, "number");
    await close();
  });

  it("scope=state returns the raw state file or the active-mode list", async () => {
    const { client, close } = await connect(false);
    const one = await call(client, "omg_read", { scope: "state", key: "ralph" });
    assert.equal(one.json.iteration, 2);
    const list = await call(client, "omg_read", { scope: "state" });
    assert.equal(list.json.active_modes.length, 2);
    const none = await call(client, "omg_read", { scope: "state", key: "team" });
    assert.deepEqual(none.json, { active: false, mode: "team", message: "No state found" });
    await close();
  });

  it("scope=prd returns the summary with the next open story, or one story by key", async () => {
    const { client, close } = await connect(false);
    const summary = await call(client, "omg_read", { scope: "prd" });
    assert.equal(summary.json.passing, 1);
    assert.equal(summary.json.next_story.id, "s2");
    assert.equal(summary.json.remaining, 1);
    const one = await call(client, "omg_read", { scope: "prd", key: "s1" });
    assert.equal(one.json.story.verification_evidence, "npm test passed");
    const missing = await call(client, "omg_read", { scope: "prd", key: "nope" });
    assert.equal(missing.isError, true);
    await close();
  });

  it("scope=phase, ultragoal and checkpoint", async () => {
    const { client, close } = await connect(false);
    const phase = await call(client, "omg_read", { scope: "phase" });
    assert.equal(phase.json.current_phase, 2);
    assert.equal(phase.json.phases.length, 6);
    const p3 = await call(client, "omg_read", { scope: "phase", key: "3" });
    assert.equal(p3.json.name, "qa");
    const goal = await call(client, "omg_read", { scope: "ultragoal" });
    assert.equal(goal.json.active, true);
    assert.equal(goal.json.active_goal.id, "goal0001");
    assert.match(goal.json.handoff_text, /omg_read scope:"ultragoal"/);
    const cp = await call(client, "omg_read", { scope: "checkpoint" });
    assert.equal(cp.json.exists, true);
    assert.deepEqual(cp.json.checkpoint.key_decisions, ["keep formats"]);
    assert.equal(cp.json.context.checkpoint_due, false);
    await close();
  });

  it("leaves every 1.4 file byte-identical after reading", async () => {
    const snapshot = (p) => fs.readFileSync(path.join(root(), ".omg", p), "utf-8");
    const before = ["prd.json", "project-memory.json", "ultragoal/ledger.json", "state/session-checkpoint.json"].map(snapshot);
    const { client, close } = await connect(false);
    for (const scope of ["state", "prd", "phase", "ultragoal", "checkpoint", "all"]) await call(client, "omg_read", { scope });
    await close();
    const after = ["prd.json", "project-memory.json", "ultragoal/ledger.json", "state/session-checkpoint.json"].map(snapshot);
    assert.deepEqual(after, before);
  });
});

// ──────────────────────────────────────────────
// omg_verify fail-closed
// ──────────────────────────────────────────────

describe("omg_verify is fail-closed", () => {
  const root = useTempWorkspace("omg-verify-", seedLegacyWorkspace);
  const prdFile = () => fs.readFileSync(path.join(root(), ".omg", "prd.json"), "utf-8");
  const ledgerFile = () => fs.readFileSync(path.join(root(), ".omg", "ultragoal", "ledger.json"), "utf-8");
  const good = [{ command: "npm test", output_excerpt: "pass 42", passed: true }];

  it("rejects empty evidence without writing", async () => {
    const { client, close } = await connect(false);
    const before = prdFile();
    const res = await call(client, "omg_verify", { target: "story", id: "s2", evidence: [] });
    assert.equal(res.isError, true);
    assert.match(res.json.error, /evidence is empty/);
    assert.equal(prdFile(), before);
    await close();
  });

  it("rejects when any item did not pass", async () => {
    const { client, close } = await connect(false);
    const before = prdFile();
    const res = await call(client, "omg_verify", {
      target: "story",
      id: "s2",
      evidence: [...good, { command: "npm run lint", output_excerpt: "3 errors", passed: false }],
    });
    assert.equal(res.isError, true);
    assert.match(res.json.error, /did not pass/);
    assert.equal(prdFile(), before);
    await close();
  });

  it("rejects blank command or output", async () => {
    const { client, close } = await connect(false);
    const before = prdFile();
    const blankOut = await call(client, "omg_verify", { target: "story", id: "s2", evidence: [{ command: "npm test", output_excerpt: "  ", passed: true }] });
    assert.equal(blankOut.isError, true);
    const blankCmd = await call(client, "omg_verify", { target: "story", id: "s2", evidence: [{ command: "", output_excerpt: "ok", passed: true }] });
    assert.equal(blankCmd.isError, true);
    assert.equal(prdFile(), before);
    await close();
  });

  it("rejects unknown story ids", async () => {
    const { client, close } = await connect(false);
    const res = await call(client, "omg_verify", { target: "story", id: "nope", evidence: good });
    assert.equal(res.isError, true);
    assert.match(res.json.error, /not found/);
    await close();
  });

  it("marks the story verified with rendered evidence when all items passed", async () => {
    const { client, close } = await connect(false);
    const res = await call(client, "omg_verify", { target: "story", id: "s2", evidence: good });
    assert.equal(res.isError, false);
    assert.equal(res.json.passes, true);
    assert.equal(res.json.total_passing, 2);
    const prd = JSON.parse(prdFile());
    const s2 = prd.stories.find((s) => s.id === "s2");
    assert.equal(s2.passes, true);
    assert.match(s2.verification_evidence, /\$ npm test\npass 42\n→ passed/);
    assert.ok(s2.verified_at);
    await close();
  });

  it("completes the active ultragoal only with passing evidence and the active id", async () => {
    const { client, close } = await connect(false);
    const before = ledgerFile();
    const wrongId = await call(client, "omg_verify", { target: "ultragoal", id: "other", evidence: good });
    assert.equal(wrongId.isError, true);
    const noEvidence = await call(client, "omg_verify", { target: "ultragoal", id: "goal0001", evidence: [] });
    assert.equal(noEvidence.isError, true);
    assert.equal(ledgerFile(), before);

    const ok = await call(client, "omg_verify", { target: "ultragoal", id: "goal0001", evidence: good });
    assert.equal(ok.isError, false);
    assert.equal(ok.json.ultragoal.active, false);
    assert.equal(ok.json.ultragoal.goals[0].status, "completed");
    await close();
  });
});

// ──────────────────────────────────────────────
// omg_write
// ──────────────────────────────────────────────

describe("omg_write", () => {
  useTempWorkspace("omg-write-", seedLegacyWorkspace);

  it("refuses passes:true on a story (evidence must go through omg_verify)", async () => {
    const { client, close } = await connect(false);
    const res = await call(client, "omg_write", { scope: "story", op: "set", key: "s2", value: { passes: true } });
    assert.equal(res.isError, true);
    assert.match(res.json.error, /omg_verify/);
    const prd = (await call(client, "omg_read", { scope: "prd", key: "s2" })).json.story;
    assert.equal(prd.passes, false);
    await close();
  });

  it("creates, updates, reopens and removes stories", async () => {
    const { client, close } = await connect(false);
    const created = await call(client, "omg_write", { scope: "story", op: "set", key: "s3", value: { title: "Third", acceptance_criteria: ["x"], priority: 9 } });
    assert.equal(created.json.action, "created");
    const updated = await call(client, "omg_write", { scope: "story", op: "set", key: "s3", value: { priority: 1 } });
    assert.equal(updated.json.action, "updated");
    const reopened = await call(client, "omg_write", { scope: "story", op: "set", key: "s1", value: { passes: false } });
    assert.equal(reopened.json.passes, false);
    const s1 = (await call(client, "omg_read", { scope: "prd", key: "s1" })).json.story;
    assert.equal(s1.verification_evidence, undefined);
    const removed = await call(client, "omg_write", { scope: "story", op: "clear", key: "s3" });
    assert.equal(removed.json.deleted, true);
    assert.equal(removed.json.total_stories, 2);
    await close();
  });

  it("merges and clears mode state", async () => {
    const { client, close } = await connect(false);
    const set = await call(client, "omg_write", { scope: "state", op: "set", key: "team", value: { active: true, current_phase: "team-plan" } });
    assert.equal(set.json.state.active, true);
    const merged = await call(client, "omg_write", { scope: "state", op: "set", key: "team", value: { current_phase: "team-exec" } });
    assert.equal(merged.json.state.active, true);
    assert.equal(merged.json.state.current_phase, "team-exec");
    const cleared = await call(client, "omg_write", { scope: "state", op: "clear", key: "team" });
    assert.equal(cleared.json.cleared, "team");
    const gone = await call(client, "omg_read", { scope: "state", key: "team" });
    assert.equal(gone.json.active, false);
    await close();
  });

  it("advances autopilot phases and validates the caller's phase", async () => {
    const { client, close } = await connect(false);
    const mismatch = await call(client, "omg_write", { scope: "phase", op: "advance", value: { current_phase: 0 } });
    assert.equal(mismatch.isError, true);
    assert.match(mismatch.json.error, /Phase mismatch/);
    const next = await call(client, "omg_write", { scope: "phase", op: "advance", value: { current_phase: 2 } });
    assert.equal(next.json.phase, 3);
    assert.equal(next.json.name, "qa");
    const implicit = await call(client, "omg_write", { scope: "phase", op: "advance" });
    assert.equal(implicit.json.phase, 4);
    await close();
  });

  it("rejects unsupported scope/op combinations", async () => {
    const { client, close } = await connect(false);
    const res = await call(client, "omg_write", { scope: "phase", op: "set" });
    assert.equal(res.isError, true);
    assert.match(res.json.error, /Unsupported op/);
    const ug = await call(client, "omg_write", { scope: "ultragoal", op: "clear" });
    assert.equal(ug.isError, true);
    await close();
  });

  it("creates a PRD and records ultragoal milestones", async () => {
    const { client, close } = await connect(false);
    const prd = await call(client, "omg_write", { scope: "prd", op: "set", value: { title: "New", stories: [{ title: "only" }] } });
    assert.equal(prd.json.stories_created, 1);
    const adv = await call(client, "omg_write", { scope: "ultragoal", op: "advance", key: "goal0001", value: { evidence: "tests green", note: "m1" } });
    assert.equal(adv.json.ultragoal.active_goal.checkpoints.length, 1);
    const noEvidence = await call(client, "omg_write", { scope: "ultragoal", op: "advance", key: "goal0001", value: { evidence: " " } });
    assert.equal(noEvidence.isError, true);
    await close();
  });
});

// ──────────────────────────────────────────────
// omg_check_completion and omg_checkpoint
// ──────────────────────────────────────────────

describe("omg_check_completion keeps its 1.4 shape", () => {
  const root = useTempWorkspace("omg-gate-", seedLegacyWorkspace);

  it("reports remaining workflows, unverified stories and the active ultragoal", async () => {
    const { client, close } = await connect(false);
    const res = await call(client, "omg_check_completion", {});
    assert.equal(res.json.allow_stop, false);
    assert.equal(res.json.complete, false);
    assert.equal(res.json.remaining.length, 2);
    assert.deepEqual(res.json.unverified, ["s2"]);
    assert.equal(res.json.ultragoal.id, "goal0001");
    assert.match(res.json.message, /Continue working/);
    await close();
  });

  it("allows stopping once no workflow is active", async () => {
    const { client, close } = await connect(false);
    await call(client, "omg_write", { scope: "state", op: "clear" });
    const res = await call(client, "omg_check_completion", {});
    assert.equal(res.json.allow_stop, true);
    assert.deepEqual(res.json.remaining, []);
    assert.ok(!fs.existsSync(path.join(root(), ".omg", "state", "ralph-state.json")));
    await close();
  });
});

describe("omg_checkpoint", () => {
  const root = useTempWorkspace("omg-cp-", seedLegacyWorkspace);

  it("requires a summary", async () => {
    const { client, close } = await connect(false);
    const missing = await call(client, "omg_checkpoint", {});
    assert.equal(missing.isError, true);
    const blank = await call(client, "omg_checkpoint", { summary: "   " });
    assert.equal(blank.isError, true);
    await close();
  });

  it("writes the 1.4 checkpoint format and returns handoff text", async () => {
    const { client, close } = await connect(false);
    const res = await call(client, "omg_checkpoint", { summary: "Part B done", decisions: ["6 tools"], modified_files: ["src/server.ts"] });
    assert.equal(res.isError, false);
    assert.match(res.json.handoff_text, /Part B done/);
    assert.match(res.json.handoff_text, /omg_read scope:"checkpoint"/);
    const cp = JSON.parse(fs.readFileSync(path.join(root(), ".omg", "state", "session-checkpoint.json"), "utf-8"));
    assert.deepEqual(cp.key_decisions, ["6 tools"]);
    assert.deepEqual(cp.modified_files, ["src/server.ts"]);
    assert.equal(cp.source_origin, "native");
    assert.equal(cp.active_modes.length, 2);
    const read = await call(client, "omg_read", { scope: "checkpoint" });
    assert.equal(read.json.checkpoint.summary, "Part B done");
    await close();
  });
});

// ──────────────────────────────────────────────
// omg_memory
// ──────────────────────────────────────────────

describe("omg_memory", () => {
  useTempWorkspace("omg-mem-", seedLegacyWorkspace);

  it("gets, sets, searches and deletes while preserving 1.4 categories", async () => {
    const { client, close } = await connect(false);
    const all = await call(client, "omg_memory", { op: "get" });
    assert.equal(all.json.total, 1);
    assert.equal(all.json.entries[0].category, "reference");

    const updated = await call(client, "omg_memory", { op: "set", key: "build", value: "run npm run build first", tags: ["ci", "build"] });
    assert.equal(updated.json.action, "updated");
    const one = await call(client, "omg_memory", { op: "get", key: "build" });
    assert.equal(one.json.entries[0].category, "reference");
    assert.deepEqual(one.json.entries[0].tags, ["ci", "build"]);

    const created = await call(client, "omg_memory", { op: "set", key: "style", value: "prefer interface" });
    assert.equal(created.json.action, "created");
    const found = await call(client, "omg_memory", { op: "search", query: "INTERFACE" });
    assert.equal(found.json.total, 1);
    assert.equal(found.json.entries[0].key, "style");

    const deleted = await call(client, "omg_memory", { op: "delete", key: "style" });
    assert.equal(deleted.json.deleted, true);
    const missingArg = await call(client, "omg_memory", { op: "search" });
    assert.equal(missingArg.isError, true);
    await close();
  });
});

// ──────────────────────────────────────────────
// legacy adapters
// ──────────────────────────────────────────────

describe("legacy adapters (OMG_LEGACY_TOOLS=1) keep 1.4 shapes", () => {
  const root = useTempWorkspace("omg-legacy-", seedLegacyWorkspace);
  let errors;
  const originalError = console.error;
  before(() => {
    errors = [];
    console.error = (...args) => errors.push(args.join(" "));
    resetDeprecationNotice();
  });
  after(() => {
    console.error = originalError;
  });

  it("maps read tools onto omg_read results", async () => {
    const { client, close } = await connect(true);
    const legacyState = await call(client, "omg_read_state", { mode: "ralph" });
    const newState = await call(client, "omg_read", { scope: "state", key: "ralph" });
    assert.deepEqual(legacyState.json, newState.json);

    const active = await call(client, "omg_list_active", {});
    assert.equal(active.json.active_modes.length, 2);

    const prd = await call(client, "omg_read_prd", {});
    assert.equal(prd.json.total_stories, 2);
    assert.equal(prd.json.stories[0].criteria_count, 1);

    const next = await call(client, "omg_verify_story", {});
    assert.equal(next.json.story.id, "s2");
    assert.equal(next.json.remaining, 1);
    assert.equal(next.json.total, 2);

    const phases = await call(client, "omg_get_phase_info", {});
    assert.equal(phases.json.phases.length, 6);
    const bad = await call(client, "omg_get_phase_info", { phase: 9 });
    assert.match(bad.json.error, /Invalid phase/);

    const status = await call(client, "omg_ultragoal_status", {});
    assert.equal(status.json.success, true);
    assert.equal(status.json.ultragoal.active_goal.id, "goal0001");

    const cp = await call(client, "omg_restore_checkpoint", {});
    assert.equal(cp.json.summary, "legacy checkpoint");
    const ctx = await call(client, "omg_context_status", {});
    assert.equal(typeof ctx.json.percent_used, "number");
    await close();
  });

  it("maps write tools onto the shared helpers", async () => {
    const { client, close } = await connect(true);
    const w = await call(client, "omg_write_state", { mode: "team", state: JSON.stringify({ active: true }) });
    assert.equal(w.json.success, true);
    assert.equal(w.json.state.active, true);
    const badJson = await call(client, "omg_write_state", { mode: "team", state: "[1]" });
    assert.equal(badJson.isError, true);

    const upd = await call(client, "omg_update_story", { story_id: "s2", passes: true, evidence: "manual check" });
    assert.equal(upd.json.total_passing, 2);
    const s2 = JSON.parse(fs.readFileSync(path.join(root(), ".omg", "prd.json"), "utf-8")).stories.find((s) => s.id === "s2");
    assert.equal(s2.verification_evidence, "manual check");

    const mem = await call(client, "omg_write_memory", { key: "k", value: "v", category: "user" });
    assert.equal(mem.json.action, "created");
    const byCat = await call(client, "omg_read_memory", { category: "user" });
    assert.equal(byCat.json.total, 1);

    const legacyCp = await call(client, "omg_checkpoint", { key_decisions: ["legacy call"] });
    assert.equal(legacyCp.isError, false);
    const saved = JSON.parse(fs.readFileSync(path.join(root(), ".omg", "state", "session-checkpoint.json"), "utf-8"));
    assert.deepEqual(saved.key_decisions, ["legacy call"]);

    const cleared = await call(client, "omg_clear_state", { mode: "team" });
    assert.equal(cleared.json.cleared, "team");
    await close();
  });

  it("logs the deprecation notice once per session", async () => {
    const notices = errors.filter((m) => m.includes("legacy MCP tool"));
    assert.equal(notices.length, 1, `expected one deprecation notice, got ${notices.length}`);
    assert.match(notices[0], /omg_read_state/);
  });
});
