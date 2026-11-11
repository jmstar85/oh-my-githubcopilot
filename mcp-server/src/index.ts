#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, isLegacyEnabled } from "./server.js";

async function main() {
  const legacy = isLegacyEnabled();
  const server = createServer({ legacy });
  if (legacy) {
    console.error("OMG: OMG_LEGACY_TOOLS is set — 1.4 tool names are registered as deprecated adapters (removed in 2.0).");
  }
  await server.connect(new StdioServerTransport());
}

main().catch((error) => {
  console.error("OMG MCP Server failed to start:", error);
  process.exit(1);
});
