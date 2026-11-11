import * as fs from "node:fs";
import * as path from "node:path";
import { getWorkspaceRoot, ensureDir, validateMode, safeReadFile, safeWriteFile, safeJsonParse } from "./utils.js";

// Per-mode workflow state lives in .omg/state/<mode>-state.json (format unchanged since 1.0).

export interface ActiveMode {
  mode: string;
  phase?: string;
  updated_at?: string;
}

export function getStateDir(): string {
  return path.join(getWorkspaceRoot(), ".omg", "state");
}

export function getStatePath(mode: string): string {
  validateMode(mode);
  return path.join(getStateDir(), `${mode}-state.json`);
}

export function listStateFiles(): string[] {
  const stateDir = getStateDir();
  if (!fs.existsSync(stateDir)) return [];
  return fs.readdirSync(stateDir).filter((f) => f.endsWith("-state.json"));
}

function readStateFile(filePath: string): Record<string, unknown> | null {
  const raw = safeReadFile(filePath);
  if (!raw) return null;
  const parsed = safeJsonParse(raw);
  return parsed.ok ? parsed.data : null;
}

export function readState(mode: string): Record<string, unknown> | null {
  return readStateFile(getStatePath(mode));
}

/** Every state file (active or not), keyed by mode; corrupted files are skipped. */
export function readAllStates(): Array<{ mode: string; state: Record<string, unknown> }> {
  const stateDir = getStateDir();
  const all: Array<{ mode: string; state: Record<string, unknown> }> = [];
  for (const file of listStateFiles()) {
    const state = readStateFile(path.join(stateDir, file));
    if (state) all.push({ mode: file.replace("-state.json", ""), state });
  }
  return all;
}

export function writeState(mode: string, patch: Record<string, unknown>): Record<string, unknown> {
  ensureDir(getStateDir());
  const statePath = getStatePath(mode);
  const existing = readState(mode) ?? {};
  const next = { ...existing, ...patch, updated_at: new Date().toISOString() };
  safeWriteFile(statePath, JSON.stringify(next, null, 2));
  return next;
}

export function clearState(mode?: string): { cleared: string; files?: number } {
  const stateDir = getStateDir();
  if (mode) {
    const statePath = getStatePath(mode);
    if (fs.existsSync(statePath)) fs.unlinkSync(statePath);
    return { cleared: mode };
  }
  const files = listStateFiles();
  for (const file of files) fs.unlinkSync(path.join(stateDir, file));
  return { cleared: "all", files: files.length };
}

export function listActiveModes(): ActiveMode[] {
  const active: ActiveMode[] = [];
  for (const file of listStateFiles()) {
    const mode = file.replace("-state.json", "");
    const data = readState(mode);
    if (!data?.active) continue;
    active.push({
      mode,
      phase: String(data.current_phase || data.phase || "") || undefined,
      updated_at: typeof data.updated_at === "string" ? data.updated_at : undefined,
    });
  }
  return active;
}
