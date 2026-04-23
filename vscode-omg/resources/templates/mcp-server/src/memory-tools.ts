import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as path from "node:path";
import { getWorkspaceRoot, ensureDir, safeReadFile, safeWriteFile, safeJsonParse, errorResponse } from "./utils.js";

const MAX_ENTRIES = 500;
const MAX_VALUE_LENGTH = 10_000;

function getMemoryPath(): string {
  return path.join(getWorkspaceRoot(), ".omg", "project-memory.json");
}

interface MemoryEntry {
  key: string;
  value: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface MemoryStore {
  entries: MemoryEntry[];
}

// Exported for checkpoint-tools
export function readMemory(): MemoryStore {
  const memPath = getMemoryPath();
  const data = safeReadFile(memPath);
  if (!data) return { entries: [] };
  const result = safeJsonParse(data);
  if (!result.ok) return { entries: [] };
  const store = result.data as Record<string, unknown>;
  if (!Array.isArray(store.entries)) return { entries: [] };
  return { entries: store.entries } as MemoryStore;
}

function writeMemory(store: MemoryStore): void {
  const memPath = getMemoryPath();
  ensureDir(path.dirname(memPath));
  safeWriteFile(memPath, JSON.stringify(store, null, 2));
}

export function registerMemoryTools(server: McpServer): void {
  server.tool(
    "omg_read_memory",
    "Read project memory entries. Optionally filter by category or key.",
    {
      category: z.string().optional().describe("Filter by category (e.g., project, user, feedback, reference)"),
      key: z.string().optional().describe("Filter by specific key"),
    },
    async ({ category, key }) => {
      const store = readMemory();
      let entries = store.entries;

      if (category) {
        entries = entries.filter((e) => e.category === category);
      }
      if (key) {
        entries = entries.filter((e) => e.key === key);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              total: entries.length,
              entries: entries.map((e) => ({
                key: e.key,
                value: e.value,
                category: e.category,
                tags: e.tags ?? [],
                updated_at: e.updated_at,
              })),
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_search_memory",
    "Search project memory by keyword. Matches against keys, values, categories, and tags (case-insensitive).",
    {
      query: z.string().describe("Search term (case-insensitive substring match)"),
      category: z.string().optional().describe("Optionally restrict search to a category"),
      limit: z.number().optional().default(20).describe("Max results to return (default 20)"),
    },
    async ({ query, category, limit }) => {
      const store = readMemory();
      const q = query.toLowerCase();
      let results = store.entries.filter((e) => {
        const haystack = [
          e.key,
          e.value,
          e.category,
          ...(e.tags ?? []),
        ].join(" ").toLowerCase();
        return haystack.includes(q);
      });

      if (category) {
        results = results.filter((e) => e.category === category);
      }

      const totalMatches = results.length;
      results = results.slice(0, limit);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              query,
              total: totalMatches,
              returned: results.length,
              entries: results.map((e) => ({
                key: e.key,
                value: e.value,
                category: e.category,
                tags: e.tags ?? [],
                updated_at: e.updated_at,
              })),
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_write_memory",
    "Write or update a project memory entry",
    {
      key: z.string().describe("Unique key for this memory entry"),
      value: z.string().describe("The memory content"),
      category: z
        .string()
        .default("project")
        .describe("Category: project, user, feedback, reference"),
      tags: z
        .array(z.string())
        .optional()
        .default([])
        .describe("Tags for search (e.g., ['architecture', 'decision'])"),
    },
    async ({ key, value, category, tags }) => {
      if (value.length > MAX_VALUE_LENGTH) {
        return errorResponse(`Value exceeds maximum length of ${MAX_VALUE_LENGTH} characters`);
      }

      const store = readMemory();
      const existing = store.entries.findIndex((e) => e.key === key);
      const now = new Date().toISOString();

      if (existing < 0 && store.entries.length >= MAX_ENTRIES) {
        return errorResponse(`Memory store full (max ${MAX_ENTRIES} entries)`);
      }

      if (existing >= 0) {
        store.entries[existing].value = value;
        store.entries[existing].category = category;
        store.entries[existing].tags = tags ?? [];
        store.entries[existing].updated_at = now;
      } else {
        store.entries.push({
          key,
          value,
          category,
          tags: tags ?? [],
          created_at: now,
          updated_at: now,
        });
      }

      writeMemory(store);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              key,
              action: existing >= 0 ? "updated" : "created",
            }),
          },
        ],
      };
    }
  );

  server.tool(
    "omg_delete_memory",
    "Delete a project memory entry by key",
    {
      key: z.string().describe("Key of the memory entry to delete"),
    },
    async ({ key }) => {
      const store = readMemory();
      const before = store.entries.length;
      store.entries = store.entries.filter((e) => e.key !== key);
      const deleted = before - store.entries.length > 0;
      if (deleted) {
        writeMemory(store);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              deleted,
              key,
            }),
          },
        ],
      };
    }
  );
}
