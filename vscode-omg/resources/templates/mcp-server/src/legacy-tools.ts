import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readState, writeState, clearState, listActiveModes } from "./state-tools.js";
import { readPrd, createPrd, setStoryPasses, nextOpenStory, prdSummary } from "./prd-tools.js";
import { advancePhase, getPhaseInfo, AUTOPILOT_PHASES } from "./workflow-tools.js";
import { getMemoryEntries, searchMemory, setMemory, deleteMemory } from "./memory-tools.js";
import { readCheckpoint, getContextStatus } from "./checkpoint-tools.js";
import { createUltragoalGoal, getUltragoalStatus, checkpointUltragoal, completeUltragoal } from "./ultragoal-tools.js";
import { registerModelRouter } from "./model-router.js";
import { registerBridgeTools } from "./bridge/tools.js";
import { safeJsonParse, jsonResponse, errorResponse, deprecated } from "./utils.js";

/**
 * 1.4 tool names, registered only when OMG_LEGACY_TOOLS=1. Each adapter delegates to the
 * helpers behind the 1.5 tools and returns the 1.4 result shape. Removed in 2.0.
 * (`omg_check_completion` is unchanged and `omg_checkpoint` is registered with a lenient schema
 * by registerCheckpointTools when legacy mode is on.)
 */
export const LEGACY_TOOL_NAMES = [
  "omg_read_state",
  "omg_write_state",
  "omg_clear_state",
  "omg_list_active",
  "omg_read_prd",
  "omg_create_prd",
  "omg_update_story",
  "omg_verify_story",
  "omg_next_phase",
  "omg_get_phase_info",
  "omg_read_memory",
  "omg_search_memory",
  "omg_write_memory",
  "omg_delete_memory",
  "omg_restore_checkpoint",
  "omg_context_status",
  "omg_select_model",
  "omg_detect_external_session",
  "omg_import_external_session",
  "omg_export_external_session",
  "omg_compare_checkpoints",
  "omg_ultragoal_create",
  "omg_ultragoal_status",
  "omg_ultragoal_checkpoint",
  "omg_ultragoal_complete",
] as const;

function guard<A extends unknown[]>(name: string, fn: (...args: A) => unknown) {
  return deprecated(name, async (...args: A) => {
    try {
      return jsonResponse(await fn(...args));
    } catch (err) {
      return errorResponse((err as Error).message);
    }
  });
}

