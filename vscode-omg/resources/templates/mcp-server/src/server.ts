import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerReadTools } from "./read-tools.js";
import { registerWriteTools } from "./write-tools.js";
import { registerVerifyTools } from "./verify-tools.js";
import { registerWorkflowTools } from "./workflow-tools.js";
import { registerCheckpointTools } from "./checkpoint-tools.js";
import { registerMemoryTools } from "./memory-tools.js";
import { registerLegacyTools } from "./legacy-tools.js";

/** The 1.5 tool surface. Always registered, in this order. */
export const TOOL_NAMES = [
  "omg_read",
  "omg_write",
  "omg_verify",
  "omg_check_completion",
  "omg_checkpoint",
  "omg_memory",
] as const;

export function isLegacyEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return ["1", "true", "yes"].includes((env.OMG_LEGACY_TOOLS ?? "").trim().toLowerCase());
}

export interface ServerOptions {
  /** Also register the 1.4 tool names as deprecated adapters (OMG_LEGACY_TOOLS=1). */
  legacy?: boolean;
}

export function createServer(options: ServerOptions = {}): McpServer {
  const legacy = options.legacy ?? isLegacyEnabled();
  const server = new McpServer({ name: "omg-workflow", version: "1.5.0" });

  registerReadTools(server);
  registerWriteTools(server);
  registerVerifyTools(server);
  registerWorkflowTools(server);
  registerCheckpointTools(server, legacy);
  registerMemoryTools(server);
  if (legacy) registerLegacyTools(server);

  return server;
}
