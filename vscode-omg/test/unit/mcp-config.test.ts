import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { MCP_PROVIDER_ID, staticConfigDefinesOmgServer } from '../../src/utils/mcp-config';

describe('mcp-config', () => {
  let tmpDir: string;

  const writeMcpJson = (content: string | object) => {
    fs.mkdirSync(path.join(tmpDir, '.vscode'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.vscode', 'mcp.json'),
      typeof content === 'string' ? content : JSON.stringify(content, null, 2),
    );
  };

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'omg-mcp-config-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('declares the provider id in package.json, as VS Code requires', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf-8'));
    const declared = (manifest.contributes.mcpServerDefinitionProviders ?? []).map((p: { id: string }) => p.id);
    expect(declared).toContain(MCP_PROVIDER_ID);
  });

  describe('staticConfigDefinesOmgServer', () => {
    it('is false without .vscode/mcp.json or when it cannot be parsed', () => {
      expect(staticConfigDefinesOmgServer(tmpDir)).toBe(false);
      writeMcpJson('{ "servers": { "omg-workflow": ');
      expect(staticConfigDefinesOmgServer(tmpDir)).toBe(false);
    });

    it('is true for the config the extension generates', () => {
      writeMcpJson({
        servers: {
          'omg-workflow': {
            type: 'stdio',
            command: 'node',
            args: ['${workspaceFolder}/mcp-server/dist/index.js'],
            env: { WORKSPACE_ROOT: '${workspaceFolder}', OMG_LEGACY_TOOLS: '1' },
          },
        },
      });
      expect(staticConfigDefinesOmgServer(tmpDir)).toBe(true);
    });

    it('is false for servers that only resemble the OMG entry path', () => {
      writeMcpJson({
        servers: {
          github: { command: 'node', args: ['${workspaceFolder}/node_modules/github-mcp-server/dist/index.js'] },
          other: { command: 'node', args: [path.join(os.tmpdir(), 'another-project', 'mcp-server', 'dist', 'index.js')] },
          remote: { type: 'http', url: 'https://example.com/mcp-server/dist/index.js' },
        },
      });
      expect(staticConfigDefinesOmgServer(tmpDir)).toBe(false);
    });

    it('recognises a renamed server that launches this workspace\'s mcp-server', () => {
      writeMcpJson({ servers: { workflow: { command: 'node', args: [path.join(tmpDir, 'mcp-server', 'dist', 'index.js')] } } });
      expect(staticConfigDefinesOmgServer(tmpDir)).toBe(true);

      writeMcpJson({ servers: { workflow: { command: 'node', cwd: '${workspaceFolder}/mcp-server', args: ['dist/index.js'] } } });
      expect(staticConfigDefinesOmgServer(tmpDir)).toBe(true);
    });

    it('reads mcp.json with comments and trailing commas', () => {
      writeMcpJson(`{
  // state server, renamed
  "servers": {
    "workflow": { "command": "node", "args": ["\${workspaceFolder}\\\\mcp-server\\\\dist\\\\index.js",], }, /* trailing */
  },
}`);
      expect(staticConfigDefinesOmgServer(tmpDir)).toBe(true);
    });

    it('ignores an OMG entry that is commented out', () => {
      writeMcpJson(`{
  "servers": {
    // "omg-workflow": { "command": "node", "args": ["\${workspaceFolder}/mcp-server/dist/index.js"] },
    "mine": { "command": "node", "args": ["server.js"] }
  }
}`);
      expect(staticConfigDefinesOmgServer(tmpDir)).toBe(false);
    });
  });
});
