import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getStatePath, readState, readAllStates } from "./state-tools.js";
import { readPrd } from "./prd-tools.js";
import { getUltragoalStatus } from "./ultragoal-tools.js";
import { safeWriteFile, jsonResponse, errorResponse } from "./utils.js";

export const AUTOPILOT_PHASES = [
  { phase: 0, name: "expansion", description: "Requirements analysis and spec generation" },
  { phase: 1, name: "planning", description: "Implementation plan creation" },
  { phase: 2, name: "execution", description: "Code implementation" },
  { phase: 3, name: "qa", description: "Build, lint, and test verification" },
  { phase: 4, name: "validation", description: "Code review and security review" },
  { phase: 5, name: "cleanup", description: "State cleanup and completion" },
];

export function getPhaseInfo(phase?: number) {
  if (phase === undefined) {
    const state = readState("omg-autopilot");
    const current = typeof state?.current_phase === "number" ? state.current_phase : null;
    return { phases: AUTOPILOT_PHASES, current_phase: current, active: Boolean(state?.active) };
  }
  const info = AUTOPILOT_PHASES[phase];
  if (!info) throw new Error(`Invalid phase: ${phase}. Valid: 0-5.`);
  return info;
}

export type AdvanceResult =
  | { success: true; completed: true; message: string }
  | { success: true; phase: number; name: string; description: string };

/** Advances omg-autopilot to the next phase. `currentPhase`, when given, must match the persisted phase. */
export function advancePhase(currentPhase?: number, skipReason?: string): AdvanceResult {
  const state = readState("omg-autopilot");
  if (!state) throw new Error("No omg-autopilot state found. Start with /omg-autopilot.");

  const persistedPhase = typeof state.current_phase === "number" ? state.current_phase : 0;
  if (currentPhase !== undefined && currentPhase !== persistedPhase) {
    throw new Error(`Phase mismatch: persisted state is at phase ${persistedPhase}, caller claimed ${currentPhase}`);
  }

  const statePath = getStatePath("omg-autopilot");
  const now = new Date().toISOString();
  const nextPhase = persistedPhase + 1;

  if (nextPhase > 5) {
    state.active = false;
    state.completed = true;
    state.completed_at = now;
    state.current_phase = 5;
    state.updated_at = now;
    safeWriteFile(statePath, JSON.stringify(state, null, 2));
    return { success: true, completed: true, message: "OMG Autopilot workflow complete." };
  }

  const phaseInfo = AUTOPILOT_PHASES[nextPhase];
  state.current_phase = nextPhase;
  state.phase_name = phaseInfo.name;
  state.phase_started_at = now;
  state.updated_at = now;
  if (skipReason) state.skip_reason = skipReason;
  safeWriteFile(statePath, JSON.stringify(state, null, 2));
  return { success: true, phase: nextPhase, name: phaseInfo.name, description: phaseInfo.description };
}

function describeRemaining(mode: string, data: Record<string, unknown>): string {
  if (mode === "omg-autopilot") {
    const phase = typeof data.current_phase === "number" ? data.current_phase : 0;
    return `omg-autopilot: phase ${phase}/5 (${AUTOPILOT_PHASES[phase]?.name})`;
  }
  if (mode === "ralph") return "ralph: persistence loop active";
  if (mode === "team") return `team: ${String(data.current_phase || "active")}`;
  if (mode === "ultraqa") return `ultraqa: cycle ${String(data.current_cycle || "?")}/5`;
  return `${mode}: active`;
}

export function checkCompletion(mode?: string) {
  const remaining: string[] = [];
  const states = mode ? [{ mode, state: readState(mode) }] : readAllStates();
  for (const { mode: m, state } of states) {
    if (!state?.active) continue;
    if (m === "omg-autopilot") {
      const phase = typeof state.current_phase === "number" ? state.current_phase : 0;
      if (phase >= 5) continue;
    }
    remaining.push(describeRemaining(m, state));
  }

  const prd = readPrd();
  const unverified = prd ? prd.stories.filter((s) => !s.passes).map((s) => s.id) : [];

  let ultragoal: { id: string; objective: string } | null = null;
  try {
    const goal = getUltragoalStatus().active_goal;
    if (goal) ultragoal = { id: goal.id, objective: goal.objective };
  } catch {
    // Malformed ledger is reported by omg_read scope=ultragoal; it must not break the gate.
  }

  const allowStop = remaining.length === 0;
  return {
    allow_stop: allowStop,
    complete: allowStop,
    remaining,
    unverified,
    ultragoal,
    message: allowStop
      ? "All tasks complete. Safe to stop."
      : `${remaining.length} active workflow(s). Continue working.`,
  };
}

export function registerWorkflowTools(server: McpServer): void {
  server.tool(
    "omg_check_completion",
    "Completion gate: active workflows (allow_stop=false while any remain), unverified PRD stories, active ultragoal. Call before stopping.",
    {
      mode: z.string().optional().describe("Mode to check; default: all active modes."),
    },
    async ({ mode }) => {
      try {
        return jsonResponse(checkCompletion(mode));
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }
  );
}
