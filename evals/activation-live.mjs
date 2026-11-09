#!/usr/bin/env node
// Live activation probes: runs each prompt from fixtures/activation-probes.json through
// `copilot -p` (non-interactive, mutating tools denied) and checks which skills the model
// loaded via the `skill` tool. Requires an authenticated GitHub Copilot CLI and spends
// model quota — run manually or on a budget-capped scheduled job, never as a PR gate.
// Usage: npm run activation:live [-- <repo-root>] [--report] [--only=p1,p2]
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const wantReport = args.includes("--report");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",")) : null;
const root = resolve(args.find((a) => !a.startsWith("--")) ?? join(import.meta.dirname, ".."));
const fixture = JSON.parse(readFileSync(join(import.meta.dirname, "fixtures/activation-probes.json"), "utf8"));
const probes = only ? fixture.probes.filter((p) => only.has(p.id)) : fixture.probes;
const bin = process.platform === "win32" ? "copilot.exe" : "copilot";
const logDir = mkdtempSync(join(tmpdir(), "omg-activation-"));
const PER_PROBE_TIMEOUT_MS = 240_000;

const version = spawnSync(bin, ["--version"], { encoding: "utf8" }).stdout?.trim().split("\n")[0] ?? "unknown";

function runProbe(probe) {
  const res = spawnSync(
    bin,
    ["-p", probe.prompt, "--trust-folder", "--output-format", "json", "--deny-tool", "edit", "create", "bash", "powershell", "shell", "--log-level", "error", "--log-dir", logDir],
    { cwd: root, encoding: "utf8", timeout: PER_PROBE_TIMEOUT_MS, maxBuffer: 64 * 1024 * 1024 },
  );
  const skills = new Set();
  const tools = new Map();
  let model = "";
  for (const line of (res.stdout ?? "").split("\n")) {
    let ev;
    try { ev = JSON.parse(line); } catch { continue; }
    if (ev.type !== "tool.execution_start") continue;
    const name = ev.data?.toolName;
    tools.set(name, (tools.get(name) ?? 0) + 1);
    if (name === "skill" && ev.data?.arguments?.skill) skills.add(ev.data.arguments.skill);
    if (ev.data?.model) model = ev.data.model;
  }
  const loaded = [...skills];
  const pass = probe.expect === null ? loaded.length === 0 : loaded.includes(probe.expect);
  return { ...probe, loaded, tools: [...tools].map(([k, v]) => `${k}x${v}`).join(" "), model, timedOut: res.error?.code === "ETIMEDOUT", pass };
}

const results = probes.map((p) => {
  const r = runProbe(p);
  console.log(`${r.pass ? "PASS" : "FAIL"} ${r.id} expect=${r.expect ?? "(none)"} loaded=[${r.loaded.join(",")}] model=${r.model}${r.timedOut ? " (timed out; partial)" : ""}`);
  return r;
});

const failed = results.filter((r) => !r.pass).length;
console.log(`\n${version} · ${results.length} probes · ${failed} failed · logs: ${logDir}`);

if (wantReport) {
  const date = new Date().toISOString().slice(0, 10);
  const dir = join(import.meta.dirname, "reports");
  mkdirSync(dir, { recursive: true });
  const lines = [
    `# Activation probes — ${date}`,
    "",
    `${version} · model(s): ${[...new Set(results.map((r) => r.model).filter(Boolean))].join(", ")} · mutating tools denied (edit, create, bash, powershell, shell)`,
    "",
    "| id | lang | expected skill | loaded via `skill` tool | result | tools |",
    "|---|---|---|---|---|---|",
    ...results.map((r) => `| ${r.id} | ${r.lang} | ${r.expect ?? "(none)"} | ${r.loaded.join(", ") || "—"} | ${r.pass ? "pass" : "FAIL"}${r.timedOut ? " (partial)" : ""} | ${r.tools} |`),
    "",
    `${results.length - failed}/${results.length} passed.`,
  ];
  const file = join(dir, `${date}-activation-live.md`);
  writeFileSync(file, lines.join("\n") + "\n");
  console.log(`report: ${file}`);
}

process.exit(failed ? 1 : 0);
