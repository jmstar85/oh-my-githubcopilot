import * as fs from 'fs';
import * as path from 'path';

/**
 * Read .vscode/mcp.json. Pure filesystem logic.
 */

/** VS Code rejects a provider id that package.json does not declare in contributes.mcpServerDefinitionProviders. */
export const MCP_PROVIDER_ID = 'omgMcpProvider';

// Name under which the extension writes the server into .vscode/mcp.json.
const OMG_SERVER_NAME = 'omg-workflow';
// "name" in mcp-server/package.json.
const OMG_SERVER_PACKAGE = 'omg-mcp-server';

/** The extension activates in every folder; only those carrying the OMG MCP server package get one. */
export function isOmgWorkspace(rootDir: string): boolean {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'mcp-server', 'package.json'), 'utf-8'));
    return manifest?.name === OMG_SERVER_PACKAGE;
  } catch {
    return false;
  }
}

/**
 * True when the workspace's .vscode/mcp.json already defines the OMG MCP server: a server with
 * the generated name, or any server that launches this workspace's mcp-server/dist/index.js.
 */
export function staticConfigDefinesOmgServer(rootDir: string): boolean {
  let servers: unknown;
  try {
    const text = fs.readFileSync(path.join(rootDir, '.vscode', 'mcp.json'), 'utf-8');
    servers = JSON.parse(stripJsonComments(text.replace(/^\uFEFF/, '')))?.servers;
  } catch {
    // Missing or unparseable: VS Code gets no server from it either.
    return false;
  }
  if (!servers || typeof servers !== 'object') return false;
  return Object.entries(servers).some(
    ([name, definition]) => name === OMG_SERVER_NAME || launchesOmgServer(definition, rootDir),
  );
}

function launchesOmgServer(definition: unknown, rootDir: string): boolean {
  const { args, cwd } = (definition ?? {}) as { args?: unknown; cwd?: unknown };
  if (!Array.isArray(args)) return false;
  const base = typeof cwd === 'string' ? resolveConfigPath(cwd, rootDir, rootDir) : rootDir;
  const entry = comparable(path.join(rootDir, 'mcp-server', 'dist', 'index.js'));
  return args.some(arg => typeof arg === 'string' && comparable(resolveConfigPath(arg, base, rootDir)) === entry);
}

function resolveConfigPath(value: string, base: string, rootDir: string): string {
  return path.resolve(base, value.replace(/\$\{workspaceFolder\}/g, () => rootDir).replace(/\\/g, '/'));
}

function comparable(filePath: string): string {
  return process.platform === 'win32' ? filePath.toLowerCase() : filePath;
}

/** mcp.json is JSON with comments: drop comments and trailing commas, leave strings intact. */
function stripJsonComments(text: string): string {
  let out = '';
  let commaAt = -1; // index in `out` of a comma followed only by whitespace so far
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"') {
      const start = i++;
      while (i < text.length && text[i] !== '"') i += text[i] === '\\' ? 2 : 1;
      out += text.slice(start, ++i);
      commaAt = -1;
    } else if (ch === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
    } else if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 2;
    } else {
      if ((ch === '}' || ch === ']') && commaAt >= 0) {
        out = out.slice(0, commaAt) + out.slice(commaAt + 1);
      }
      if (ch === ',') commaAt = out.length;
      else if (!/\s/.test(ch)) commaAt = -1;
      out += ch;
      i++;
    }
  }
  return out;
}
