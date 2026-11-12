import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const vscodeMock = vi.hoisted(() => ({
  workspace: { isTrusted: true },
  lm: { registerMcpServerDefinitionProvider: vi.fn() },
  McpStdioServerDefinition: class {
    constructor(public label: string, public command: string, public args: string[], public env: Record<string, string>) {}
  },
}));
vi.mock('vscode', () => vscodeMock);

import { registerMcpProvider } from '../../src/mcp/provider';
import { MCP_PROVIDER_ID } from '../../src/utils/mcp-config';

describe('registerMcpProvider', () => {
  let tmpDir: string;
  let log: string[];
  const mcpJson = () => path.join(tmpDir, '.vscode', 'mcp.json');

  const setupOmgWorkspace = () => {
    fs.mkdirSync(path.join(tmpDir, 'mcp-server', 'dist'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'mcp-server', 'package.json'), '{"name":"omg-mcp-server"}');
    fs.writeFileSync(path.join(tmpDir, 'mcp-server', 'dist', 'index.js'), '');
  };

  // Registers the provider and returns what it hands to VS Code.
  const provided = () => {
    let provider: { provideMcpServerDefinitions(): unknown[] } | undefined;
    vscodeMock.lm.registerMcpServerDefinitionProvider.mockImplementation((_id, p) => {
      provider = p;
      return { dispose() {} };
    });
    register();
    return provider!.provideMcpServerDefinitions();
  };

  const register = () => registerMcpProvider(
    { subscriptions: [] } as never,
    { uri: { fsPath: tmpDir } } as never,
    { appendLine: (line: string) => log.push(line) } as never,
  );

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'omg-mcp-provider-test-'));
    log = [];
    vscodeMock.lm.registerMcpServerDefinitionProvider.mockReset();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('survives a rejected registration and still writes the static config', () => {
    setupOmgWorkspace();
    vscodeMock.lm.registerMcpServerDefinitionProvider.mockImplementation(() => {
      throw new Error('MCP configuration providers must be registered in the contributes.mcpServerDefinitionProviders array');
    });

    expect(register).not.toThrow();
    expect(fs.existsSync(mcpJson())).toBe(true);
    expect(log.some(line => line.includes('not registered'))).toBe(true);
  });

  it('does not write .vscode/mcp.json into a folder that is not an OMG workspace', () => {
    // Another project's own mcp-server package does not make the folder an OMG workspace.
    fs.mkdirSync(path.join(tmpDir, 'mcp-server'));
    fs.writeFileSync(path.join(tmpDir, 'mcp-server', 'package.json'), '{"name":"acme-mcp-server"}');

    expect(provided()).toEqual([]);
    expect(fs.existsSync(path.join(tmpDir, '.vscode'))).toBe(false);
    expect(vscodeMock.lm.registerMcpServerDefinitionProvider).toHaveBeenCalledWith(MCP_PROVIDER_ID, expect.anything());
  });

  it('still writes the static config when VS Code has no provider API', () => {
    setupOmgWorkspace();
    const { lm } = vscodeMock;
    (vscodeMock as { lm?: unknown }).lm = undefined;
    try {
      register();
    } finally {
      vscodeMock.lm = lm;
    }

    expect(fs.existsSync(mcpJson())).toBe(true);
  });

  it('defers to the mcp.json it generates on first activation', () => {
    setupOmgWorkspace();

    expect(provided()).toEqual([]);
    expect(JSON.parse(fs.readFileSync(mcpJson(), 'utf-8')).servers['omg-workflow']).toBeDefined();
  });

  it('supplies the server when a user-owned mcp.json does not define it, without touching the file', () => {
    setupOmgWorkspace();
    const userConfig = JSON.stringify({ servers: { mine: { command: 'node', args: ['server.js'] } } });
    fs.mkdirSync(path.dirname(mcpJson()), { recursive: true });
    fs.writeFileSync(mcpJson(), userConfig);

    expect(provided()).toMatchObject([{ label: 'OMG Workflow', args: [path.join(tmpDir, 'mcp-server', 'dist', 'index.js')] }]);
    expect(fs.readFileSync(mcpJson(), 'utf-8')).toBe(userConfig);
  });
});
