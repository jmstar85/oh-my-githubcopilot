import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";
import { getWorkspaceRoot, ensureDir, safeReadFile, safeWriteFile, safeJsonParse, errorResponse } from "./utils.js";
import { getStateDir } from "./state-tools.js";
import { readMemory } from "./memory-tools.js";

function getCheckpointPath(): string {
  return path.join(getStateDir(), "session-checkpoint.json");
}

function getContextBytesPath(): string {
  return path.join(getStateDir(), "context-bytes.txt");
}

function getTriggerPath(): string {
  return path.join(getStateDir(), "checkpoint-trigger.json");
}

export function registerCheckpointTools(server: McpServer): void {
  server.tool(
    "omg_checkpoint",
    "Save a structured session checkpoint. Captures active workflow state, recent memory entries, and modified files. Call this before major phase transitions or when context pressure is high.",
    {
      summary: z.string().optional().describe("Brief summary of current session progress"),
      key_decisions: z.array(z.string()).optional().describe("List of key decisions made in this session"),
    },
    async ({ summary, key_decisions }) => {
      const stateDir = getStateDir();
      ensureDir(stateDir);

      // Gather active modes
      const activeModes: Array<{ mode: string; state: Record<string, unknown> }> = [];
      if (fs.existsSync(stateDir)) {
        const files = fs.readdirSync(stateDir).filter((f) => f.endsWith("-state.json"));
        for (const file of files) {
          const raw = safeReadFile(path.join(stateDir, file));
          if (!raw) continue;
          const parsed = safeJsonParse(raw);
          if (!parsed.ok) continue;
          activeModes.push({
            mode: file.replace("-state.json", ""),
            state: parsed.data,
          });
        }
      }

      // Gather recent memory entries (last 10)
      const memStore = readMemory();
      const recentMemory = memStore.entries
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(0, 10)
        .map((e) => ({ key: e.key, value: e.value, category: e.category }));

      // Gather modified files
      const modFilesPath = path.join(stateDir, "modified-files.txt");
      let modifiedFiles: string[] = [];
      if (fs.existsSync(modFilesPath)) {
        modifiedFiles = fs.readFileSync(modFilesPath, "utf-8").trim().split("\n").filter(Boolean);
      }

      // Read context bytes estimate
      const bytesPath = getContextBytesPath();
      let contextBytes = 0;
      if (fs.existsSync(bytesPath)) {
        const raw = fs.readFileSync(bytesPath, "utf-8").trim();
        contextBytes = parseInt(raw, 10) || 0;
      }

      const checkpoint = {
        timestamp: new Date().toISOString(),
        summary: summary ?? null,
        key_decisions: key_decisions ?? [],
        active_modes: activeModes,
        recent_memory: recentMemory,
        modified_files: modifiedFiles,
        context_bytes_estimate: contextBytes,
        estimated_tokens: Math.round(contextBytes / 4),
      };

      safeWriteFile(getCheckpointPath(), JSON.stringify(checkpoint, null, 2));

      // Reset byte counter so the next accumulation cycle starts from 0
      const bytesResetPath = getContextBytesPath();
      if (fs.existsSync(bytesResetPath)) {
        safeWriteFile(bytesResetPath, "0");
      }

      // Clear the trigger if it exists
      const triggerPath = getTriggerPath();
      if (fs.existsSync(triggerPath)) {
        fs.unlinkSync(triggerPath);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              checkpoint_saved: getCheckpointPath(),
              active_modes: activeModes.length,
              memory_entries: recentMemory.length,
              modified_files: modifiedFiles.length,
              estimated_tokens: checkpoint.estimated_tokens,
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_restore_checkpoint",
    "Read the last session checkpoint. Use this at the start of a session or after context compaction to restore working state.",
    {},
    async () => {
      const data = safeReadFile(getCheckpointPath());
      if (!data) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ exists: false, message: "No checkpoint found" }),
            },
          ],
        };
      }

      return {
        content: [{ type: "text" as const, text: data }],
      };
    }
  );

  server.tool(
    "omg_context_status",
    "Check estimated context window usage based on accumulated tool I/O bytes.",
    {},
    async () => {
      const bytesPath = getContextBytesPath();
      let contextBytes = 0;
      if (fs.existsSync(bytesPath)) {
        const raw = fs.readFileSync(bytesPath, "utf-8").trim();
        contextBytes = parseInt(raw, 10) || 0;
      }

      const threshold = parseInt(process.env.OMG_CONTEXT_THRESHOLD || "400000", 10);
      const estimatedTokens = Math.round(contextBytes / 4);
      const percentUsed = Math.min(100, Math.round((contextBytes / threshold) * 100));

      const triggerPath = getTriggerPath();
      const checkpointDue = fs.existsSync(triggerPath);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              context_bytes: contextBytes,
              threshold_bytes: threshold,
              estimated_tokens: estimatedTokens,
              percent_used: percentUsed,
              checkpoint_due: checkpointDue,
              recommendation:
                percentUsed >= 90
                  ? "CRITICAL: Call omg_checkpoint immediately"
                  : percentUsed >= 70
                    ? "HIGH: Consider calling omg_checkpoint soon"
                    : "OK: Context pressure is manageable",
            }),
          },
        ],
      };
    }
  );
}
