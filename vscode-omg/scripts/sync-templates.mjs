#!/usr/bin/env node

/**
 * Sync templates from the repository's .github/ and mcp-server/ into
 * the extension's resources/templates/ directory.
 *
 * Run before `vsce package` to ensure templates are up-to-date.
 */

import { cpSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, resolve, relative } from 'path';

const repoRoot = resolve(import.meta.dirname, '..', '..');
const templatesDir = resolve(import.meta.dirname, '..', 'resources', 'templates');

const items = [
  { src: '.github/copilot-instructions.md', dest: 'copilot-instructions.md', isDir: false },
  { src: '.github/agents', dest: 'agents', isDir: true },
  { src: '.github/skills', dest: 'skills', isDir: true },
  { src: '.github/hooks', dest: 'hooks', isDir: true },
  { src: '.github/prompts', dest: 'prompts', isDir: true },
  { src: 'mcp-server', dest: 'mcp-server', isDir: true },
];

// Build output, dependencies and local workflow state never belong in the bundle.
// Matched per path segment on a separator-normalized path so it also works on Windows.
const EXCLUDED_SEGMENT = /(^|\/)(node_modules|dist|\.omg|\.omc)(\/|$)/;

console.log('Syncing templates...');
console.log(`  Repo root: ${repoRoot}`);
console.log(`  Templates dir: ${templatesDir}`);

mkdirSync(templatesDir, { recursive: true });

for (const item of items) {
  const srcPath = join(repoRoot, item.src);
  const destPath = join(templatesDir, item.dest);

  if (!existsSync(srcPath)) {
    console.warn(`  ⚠ Source not found: ${item.src}`);
    continue;
  }

  if (item.isDir) {
    // Mirror: drop the previous copy so files removed upstream (or left by an earlier sync) do not linger.
    rmSync(destPath, { recursive: true, force: true });
    cpSync(srcPath, destPath, {
      recursive: true,
      filter: (src) => !EXCLUDED_SEGMENT.test(relative(repoRoot, src).replace(/\\/g, '/')),
    });
  } else {
    mkdirSync(join(destPath, '..'), { recursive: true });
    cpSync(srcPath, destPath);
  }

  console.log(`  ✓ ${item.src} → templates/${item.dest}`);
}

console.log('Templates synced successfully.');
