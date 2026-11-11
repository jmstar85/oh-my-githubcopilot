import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readState, listActiveModes } from "./state-tools.js";
import { readPrd, findStory, nextOpenStory, prdSummary } from "./prd-tools.js";
import { getPhaseInfo } from "./workflow-tools.js";
import { getUltragoalStatus, readUltragoalLedger } from "./ultragoal-tools.js";
import { readCheckpoint, getContextStatus } from "./checkpoint-tools.js";
import { jsonResponse, errorResponse } from "./utils.js";

export const READ_SCOPES = ["state", "prd", "phase", "ultragoal", "checkpoint", "all"] as const;
export type ReadScope = (typeof READ_SCOPES)[number];

export function readStateScope(key?: string) {
  if (!key) return { active_modes: listActiveModes() };
  const state = readState(key);
  return state ?? { active: false, mode: key, message: "No state found" };
}

export function readPrdScope(key?: string) {
  const prd = readPrd();
  if (!prd) return { exists: false, message: "No PRD found. Create one with omg_write scope=prd op=set (ralph or omg-autopilot)." };
  if (key) return { exists: true, story: findStory(prd, key) };
  const next = nextOpenStory(prd);
  return {
    exists: true,
    ...prdSummary(prd),
    all_passing: next.story === null,
    next_story: next.story
      ? {
          id: next.story.id,
          title: next.story.title,
          description: next.story.description,
          acceptance_criteria: next.story.acceptance_criteria,
          priority: next.story.priority,
        }
      : null,
    remaining: next.remaining,
  };
}

export function readPhaseScope(key?: string) {
  if (key === undefined) return getPhaseInfo();
  const phase = Number(key);
  if (!Number.isInteger(phase)) throw new Error(`Invalid phase: ${key}. Valid: 0-5.`);
  return getPhaseInfo(phase);
}

export function readUltragoalScope(key?: string) {
  if (!key) return getUltragoalStatus();
  const goal = readUltragoalLedger().goals.find((g) => g.id === key);
  if (!goal) throw new Error(`Ultragoal ${key} not found`);
  return goal;
}

export function readCheckpointScope() {
  const checkpoint = readCheckpoint();
  return { exists: checkpoint !== null, checkpoint, context: getContextStatus() };
}

function minutesSince(iso: unknown): number | null {
  if (typeof iso !== "string") return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : Math.round((Date.now() - t) / 60000);
}

export function readAllScope() {
  const prd = readPrd();
  const next = prd ? nextOpenStory(prd) : null;
  let ultragoal: { id: string; objective: string; checkpoints: number } | { error: string } | null = null;
  try {
    const goal = getUltragoalStatus().active_goal;
    if (goal) ultragoal = { id: goal.id, objective: goal.objective, checkpoints: goal.checkpoints.length };
  } catch (err) {
    ultragoal = { error: (err as Error).message };
  }
  const checkpoint = readCheckpoint();
  const context = getContextStatus();
  return {
    active_modes: listActiveModes(),
    prd: prd
      ? {
          title: prd.title,
          total_stories: prd.stories.length,
          passing: prd.stories.filter((s) => s.passes).length,
          open_stories: prd.stories.filter((s) => !s.passes).map((s) => s.id),
          next_story_id: next?.story?.id ?? null,
        }
      : null,
    ultragoal,
    checkpoint: checkpoint
      ? {
          timestamp: checkpoint.timestamp ?? null,
          age_minutes: minutesSince(checkpoint.timestamp),
          summary: checkpoint.summary ?? null,
        }
      : null,
    context: { percent_used: context.percent_used, checkpoint_due: context.checkpoint_due },
  };
}

export function readScope(scope: ReadScope, key?: string) {
  switch (scope) {
    case "state":
      return readStateScope(key);
    case "prd":
      return readPrdScope(key);
    case "phase":
      return readPhaseScope(key);
    case "ultragoal":
      return readUltragoalScope(key);
    case "checkpoint":
      return readCheckpointScope();
    case "all":
      return readAllScope();
  }
}

export function registerReadTools(server: McpServer): void {
  server.tool(
    "omg_read",
    "Read .omg/ state. scope: state (key=mode; omit=active modes) | prd (key=story id; else summary + next open story) | phase (key=number; else all) | ultragoal (key=goal id; else active goal + handoff) | checkpoint (last checkpoint + context pressure) | all (compact summary).",
    {
      scope: z.enum(READ_SCOPES),
      key: z.string().optional(),
    },
    async ({ scope, key }) => {
      try {
        return jsonResponse(readScope(scope, key));
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }
  );
}
