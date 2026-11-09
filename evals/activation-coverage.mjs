#!/usr/bin/env node
// Static activation coverage: every trigger phrase that used to live in the always-on
// copilot-instructions.md keyword table (v1.4.4) must now be discoverable from the owning
// SKILL.md description, or be one of the hard routes still present in copilot-instructions.md.
// Usage: npm run activation [-- <repo-root>]   Exit code 1 when a non-deprecated phrase is uncovered.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import YAML from "yaml";

const root = resolve(process.argv[2] ?? join(import.meta.dirname, ".."));
const fixture = JSON.parse(readFileSync(join(import.meta.dirname, "fixtures/legacy-keyword-triggers.json"), "utf8"));
const instructions = readFileSync(join(root, ".github/copilot-instructions.md"), "utf8").toLowerCase();

const norm = (s) => s.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();

function skillDescription(name) {
  const file = join(root, ".github/skills", name, "SKILL.md");
  if (!existsSync(file)) return null;
  const text = readFileSync(file, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { name, description: "", hasFrontmatter: false };
  let fm = {};
  try { fm = YAML.parse(m[1]) ?? {}; } catch { /* fall through */ }
  return { name: fm.name ?? name, description: String(fm.description ?? ""), hasFrontmatter: true };
}

const rows = [];
let failures = 0;
for (const { skill, phrases, deprecated } of fixture.mappings) {
  const meta = skillDescription(skill);
  for (const phrase of phrases) {
    const p = norm(phrase);
    const hardRoute = instructions.includes(`\`${phrase.toLowerCase()}\``);
    const inDescription = meta ? norm(`${meta.name} ${meta.description}`).includes(p) : false;
    const covered = hardRoute || inDescription;
    const status = covered ? "ok" : deprecated ? "deprecated" : "MISSING";
    if (!covered && !deprecated) failures++;
    rows.push({ skill, phrase, via: hardRoute ? "instructions" : inDescription ? "description" : "-", status, frontmatter: meta?.hasFrontmatter ?? false });
  }
}

const w = (s, n) => String(s).padEnd(n);
console.log(`${w("skill", 24)} ${w("phrase", 24)} ${w("via", 13)} status`);
for (const r of rows) console.log(`${w(r.skill, 24)} ${w(r.phrase, 24)} ${w(r.via, 13)} ${r.status}`);

const skillsDir = join(root, ".github/skills");
const noFrontmatter = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory() && skillDescription(d)?.hasFrontmatter === false);
if (noFrontmatter.length) console.log(`\nSkills without frontmatter (not natively discoverable): ${noFrontmatter.join(", ")}`);

console.log(`\n${rows.length} phrases checked, ${failures} missing, ${rows.filter((r) => r.status === "deprecated").length} deprecated-uncovered.`);
process.exit(failures ? 1 : 0);
