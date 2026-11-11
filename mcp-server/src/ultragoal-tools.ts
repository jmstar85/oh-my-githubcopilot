import * as path from "node:path";
import { getWorkspaceRoot, ensureDir, safeReadFile, safeWriteFile, generateId } from "./utils.js";

export type UltragoalStatus = "active" | "completed";

export interface UltragoalCheckpoint {
  id: string;
  goal_id: string;
  status: "checkpoint" | "completed";
  evidence: string;
  note?: string;
  created_at: string;
}

export interface UltragoalGoal {
  id: string;
  objective: string;
  status: UltragoalStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  checkpoints: UltragoalCheckpoint[];
}

export interface UltragoalLedger {
  version: 1;
  active_goal_id?: string;
  goals: UltragoalGoal[];
}

export interface UltragoalStatusResult {
  active: boolean;
  active_goal: UltragoalGoal | null;
  goals: UltragoalGoal[];
  handoff_text: string;
}

export function getUltragoalDir(): string {
  return path.join(getWorkspaceRoot(), ".omg", "ultragoal");
}

export function getUltragoalLedgerPath(): string {
  return path.join(getUltragoalDir(), "ledger.json");
}

function nowIso(): string {
  return new Date().toISOString();
}

function initialLedger(): UltragoalLedger {
  return { version: 1, goals: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseCheckpoint(value: unknown): UltragoalCheckpoint | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string") return null;
  if (typeof value.goal_id !== "string") return null;
  if (value.status !== "checkpoint" && value.status !== "completed") return null;
  if (typeof value.evidence !== "string") return null;
  if (typeof value.created_at !== "string") return null;
  if (value.note !== undefined && typeof value.note !== "string") return null;
  return {
    id: value.id,
    goal_id: value.goal_id,
    status: value.status,
    evidence: value.evidence,
    note: value.note,
    created_at: value.created_at,
  };
}

function parseGoal(value: unknown): UltragoalGoal | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string") return null;
  if (typeof value.objective !== "string") return null;
  if (value.status !== "active" && value.status !== "completed") return null;
  if (typeof value.created_at !== "string") return null;
  if (typeof value.updated_at !== "string") return null;
  if (value.completed_at !== undefined && typeof value.completed_at !== "string") return null;
  if (!Array.isArray(value.checkpoints)) return null;

  const checkpoints = value.checkpoints.map(parseCheckpoint);
  if (checkpoints.some((checkpoint) => checkpoint === null)) return null;

  return {
    id: value.id,
    objective: value.objective,
    status: value.status,
    created_at: value.created_at,
    updated_at: value.updated_at,
    completed_at: value.completed_at,
    checkpoints: checkpoints as UltragoalCheckpoint[],
  };
}

function parseLedger(raw: string): UltragoalLedger {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Malformed ultragoal ledger: invalid JSON");
  }

  if (!isRecord(parsed)) {
    throw new Error("Malformed ultragoal ledger: expected an object");
  }
  if (parsed.version !== 1) {
    throw new Error("Malformed ultragoal ledger: unsupported version");
  }
  if (parsed.active_goal_id !== undefined && typeof parsed.active_goal_id !== "string") {
    throw new Error("Malformed ultragoal ledger: active_goal_id must be a string");
  }
  if (!Array.isArray(parsed.goals)) {
    throw new Error("Malformed ultragoal ledger: goals must be an array");
  }

  const goals = parsed.goals.map(parseGoal);
  if (goals.some((goal) => goal === null)) {
    throw new Error("Malformed ultragoal ledger: invalid goal entry");
  }

  const ledger: UltragoalLedger = {
    version: 1,
    goals: goals as UltragoalGoal[],
  };
  if (parsed.active_goal_id !== undefined) {
    ledger.active_goal_id = parsed.active_goal_id;
  }
  return ledger;
}

export function readUltragoalLedger(): UltragoalLedger {
  const raw = safeReadFile(getUltragoalLedgerPath());
  if (!raw) return initialLedger();
  return parseLedger(raw);
}

function writeUltragoalLedger(ledger: UltragoalLedger): void {
  ensureDir(getUltragoalDir());
  safeWriteFile(getUltragoalLedgerPath(), `${JSON.stringify(ledger, null, 2)}\n`);
}

