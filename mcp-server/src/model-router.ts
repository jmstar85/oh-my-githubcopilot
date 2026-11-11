import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { deprecated } from "./utils.js";

interface ModelRecommendation {
  recommended_model: string;
  tier: string;
  reason: string;
  alternatives: string[];
}

const MODELS = {
  opus47: "Claude Opus 4.7 (copilot)",
  opus46: "Claude Opus 4.6 (copilot)",
  gpt55: "GPT-5.5 (copilot)",
  sonnet46: "Claude Sonnet 4.6 (copilot)",
} as const;

const OPUS_47_AGENTS = new Set([
  "analyst",
  "architect",
  "code-reviewer",
  "critic",
  "omg-coordinator",
  "planner",
  "security-reviewer",
]);

const GPT_55_AGENTS = new Set([
  "csharp-reviewer",
  "database-reviewer",
  "debugger",
  "designer",
  "document-specialist",
  "go-reviewer",
  "java-reviewer",
  "python-reviewer",
  "rust-reviewer",
  "scientist",
  "swift-reviewer",
  "test-engineer",
  "tracer",
  "typescript-reviewer",
  "verifier",
]);

const SONNET_46_AGENTS = new Set([
  "code-simplifier",
  "executor",
  "explore",
  "git-master",
  "qa-tester",
  "writer",
]);

const COMPLEXITY_THRESHOLDS = {
  high: {
    file_count: 10,
    description_length: 500,
    keywords: [
      "architect", "design", "refactor", "migrate", "security",
      "performance", "optimize", "complex", "critical", "system",
    ],
  },
  medium: {
    file_count: 5,
    description_length: 200,
    keywords: [
      "implement", "add", "update", "feature", "component",
      "module", "service", "test", "debug",
    ],
  },
};

function assessComplexity(
  task: string,
  file_count?: number
): { tier: "high" | "medium" | "low"; score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];
  const taskLower = task.toLowerCase();

  // Check high-complexity keywords
  for (const kw of COMPLEXITY_THRESHOLDS.high.keywords) {
    if (taskLower.includes(kw)) {
      score += 3;
      factors.push(`high-complexity keyword: "${kw}"`);
    }
  }

  // Check medium-complexity keywords
  for (const kw of COMPLEXITY_THRESHOLDS.medium.keywords) {
    if (taskLower.includes(kw)) {
      score += 1;
      factors.push(`medium-complexity keyword: "${kw}"`);
    }
  }

  // File count factor
  if (file_count !== undefined) {
    if (file_count >= COMPLEXITY_THRESHOLDS.high.file_count) {
      score += 5;
      factors.push(`high file count: ${file_count}`);
    } else if (file_count >= COMPLEXITY_THRESHOLDS.medium.file_count) {
      score += 2;
      factors.push(`moderate file count: ${file_count}`);
    }
  }

  // Description length factor
  if (task.length >= COMPLEXITY_THRESHOLDS.high.description_length) {
    score += 2;
    factors.push("long task description");
  }

  const tier = score >= 8 ? "high" : score >= 3 ? "medium" : "low";
  return { tier, score, factors };
}

function recommend(tier: "high" | "medium" | "low"): ModelRecommendation {
  switch (tier) {
    case "high":
      return {
        recommended_model: MODELS.opus47,
        tier: "HIGH",
        reason: "Complex task requiring deep reasoning and architecture decisions",
        alternatives: [MODELS.gpt55, MODELS.opus46],
      };
    case "medium":
      return {
        recommended_model: MODELS.gpt55,
        tier: "MEDIUM",
        reason: "Standard implementation task with moderate complexity",
        alternatives: [MODELS.sonnet46, MODELS.opus47],
      };
    case "low":
      return {
        recommended_model: MODELS.sonnet46,
        tier: "LOW",
        reason: "Simple task suitable for fast, lightweight model",
        alternatives: [MODELS.gpt55],
      };
  }
}

export function registerModelRouter(server: McpServer): void {
  server.tool(
    "omg_select_model",
    "[deprecated, removed in 1.5 — agents declare model: in frontmatter] Recommend a model for a task based on complexity analysis.",
    {
      task: z.string().describe("Description of the task to route"),
      file_count: z
        .number()
        .optional()
        .describe("Number of files involved in the task"),
      agent_type: z
        .string()
        .optional()
        .describe("The agent type that will execute (e.g., architect, executor)"),
    },
    deprecated("omg_select_model", async ({ task, file_count, agent_type }: { task: string; file_count?: number; agent_type?: string }) => {
      const complexity = assessComplexity(task, file_count);
      const normalizedAgentType = agent_type?.replace(/^@/, "").toLowerCase();

      let recommendation: ModelRecommendation;

      if (normalizedAgentType && OPUS_47_AGENTS.has(normalizedAgentType)) {
        recommendation = recommend("high");
        recommendation.reason = `Agent type "${normalizedAgentType}" requires Claude Opus 4.7 for high-stakes reasoning and review`;
      } else if (normalizedAgentType && GPT_55_AGENTS.has(normalizedAgentType)) {
        recommendation = recommend("medium");
        recommendation.reason = `Agent type "${normalizedAgentType}" is optimized for GPT-5.5 deep reasoning, debugging, analysis, or specialist review`;
      } else if (normalizedAgentType && SONNET_46_AGENTS.has(normalizedAgentType)) {
        recommendation = recommend("low");
        recommendation.reason = `Agent type "${normalizedAgentType}" works well with Claude Sonnet 4.6 for balanced coding, documentation, or operational workflows`;
      } else {
        recommendation = recommend(complexity.tier);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              ...recommendation,
              complexity: {
                tier: complexity.tier,
                score: complexity.score,
                factors: complexity.factors,
              },
            }),
          },
        ],
      };
    })
  );
}
