import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";
import { getWorkspaceRoot, ensureDir, safeReadFile, safeWriteFile, safeJsonParse, jsonResponse, errorResponse } from "./utils.js";
import { getStateDir, readAllStates } from "./state-tools.js";
import { readMemory } from "./memory-tools.js";
import type { SourceOrigin } from "./bridge/conflict-utils.js";

// Checkpoint lives in .omg/state/session-checkpoint.json (format unchanged since 1.3; read by the OMC bridge).

export function getCheckpointPath(): string {
  return path.join(getStateDir(), "session-checkpoint.json");
}

function getContextBytesPath(): string {
  return path.join(getStateDir(), "context-bytes.txt");
}

function getTriggerPath(): string {
  return path.join(getStateDir(), "checkpoint-trigger.json");
}

function readContextBytes(): number {
  const bytesPath = getContextBytesPath();
  if (!fs.existsSync(bytesPath)) return 0;
  return parseInt(fs.readFileSync(bytesPath, "utf-8").trim(), 10) || 0;
}

export function readCheckpoint(): Record<string, unknown> | null {
  const raw = safeReadFile(getCheckpointPath());
  if (!raw) return null;
  const parsed = safeJsonParse(raw);
  return parsed.ok ? parsed.data : null;
}

/** Context pressure estimated from the tool I/O bytes accumulated by the hooks. */
export function getContextStatus() {
  const contextBytes = readContextBytes();
  const threshold = parseInt(process.env.OMG_CONTEXT_THRESHOLD || "400000", 10);
  const percentUsed = Math.min(100, Math.round((contextBytes / threshold) * 100));
  return {
    context_bytes: contextBytes,
    threshold_bytes: threshold,
    estimated_tokens: Math.round(contextBytes / 4),
    percent_used: percentUsed,
    checkpoint_due: fs.existsSync(getTriggerPath()),
    recommendation:
      percentUsed >= 90
        ? "CRITICAL: Call omg_checkpoint immediately"
        : percentUsed >= 70
          ? "HIGH: Consider calling omg_checkpoint soon"
          : "OK: Context pressure is manageable",
  };
}

export interface CheckpointInput {
  summary?: string;
  decisions?: string[];
  modified_files?: string[];
}

export function saveCheckpoint(input: CheckpointInput) {
  const stateDir = getStateDir();
  ensureDir(stateDir);

  const activeModes = readAllStates();

  const recentMemory = readMemory()
    .entries.sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 10)
    .map((e) => ({ key: e.key, value: e.value, category: e.category }));

  const modFilesPath = path.join(stateDir, "modified-files.txt");
  const trackedFiles = fs.existsSync(modFilesPath)
    ? fs.readFileSync(modFilesPath, "utf-8").trim().split("\n").filter(Boolean)
    : [];
  const modifiedFiles = [...new Set([...trackedFiles, ...(input.modified_files ?? [])])];

  const contextBytes = readContextBytes();
  const checkpoint = {
    timestamp: new Date().toISOString(),
    summary: input.summary ?? null,
    key_decisions: input.decisions ?? [],
    active_modes: activeModes,
    recent_memory: recentMemory,
    modified_files: modifiedFiles,
    context_bytes_estimate: contextBytes,
    estimated_tokens: Math.round(contextBytes / 4),
    source_tool: "copilot" as const,
    source_origin: "native" as SourceOrigin,
    source_session_id: null as string | null,
    imported_at: null as string | null,
    imported_summary: null as string | null,
    workspace_root: getWorkspaceRoot(),
  };

  safeWriteFile(getCheckpointPath(), JSON.stringify(checkpoint, null, 2));

  // Reset the hooks' byte counter and clear the advisory trigger.
  if (fs.existsSync(getContextBytesPath())) safeWriteFile(getContextBytesPath(), "0");
  if (fs.existsSync(getTriggerPath())) fs.unlinkSync(getTriggerPath());

  return {
    success: true,
    checkpoint_saved: getCheckpointPath(),
    active_modes: activeModes.length,
    memory_entries: recentMemory.length,
    modified_files: modifiedFiles.length,
    estimated_tokens: checkpoint.estimated_tokens,
    handoff_text: buildHandoffText(checkpoint),
  };
}

/** Skeleton for the next-session prompt required by the 50% session-budget rule. */
function buildHandoffText(cp: { summary: string | null; key_decisions: string[]; active_modes: Array<{ mode: string }>; modified_files: string[] }): string {
  const lines = [
    `Resume OMG session (checkpoint saved; at start call omg_read scope:"checkpoint").`,
    `Summary: ${cp.summary ?? "(none)"}`,
  ];
  if (cp.key_decisions.length) lines.push(`Decisions: ${cp.key_decisions.join("; ")}`);
  if (cp.active_modes.length) lines.push(`Active modes: ${cp.active_modes.map((m) => m.mode).join(", ")}`);
  if (cp.modified_files.length) lines.push(`Modified files: ${cp.modified_files.join(", ")}`);
  lines.push("Next step: <fill in the exact next action before handing off>");
  return lines.join("\n");
}

export function registerCheckpointTools(server: McpServer, legacy = false): void {
  const description =
    "Save a session checkpoint; returns handoff_text for the next session. Call on a checkpoint advisory, before phase transitions, or at 50% context. Restore: omg_read scope=checkpoint.";

  if (legacy) {
    // Lenient schema: accepts the 1.4 parameters (optional summary, key_decisions) as well as the 1.5 ones.
    server.tool(
      "omg_checkpoint",
      description,
      {
        summary: z.string().optional(),
        decisions: z.array(z.string()).optional(),
        key_decisions: z.array(z.string()).optional(),
        modified_files: z.array(z.string()).optional(),
      },
      async ({ summary, decisions, key_decisions, modified_files }) => {
        try {
          return jsonResponse(saveCheckpoint({ summary, decisions: decisions ?? key_decisions, modified_files }));
        } catch (err) {
          return errorResponse((err as Error).message);
        }
      }
    );
    return;
  }

  server.tool(
    "omg_checkpoint",
    description,
    {
      summary: z.string(),
      decisions: z.array(z.string()).optional(),
      modified_files: z.array(z.string()).optional(),
    },
    async ({ summary, decisions, modified_files }) => {
      try {
        if (!summary.trim()) return errorResponse("summary is required");
        return jsonResponse(saveCheckpoint({ summary, decisions, modified_files }));
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }
  );
}