function buildHandoffText(activeGoal: UltragoalGoal | null): string {
  if (!activeGoal) {
    return 'No active ultragoal. Start one with omg_write scope:"ultragoal" op:"set" value:{objective} before using durable goal checkpoints.';
  }
  return [
    `Active ultragoal: ${activeGoal.objective}`,
    `Goal id: ${activeGoal.id}`,
    'Before stopping, call omg_read scope:"ultragoal" and preserve this goal in the task plan/TODO state.',
    'Record milestones with omg_write scope:"ultragoal" op:"advance" (concrete evidence); complete only via omg_verify target:"ultragoal".',
  ].join("\n");
}

export function getUltragoalStatus(): UltragoalStatusResult {
  const ledger = readUltragoalLedger();
  const activeGoal = ledger.active_goal_id
    ? ledger.goals.find((goal) => goal.id === ledger.active_goal_id && goal.status === "active") ?? null
    : null;
  return {
    active: activeGoal !== null,
    active_goal: activeGoal,
    goals: ledger.goals,
    handoff_text: buildHandoffText(activeGoal),
  };
}

export function createUltragoalGoal(objective: string): UltragoalStatusResult {
  const cleanObjective = objective.trim();
  if (!cleanObjective) {
    throw new Error("Ultragoal objective is required");
  }

  const ledger = readUltragoalLedger();
  const timestamp = nowIso();
  const goal: UltragoalGoal = {
    id: generateId(),
    objective: cleanObjective,
    status: "active",
    created_at: timestamp,
    updated_at: timestamp,
    checkpoints: [],
  };

  for (const existing of ledger.goals) {
    if (existing.status === "active") {
      existing.status = "completed";
      existing.completed_at = timestamp;
      existing.updated_at = timestamp;
      existing.checkpoints.push({
        id: generateId(),
        goal_id: existing.id,
        status: "completed",
        evidence: "Superseded by a newly created ultragoal.",
        created_at: timestamp,
      });
    }
  }

  ledger.goals.push(goal);
  ledger.active_goal_id = goal.id;
  writeUltragoalLedger(ledger);
  return getUltragoalStatus();
}

function requireEvidence(evidence: string): string {
  const cleanEvidence = evidence.trim();
  if (!cleanEvidence) {
    throw new Error("Checkpoint evidence is required");
  }
  return cleanEvidence;
}

function getActiveGoalOrThrow(ledger: UltragoalLedger, goalId: string): UltragoalGoal {
  const cleanGoalId = goalId.trim();
  if (!cleanGoalId) {
    throw new Error("Goal id is required");
  }
  const activeGoal = ledger.goals.find((goal) => goal.id === cleanGoalId && goal.status === "active");
  if (!activeGoal || ledger.active_goal_id !== cleanGoalId) {
    throw new Error(`Goal ${cleanGoalId} is not the active ultragoal`);
  }
  return activeGoal;
}

export function checkpointUltragoal(goalId: string, evidence: string, note?: string): UltragoalStatusResult {
  const cleanEvidence = requireEvidence(evidence);
  const ledger = readUltragoalLedger();
  const activeGoal = getActiveGoalOrThrow(ledger, goalId);
  const timestamp = nowIso();

  activeGoal.checkpoints.push({
    id: generateId(),
    goal_id: activeGoal.id,
    status: "checkpoint",
    evidence: cleanEvidence,
    note: note?.trim() || undefined,
    created_at: timestamp,
  });
  activeGoal.updated_at = timestamp;

  writeUltragoalLedger(ledger);
  return getUltragoalStatus();
}

export function completeUltragoal(goalId: string, evidence: string): UltragoalStatusResult {
  const cleanEvidence = requireEvidence(evidence);
  const ledger = readUltragoalLedger();
  const activeGoal = getActiveGoalOrThrow(ledger, goalId);
  const timestamp = nowIso();

  activeGoal.checkpoints.push({
    id: generateId(),
    goal_id: activeGoal.id,
    status: "completed",
    evidence: cleanEvidence,
    created_at: timestamp,
  });
  activeGoal.status = "completed";
  activeGoal.completed_at = timestamp;
  activeGoal.updated_at = timestamp;
  delete ledger.active_goal_id;

  writeUltragoalLedger(ledger);
  return getUltragoalStatus();
}