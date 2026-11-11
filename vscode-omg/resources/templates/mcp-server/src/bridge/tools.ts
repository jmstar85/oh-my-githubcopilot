import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { errorResponse, deprecated } from "../utils.js";
import {
  detectExternalSessions,
  importExternalSession,
  exportExternalSession,
  compareCheckpoints,
} from "./index.js";

export function registerBridgeTools(server: McpServer): void {
  server.tool(
    "omg_detect_external_session",
    "[deprecated, OMC bridge removed in 2.0] Detect Claude Code, OMC, or local OMG sessions in the current workspace. Returns metadata about available sessions for import (omc, claude-code) or export (omg). Use this at session start, before /resume-claude, or before /push-omc.",
    {},
    deprecated("omg_detect_external_session", async () => {
      try {
        const sessions = detectExternalSessions();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                found: sessions.length,
                sessions,
              }),
            },
          ],
        };
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }),
  );

  server.tool(
    "omg_import_external_session",
    "[deprecated, OMC bridge removed in 2.0] Import an external session (Claude Code or OMC) into OMG checkpoint format. Backs up existing checkpoint via rotating snapshots before overwriting. Use after omg_detect_external_session confirms an available session. Returns loop_blocked:true when the OMC checkpoint originated from this OMG instance via /push-omc (set force:true to bypass).",
    {
      source: z.enum(["omc", "claude-code"]).describe("Which external tool to import from"),
      force: z.boolean().optional().describe("Force import even if OMG checkpoint is newer or loop guard fires (default: false)"),
    },
    deprecated("omg_import_external_session", async ({ source, force }: { source: "omc" | "claude-code"; force?: boolean }) => {
      try {
        const result = importExternalSession(source, { force: force ?? false });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: !result.workspace_mismatch,
                source: result.source,
                imported_files: result.imported_files.length,
                conflicts: result.conflicts.length,
                session_id: result.session_id,
                summary: result.summary,
                loop_blocked: result.loop_blocked ?? false,
                workspace_mismatch: result.workspace_mismatch,
              }),
            },
          ],
        };
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }),
  );

  server.tool(
    "omg_export_external_session",
    "[deprecated, OMC bridge removed in 2.0] Export the local OMG session into an external target (currently only 'omc'). Composes .omc/state/session-checkpoint.json with bridged provenance, decomposes active_modes[] into per-mode .omc/state/{mode}-state.json files, copies prd.json and project-memory.json. Backs up existing destination files via rotating snapshots. The export token is written ONLY after a successful run (atomicity contract).",
    {
      target: z.enum(["omc"]).describe("Which external tool to export to"),
      force: z.boolean().optional().describe("Force export even if destination is newer (default: false)"),
    },
    deprecated("omg_export_external_session", async ({ target, force }: { target: "omc"; force?: boolean }) => {
      try {
        const result = exportExternalSession(target, { force: force ?? false });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: result.success,
                target: result.target,
                exported_files: result.exported_files.length,
                conflicts: result.conflicts.length,
                session_id: result.session_id,
                source_origin: result.source_origin,
                workspace_root: result.workspace_root,
                summary: result.summary,
                reason: result.reason,
                expected: result.expected,
                actual: result.actual,
              }),
            },
          ],
        };
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }),
  );

  server.tool(
    "omg_compare_checkpoints",
    "[deprecated, OMC bridge removed in 2.0] Compare timestamps between the current OMG checkpoint and any external sessions (Claude Code, OMC). Reports BOTH directions: newer_than_omg and omg_newer_than_external — supports both /resume-claude (import) and /push-omc (export) decisions.",
    {},
    deprecated("omg_compare_checkpoints", async () => {
      try {
        const comparison = compareCheckpoints();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(comparison),
            },
          ],
        };
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }),
  );
}