export function registerLegacyTools(server: McpServer): void {
  // ── state ──
  server.tool(
    "omg_read_state",
    "[deprecated → omg_read scope=state] Read the state for an OMG mode.",
    { mode: z.string() },
    guard("omg_read_state", ({ mode }) => readState(mode) ?? { active: false, mode, message: "No state found" })
  );

  server.tool(
    "omg_write_state",
    "[deprecated → omg_write scope=state op=set] Merge a JSON string into an OMG mode's state.",
    { mode: z.string(), state: z.string() },
    guard("omg_write_state", ({ mode, state }) => {
      const parsed = safeJsonParse(state);
      if (!parsed.ok) throw new Error(parsed.error);
      return { success: true, mode, state: writeState(mode, parsed.data) };
    })
  );

  server.tool(
    "omg_clear_state",
    "[deprecated → omg_write scope=state op=clear] Clear state for one mode or all modes.",
    { mode: z.string().optional() },
    guard("omg_clear_state", ({ mode }) => ({ success: true, ...clearState(mode) }))
  );

  server.tool(
    "omg_list_active",
    "[deprecated → omg_read scope=state] List active OMG modes.",
    {},
    guard("omg_list_active", () => ({ active_modes: listActiveModes() }))
  );

  // ── prd ──
  server.tool(
    "omg_read_prd",
    "[deprecated → omg_read scope=prd] Read the PRD summary.",
    {},
    guard("omg_read_prd", () => {
      const prd = readPrd();
      return prd ? prdSummary(prd) : { exists: false, message: "No PRD found. Create one with ralph or omg-autopilot." };
    })
  );

  server.tool(
    "omg_create_prd",
    "[deprecated → omg_write scope=prd op=set] Create a PRD.",
    {
      title: z.string(),
      description: z.string().optional(),
      stories: z
        .array(
          z.object({
            id: z.string().optional(),
            title: z.string(),
            description: z.string().optional(),
            acceptance_criteria: z.array(z.string()).optional(),
            priority: z.number().optional(),
          })
        )
        .optional(),
    },
    guard("omg_create_prd", ({ title, description, stories }) => {
      const prd = createPrd(title, description, stories ?? []);
      return { success: true, title: prd.title, stories_created: prd.stories.length };
    })
  );

  server.tool(
    "omg_update_story",
    "[deprecated → omg_verify target=story / omg_write scope=story] Set a story's passes flag (1.4 permissive semantics).",
    { story_id: z.string(), passes: z.boolean(), evidence: z.string().optional() },
    guard("omg_update_story", ({ story_id, passes, evidence }) => {
      const { prd } = setStoryPasses(story_id, passes, evidence);
      return {
        success: true,
        story_id,
        passes,
        total_passing: prd.stories.filter((s) => s.passes).length,
        total_stories: prd.stories.length,
      };
    })
  );

  server.tool(
    "omg_verify_story",
    "[deprecated → omg_read scope=prd] Get the next unverified story.",
    {},
    guard("omg_verify_story", () => {
      const prd = readPrd();
      if (!prd) return { exists: false, message: "No PRD found" };
      const { story, remaining } = nextOpenStory(prd);
      if (!story) return { all_passing: true, message: "All stories pass. PRD is complete.", total_stories: prd.stories.length };
      return {
        story: {
          id: story.id,
          title: story.title,
          description: story.description,
          acceptance_criteria: story.acceptance_criteria,
          priority: story.priority,
        },
        remaining,
        total: prd.stories.length,
      };
    })
  );

  // ── workflow ──
  server.tool(
    "omg_next_phase",
    "[deprecated → omg_write scope=phase op=advance] Advance omg-autopilot to the next phase.",
    { current_phase: z.number(), skip_reason: z.string().optional() },
    guard("omg_next_phase", ({ current_phase, skip_reason }) => advancePhase(current_phase, skip_reason))
  );

  server.tool(
    "omg_get_phase_info",
    "[deprecated → omg_read scope=phase] Get omg-autopilot phase info.",
    { phase: z.number().optional() },
    guard("omg_get_phase_info", ({ phase }) => {
      if (phase === undefined) return { phases: AUTOPILOT_PHASES };
      try {
        return getPhaseInfo(phase);
      } catch (err) {
        return { error: (err as Error).message };
      }
    })
  );

  // ── memory ──
  server.tool(
    "omg_read_memory",
    "[deprecated → omg_memory op=get] Read project memory entries.",
    { category: z.string().optional(), key: z.string().optional() },
    guard("omg_read_memory", ({ category, key }) => getMemoryEntries({ category, key }))
  );

  server.tool(
    "omg_search_memory",
    "[deprecated → omg_memory op=search] Search project memory.",
    { query: z.string(), category: z.string().optional(), limit: z.number().optional() },
    guard("omg_search_memory", ({ query, category, limit }) => searchMemory(query, { category, limit }))
  );

  server.tool(
    "omg_write_memory",
    "[deprecated → omg_memory op=set] Write a project memory entry.",
    { key: z.string(), value: z.string(), category: z.string().optional(), tags: z.array(z.string()).optional() },
    guard("omg_write_memory", ({ key, value, category, tags }) => setMemory(key, value, { category: category ?? "project", tags: tags ?? [] }))
  );

  server.tool(
    "omg_delete_memory",
    "[deprecated → omg_memory op=delete] Delete a project memory entry.",
    { key: z.string() },
    guard("omg_delete_memory", ({ key }) => deleteMemory(key))
  );

  // ── checkpoint ──
  server.tool(
    "omg_restore_checkpoint",
    "[deprecated → omg_read scope=checkpoint] Read the last session checkpoint.",
    {},
    guard("omg_restore_checkpoint", () => readCheckpoint() ?? { exists: false, message: "No checkpoint found" })
  );

  server.tool(
    "omg_context_status",
    "[deprecated → omg_read scope=checkpoint] Estimated context pressure.",
    {},
    guard("omg_context_status", () => getContextStatus())
  );

  // ── ultragoal ──
  server.tool(
    "omg_ultragoal_create",
    "[deprecated → omg_write scope=ultragoal op=set] Create the active ultragoal.",
    { objective: z.string() },
    guard("omg_ultragoal_create", ({ objective }) => ({ success: true, ultragoal: createUltragoalGoal(objective) }))
  );

  server.tool(
    "omg_ultragoal_status",
    "[deprecated → omg_read scope=ultragoal] Active ultragoal status and handoff text.",
    {},
    guard("omg_ultragoal_status", () => ({ success: true, ultragoal: getUltragoalStatus() }))
  );

  server.tool(
    "omg_ultragoal_checkpoint",
    "[deprecated → omg_write scope=ultragoal op=advance] Record ultragoal checkpoint evidence.",
    { goal_id: z.string(), evidence: z.string(), note: z.string().optional() },
    guard("omg_ultragoal_checkpoint", ({ goal_id, evidence, note }) => ({
      success: true,
      ultragoal: checkpointUltragoal(goal_id, evidence, note),
    }))
  );

  server.tool(
    "omg_ultragoal_complete",
    "[deprecated → omg_verify target=ultragoal] Complete the active ultragoal.",
    { goal_id: z.string(), evidence: z.string() },
    guard("omg_ultragoal_complete", ({ goal_id, evidence }) => ({ success: true, ultragoal: completeUltragoal(goal_id, evidence) }))
  );

  // ── removed features (no 1.5 replacement) ──
  registerModelRouter(server);
  registerBridgeTools(server);
}
