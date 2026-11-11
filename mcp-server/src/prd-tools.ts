import * as fs from "node:fs";
import * as path from "node:path";
import { getWorkspaceRoot, ensureDir, safeReadFile, safeWriteFile, safeJsonParse, generateId } from "./utils.js";

// PRD lives in .omg/prd.json (format unchanged since 1.0).

export interface Story {
  id: string;
  title: string;
  description: string;
  acceptance_criteria: string[];
  passes: boolean;
  verification_evidence?: string;
  verified_at?: string;
  priority: number;
}

export interface Prd {
  title: string;
  description: string;
  stories: Story[];
  created_at: string;
  updated_at: string;
}

export interface StoryInput {
  id?: string;
  title: string;
  description?: string;
  acceptance_criteria?: string[];
  priority?: number;
}

export function getPrdPath(): string {
  return path.join(getWorkspaceRoot(), ".omg", "prd.json");
}

export function readPrd(): Prd | null {
  const data = safeReadFile(getPrdPath());
  if (!data) return null;
  const result = safeJsonParse(data);
  if (!result.ok) return null;
  const prd = result.data as unknown as Prd;
  if (!Array.isArray(prd.stories)) return null;
  return prd;
}

export function writePrd(prd: Prd): void {
  const prdPath = getPrdPath();
  ensureDir(path.dirname(prdPath));
  prd.updated_at = new Date().toISOString();
  safeWriteFile(prdPath, JSON.stringify(prd, null, 2));
}

export function clearPrd(): boolean {
  const prdPath = getPrdPath();
  if (!fs.existsSync(prdPath)) return false;
  fs.unlinkSync(prdPath);
  return true;
}

export function createPrd(title: string, description: string | undefined, stories: StoryInput[]): Prd {
  const now = new Date().toISOString();
  const prd: Prd = {
    title,
    description: description ?? "",
    stories: stories.map((s) => ({
      id: s.id || `story-${generateId()}`,
      title: s.title,
      description: s.description ?? "",
      acceptance_criteria: s.acceptance_criteria ?? [],
      passes: false,
      priority: s.priority ?? 0,
    })),
    created_at: now,
    updated_at: now,
  };
  writePrd(prd);
  return prd;
}

export function requirePrd(): Prd {
  const prd = readPrd();
  if (!prd) throw new Error("No PRD found. Create one with omg_write scope=prd op=set.");
  return prd;
}

export function findStory(prd: Prd, id: string): Story {
  const story = prd.stories.find((s) => s.id === id);
  if (!story) throw new Error(`Story ${id} not found`);
  return story;
}

/** Highest-priority story that has not passed yet. */
export function nextOpenStory(prd: Prd): { story: Story | null; remaining: number } {
  const pending = prd.stories.filter((s) => !s.passes).sort((a, b) => b.priority - a.priority);
  return { story: pending[0] ?? null, remaining: pending.length };
}

export function prdSummary(prd: Prd) {
  return {
    title: prd.title,
    total_stories: prd.stories.length,
    passing: prd.stories.filter((s) => s.passes).length,
    failing: prd.stories.filter((s) => !s.passes).length,
    stories: prd.stories.map((s) => ({
      id: s.id,
      title: s.title,
      passes: s.passes,
      priority: s.priority,
      criteria_count: s.acceptance_criteria.length,
    })),
  };
}

export interface StoryPatch {
  title?: string;
  description?: string;
  acceptance_criteria?: string[];
  priority?: number;
  passes?: false;
}

/** Adds or updates a story. Cannot set passes=true — that is omg_verify's job. */
export function upsertStory(id: string, patch: StoryPatch): { story: Story; created: boolean; prd: Prd } {
  const prd = requirePrd();
  let story = prd.stories.find((s) => s.id === id);
  const created = !story;
  if (!story) {
    if (!patch.title?.trim()) throw new Error(`Story ${id} not found; provide a title to create it`);
    story = {
      id,
      title: patch.title,
      description: patch.description ?? "",
      acceptance_criteria: patch.acceptance_criteria ?? [],
      passes: false,
      priority: patch.priority ?? 0,
    };
    prd.stories.push(story);
  } else {
    if (patch.title !== undefined) story.title = patch.title;
    if (patch.description !== undefined) story.description = patch.description;
    if (patch.acceptance_criteria !== undefined) story.acceptance_criteria = patch.acceptance_criteria;
    if (patch.priority !== undefined) story.priority = patch.priority;
  }
  if (patch.passes === false && story.passes) {
    story.passes = false;
    delete story.verification_evidence;
    delete story.verified_at;
  }
  writePrd(prd);
  return { story, created, prd };
}

export function removeStory(id: string): { deleted: boolean; prd: Prd } {
  const prd = requirePrd();
  const before = prd.stories.length;
  prd.stories = prd.stories.filter((s) => s.id !== id);
  const deleted = prd.stories.length < before;
  if (deleted) writePrd(prd);
  return { deleted, prd };
}

/** Legacy omg_update_story semantics (permissive): sets passes directly, evidence optional. */
export function setStoryPasses(id: string, passes: boolean, evidence?: string): { story: Story; prd: Prd } {
  const prd = requirePrd();
  const story = findStory(prd, id);
  story.passes = passes;
  if (evidence) story.verification_evidence = evidence;
  if (passes) story.verified_at = new Date().toISOString();
  writePrd(prd);
  return { story, prd };
}

/** Fail-closed path used by omg_verify: marks a story verified with the rendered evidence. */
export function markStoryVerified(id: string, evidenceText: string): { story: Story; prd: Prd } {
  const prd = requirePrd();
  const story = findStory(prd, id);
  story.passes = true;
  story.verification_evidence = evidenceText;
  story.verified_at = new Date().toISOString();
  writePrd(prd);
  return { story, prd };
}
