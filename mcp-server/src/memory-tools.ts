import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as path from "node:path";
import { getWorkspaceRoot, ensureDir, safeReadFile, safeWriteFile, safeJsonParse, jsonResponse, errorResponse } from "./utils.js";

// Project memory lives in .omg/project-memory.json (format unchanged since 1.0; `category` is kept on disk).

const MAX_ENTRIES = 500;
const MAX_VALUE_LENGTH = 10_000;
const DEFAULT_SEARCH_LIMIT = 20;

export interface MemoryEntry {
  key: string;
  value: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface MemoryStore {
  entries: MemoryEntry[];
}

function getMemoryPath(): string {
  return path.join(getWorkspaceRoot(), ".omg", "project-memory.json");
}

export function readMemory(): MemoryStore {
  const data = safeReadFile(getMemoryPath());
  if (!data) return { entries: [] };
  const result = safeJsonParse(data);
  if (!result.ok || !Array.isArray(result.data.entries)) return { entries: [] };
  return { entries: result.data.entries as MemoryEntry[] };
}

function writeMemory(store: MemoryStore): void {
  const memPath = getMemoryPath();
  ensureDir(path.dirname(memPath));
  safeWriteFile(memPath, JSON.stringify(store, null, 2));
}

function publicEntry(e: MemoryEntry) {
  return { key: e.key, value: e.value, category: e.category, tags: e.tags ?? [], updated_at: e.updated_at };
}

export function getMemoryEntries(filter: { key?: string; category?: string } = {}) {
  let entries = readMemory().entries;
  if (filter.category) entries = entries.filter((e) => e.category === filter.category);
  if (filter.key) entries = entries.filter((e) => e.key === filter.key);
  return { total: entries.length, entries: entries.map(publicEntry) };
}

export function searchMemory(query: string, options: { category?: string; limit?: number } = {}) {
  const q = query.toLowerCase();
  let results = readMemory().entries.filter((e) =>
    [e.key, e.value, e.category, ...(e.tags ?? [])].join(" ").toLowerCase().includes(q)
  );
  if (options.category) results = results.filter((e) => e.category === options.category);
  const total = results.length;
  results = results.slice(0, options.limit ?? DEFAULT_SEARCH_LIMIT);
  return { query, total, returned: results.length, entries: results.map(publicEntry) };
}

export function setMemory(key: string, value: string, options: { category?: string; tags?: string[] } = {}) {
  if (value.length > MAX_VALUE_LENGTH) {
    throw new Error(`Value exceeds maximum length of ${MAX_VALUE_LENGTH} characters`);
  }
  const store = readMemory();
  const index = store.entries.findIndex((e) => e.key === key);
  const now = new Date().toISOString();

  if (index < 0 && store.entries.length >= MAX_ENTRIES) {
    throw new Error(`Memory store full (max ${MAX_ENTRIES} entries)`);
  }

  if (index >= 0) {
    const existing = store.entries[index];
    existing.value = value;
    existing.category = options.category ?? existing.category ?? "project";
    existing.tags = options.tags ?? existing.tags ?? [];
    existing.updated_at = now;
  } else {
    store.entries.push({
      key,
      value,
      category: options.category ?? "project",
      tags: options.tags ?? [],
      created_at: now,
      updated_at: now,
    });
  }
  writeMemory(store);
  return { success: true, key, action: index >= 0 ? "updated" : "created" };
}

export function deleteMemory(key: string) {
  const store = readMemory();
  const before = store.entries.length;
  store.entries = store.entries.filter((e) => e.key !== key);
  const deleted = store.entries.length < before;
  if (deleted) writeMemory(store);
  return { success: true, deleted, key };
}

export function registerMemoryTools(server: McpServer): void {
  server.tool(
    "omg_memory",
    "Project memory (.omg/project-memory.json). op: get (key?; omit=all) | search (query) | set (key, value, tags?) | delete (key).",
    {
      op: z.enum(["get", "search", "set", "delete"]),
      key: z.string().optional(),
      query: z.string().optional(),
      value: z.string().optional(),
      tags: z.array(z.string()).optional(),
    },
    async ({ op, key, query, value, tags }) => {
      try {
        switch (op) {
          case "get":
            return jsonResponse(getMemoryEntries({ key }));
          case "search":
            if (!query?.trim()) return errorResponse("search requires query");
            return jsonResponse(searchMemory(query));
          case "set":
            if (!key?.trim()) return errorResponse("set requires key");
            if (value === undefined) return errorResponse("set requires value");
            return jsonResponse(setMemory(key, value, { tags }));
          case "delete":
            if (!key?.trim()) return errorResponse("delete requires key");
            return jsonResponse(deleteMemory(key));
        }
      } catch (err) {
        return errorResponse((err as Error).message);
      }
    }
  );
}
