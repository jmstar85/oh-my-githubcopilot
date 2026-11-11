import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { writeState, clearState } from "./state-tools.js";
import { createPrd, clearPrd, upsertStory, removeStory, type StoryInput } from "./prd-tools.js";
import { advancePhase } from "./workflow-tools.js";
import { createUltragoalGoal, checkpointUltragoal } from "./ultragoal-tools.js";
import { jsonResponse, errorResponse } from "./utils.js";

export const WRITE_SCOPES = ["state", "prd", "story", "phase", "ultragoal"] as const;
export const WRITE_OPS = ["set", "clear", "advance"] as const;
export type WriteScope = (typeof WRITE_SCOPES)[number];
export type WriteOp = (typeof WRITE_OPS)[number];

type Value = Record<string, unknown> | undefined;

const SUPPORTED: Record<WriteScope, WriteOp[]> = {
  state: ["set", "clear"],
  prd: ["set", "clear"],
  story: ["set", "clear"],
  phase: ["advance"],
  ultragoal: ["set", "advance"],
};

function requireKey(key: string | undefined, what: string): string {
  if (!key?.trim()) throw new Error(`${what} is required (key)`);
  return key.trim();
}

function requireValue(value: Value, what: string): Record<string, unknown> {
  if (!value || typeof value !== "object") throw new Error(`${what} is required (value)`);
  return value;
}

function optString(v: unknown, name: string): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v !== "string") throw new Error(`${name} must be a string`);
  return v;
}

function optNumber(v: unknown, name: string): number | undefined {
  if (v === undefined) return undefined;
  if (typeof v !== "number" || Number.isNaN(v)) throw new Error(`${name} must be a number`);
  return v;
}

function optStringArray(v: unknown, name: string): string[] | undefined {
  if (v === undefined) return undefined;
  if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) throw new Error(`${name} must be an array of strings`);
  return v as string[];
}

function parseStories(v: unknown): StoryInput[] {
  if (v === undefined) return [];
  if (!Array.isArray(v)) throw new Error("stories must be an array");
  return v.map((raw, i) => {
    if (!raw || typeof raw !== "object") throw new Error(`stories[${i}] must be an object`);
    const s = raw as Record<string, unknown>;
    const title = optString(s.title, `stories[${i}].title`);
    if (!title?.trim()) throw new Error(`stories[${i}].title is required`);
    return {
      id: optString(s.id, `stories[${i}].id`),
      title,
      description: optString(s.description, `stories[${i}].description`),
      acceptance_criteria: optStringArray(s.acceptance_criteria, `stories[${i}].acceptance_criteria`),
      priority: optNumber(s.priority, `stories[${i}].priority`),
    };
  });
}

export function writeScope(scope: WriteScope, op: WriteOp, key?: string, value?: Value) {
  if (!SUPPORTED[scope].includes(op)) {
    throw new Error(`Unsupported op "${op}" for scope "${scope}". Supported: ${SUPPORTED[scope].join(", ")}`);
  }

  switch (scope) {
    case "state": {
      if (op === "clear") return { success: true, ...clearState(key?.trim() || undefined) };
      const mode = requireKey(key, "mode");
      const state = writeState(mode, requireValue(value, "state"));
      return { success: true, mode, state };
    }

    case "prd": {
      if (op === "clear") return { success: true, cleared: "prd", deleted: clearPrd() };
      const v = requireValue(value, "prd");
      const title = optString(v.title, "title");
      if (!title?.trim()) throw new Error("title is required");
      const prd = createPrd(title, optString(v.description, "description"), parseStories(v.stories));
      return { success: true, title: prd.title, stories_created: prd.stories.length };
    }

    case "story": {
      const id = requireKey(key, "story id");
      if (op === "clear") {
        const { deleted, prd } = removeStory(id);
        return { success: true, deleted, story_id: id, total_stories: prd.stories.length };
      }
      const v = requireValue(value, "story");
      if (v.passes === true) {
        throw new Error('passes:true requires evidence. Use omg_verify target:"story" instead.');
      }
      if (v.passes !== undefined && v.passes !== false) throw new Error("passes must be false when provided");
      const { story, created, prd } = upsertStory(id, {
        title: optString(v.title, "title"),
        description: optString(v.description, "description"),
        acceptance_criteria: optStringArray(v.acceptance_criteria, "acceptance_criteria"),
        priority: optNumber(v.priority, "priority"),
        passes: v.passes as false | undefined,
      });
      return {
        success: true,
        story_id: story.id,
        action: created ? "created" : "updated",
        passes: story.passes,
        total_passing: prd.stories.filter((s) => s.passes).length,
        total_stories: prd.stories.length,
      };
    }

    case "phase": {
      const v = value ?? {};
      return advancePhase(optNumber(v.current_phase, "current_phase"), optString(v.skip_reason, "skip_reason"));
    }

    case "ultragoal": {
      const v = requireValue(value, op === "set" ? "objective" : "evidence");
      if (op === "set") {
        const objective = optString(v.objective, "objective");
        if (!objective?.trim()) throw new Error("objective is required");
        return { success: true, ultragoal: createUltragoalGoal(objective) };
      }
      const goalId = requireKey(key, "goal id");
      const evidence = optString(v.evidence, "evidence");
      if (!evidence?.trim()) throw new Error("evidence is required");
      return { success: true, ultragoal: checkpointUltragoal(goalId, evidence, optString(v.note, "note")) };
    }
  }
}

export function registerWriteTools(server: McpServer): void {
  server.tool(
    "omg_write",
    "Write .omg/ state. scope op: state set (key=mode, value merged) | state clear (key; omit=all) | prd set (value={title,description?,stories[]}) | prd clear | story set (key=id, value={title?,description?,acceptance_criteria?,priority?,passes:false}; upserts; passes:true only via omg_verify) | story clear (key) | phase advance (value={current_phase?,skip_reason?}) | ultragoal set (value={objective}) | ultragoal advance (key=goal id, value={evidence,note?}).",
    {
      scope: z.enum(WRITE_SCOPES),
      op: z.enum(WRITE_OPS),
      key: z.string().optional(),
      value: z.record(z.string(), z.unknown()).optional(),
    },
    async ({ scope, op, key, value }) => {
      try {
        return jsonResponse(writeScope(scope, op, key, value));
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }
  );
}
