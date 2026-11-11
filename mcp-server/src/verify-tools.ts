import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { markStoryVerified } from "./prd-tools.js";
import { completeUltragoal } from "./ultragoal-tools.js";
import { jsonResponse, errorResponse } from "./utils.js";

export interface EvidenceItem {
  command: string;
  output_excerpt: string;
  passed: boolean;
}

/**
 * Fail-closed evidence check: every item must have run (non-blank command and output) and passed.
 * Throws before anything is written.
 */
export function validateEvidence(evidence: EvidenceItem[] | undefined): EvidenceItem[] {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    throw new Error("Verification rejected: evidence is empty. Provide at least one {command, output_excerpt, passed:true} item.");
  }
  evidence.forEach((item, i) => {
    if (!item.command?.trim()) throw new Error(`Verification rejected: evidence[${i}].command is blank`);
    if (!item.output_excerpt?.trim()) throw new Error(`Verification rejected: evidence[${i}].output_excerpt is blank`);
    if (item.passed !== true) throw new Error(`Verification rejected: evidence[${i}] (${item.command}) did not pass`);
  });
  return evidence;
}

export function renderEvidence(evidence: EvidenceItem[]): string {
  return evidence.map((e) => `$ ${e.command}\n${e.output_excerpt.trim()}\n→ passed`).join("\n\n");
}

export function verifyStory(id: string, evidence: EvidenceItem[]) {
  const text = renderEvidence(validateEvidence(evidence));
  const { story, prd } = markStoryVerified(id, text);
  return {
    success: true,
    target: "story" as const,
    id: story.id,
    passes: true,
    verified_at: story.verified_at,
    total_passing: prd.stories.filter((s) => s.passes).length,
    total_stories: prd.stories.length,
  };
}

export function verifyUltragoal(id: string, evidence: EvidenceItem[]) {
  const text = renderEvidence(validateEvidence(evidence));
  return { success: true, target: "ultragoal" as const, id, ultragoal: completeUltragoal(id, text) };
}

export function registerVerifyTools(server: McpServer): void {
  server.tool(
    "omg_verify",
    "Record verification evidence (fail-closed). story: sets PRD story passes=true; ultragoal: completes the active goal. Rejected unless evidence is non-empty and every item passed with non-blank command/output_excerpt.",
    {
      target: z.enum(["story", "ultragoal"]),
      id: z.string(),
      evidence: z.array(
        z.object({
          command: z.string(),
          output_excerpt: z.string(),
          passed: z.boolean(),
        })
      ),
    },
    async ({ target, id, evidence }) => {
      try {
        if (!id.trim()) return errorResponse("id is required");
        return jsonResponse(target === "story" ? verifyStory(id.trim(), evidence) : verifyUltragoal(id.trim(), evidence));
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }
  );
}
