#!/usr/bin/env node
// Measures the context footprint OMG adds to every Copilot request (lower bound):
// always-on instructions, agent/skill/prompt descriptions, and MCP tool definitions.
// Usage: npm install && npm run baseline [-- <repo-root>]   (requires mcp-server to be built)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { encode } from "gpt-tokenizer/encoding/o200k_base";
import YAML from "yaml";

const root = resolve(process.argv[2] ?? join(import.meta.dirname, ".."));
const tok = (s) => encode(s).length;

function frontmatter(file) {
  const text = readFileSync(file, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { fm: {}, body: text };
  let fm = {};
  try { fm = YAML.parse(m[1]) ?? {}; } catch { fm = { description: m[1] }; }
  return { fm, body: text.slice(m[0].length) };
}

function listDescriptions(dir, pick) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const file = pick(join(dir, entry));
    if (!file || !existsSync(file)) return [];
    const { fm, body } = frontmatter(file);
    return [{ name: fm.name ?? entry, desc: String(fm.description ?? ""), bodyTok: tok(body) }];
  });
}

const instr = readFileSync(join(root, ".github/copilot-instructions.md"), "utf8");
const agents = listDescriptions(join(root, ".github/agents"), (p) => (p.endsWith(".agent.md") ? p : null));
const skills = listDescriptions(join(root, ".github/skills"), (p) => (statSync(p).isDirectory() ? join(p, "SKILL.md") : null));
const prompts = listDescriptions(join(root, ".github/prompts"), (p) => (p.endsWith(".prompt.md") ? p : null));

async function mcpTools() {
  const entry = join(root, "mcp-server/dist/index.js");
  if (!existsSync(entry)) {
    console.warn("mcp-server/dist/index.js not found — run `npm run build` in mcp-server first. MCP tools counted as 0.");
    return [];
  }
  const child = spawn(process.execPath, [entry], { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
  let buf = "";
  const send = (o) => child.stdin.write(JSON.stringify(o) + "\n");
  const tools = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("mcp tools/list timeout")), 15000);
    child.stdout.on("data", (d) => {
      buf += d.toString();
      for (const line of buf.split("\n")) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === 2 && msg.result) { clearTimeout(timer); resolve(msg.result.tools); }
        } catch { /* partial line */ }
      }
    });
    child.on("error", reject);
    send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "omg-evals", version: "0" } } });
    send({ jsonrpc: "2.0", method: "notifications/initialized" });
    send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  });
  child.kill();
  return tools;
}
const tools = await mcpTools();

const sumDesc = (arr) => arr.reduce((a, x) => a + tok(`${x.name}: ${x.desc}`), 0);
const instrTok = tok(instr);
const agentTok = sumDesc(agents);
const skillTok = sumDesc(skills);
const promptTok = sumDesc(prompts);
const toolTok = tools.reduce((a, t) => a + tok(JSON.stringify({ name: t.name, description: t.description, inputSchema: t.inputSchema })), 0);
const total = instrTok + agentTok + skillTok + promptTok + toolTok;

const rows = [
  ["copilot-instructions.md (always-on, full text)", 1, Buffer.byteLength(instr), instrTok],
  ["agent descriptions (name + description)", agents.length, "", agentTok],
  ["skill descriptions (name + description)", skills.length, "", skillTok],
  ["prompt files (name + description)", prompts.length, "", promptTok],
  ["MCP tool definitions (name + description + inputSchema)", tools.length, "", toolTok],
  ["TOTAL always-injected (lower bound)", "", "", total],
];
console.log(`Repo: ${root}\n`);
console.log("| Category | Count | Bytes | Tokens (o200k) |");
console.log("|---|---:|---:|---:|");
for (const r of rows) console.log(`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} |`);

const top = (arr, key) => [...arr].sort((a, b) => key(b) - key(a)).slice(0, 3).map((x) => `${x.name}=${key(x)}`).join(", ");
console.log("\nOn-demand bodies (loaded only when invoked):");
console.log(`- agent bodies: ${agents.reduce((a, x) => a + x.bodyTok, 0)} tokens (largest: ${top(agents, (x) => x.bodyTok)})`);
console.log(`- skill bodies: ${skills.reduce((a, x) => a + x.bodyTok, 0)} tokens (largest: ${top(skills, (x) => x.bodyTok)})`);
if (tools.length) console.log(`\nMCP tools (${tools.length}): ${tools.map((t) => t.name).join(", ")}`);
