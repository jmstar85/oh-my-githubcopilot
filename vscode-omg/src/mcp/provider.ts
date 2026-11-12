import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { MCP_PROVIDER_ID, isOmgWorkspace, staticConfigDefinesOmgServer } from '../utils/mcp-config';

export function registerMcpProvider(
  context: vscode.ExtensionContext,
  ws: vscode.WorkspaceFolder,
  outputChannel: vscode.OutputChannel,
) {
  // The static mcp.json comes first: the provider below defers to it, and it is where users set
  // the server's env (e.g. OMG_LEGACY_TOOLS).
  ensureStaticMcpConfig(ws, outputChannel);

  // Check if the registerMcpServerDefinitionProvider API is available
  if (typeof vscode.lm?.registerMcpServerDefinitionProvider !== 'function') {
    outputChannel.appendLine('OMG: MCP server definition provider API not available. Falling back to static configuration.');
    return;
  }

  try {
    const disposable = vscode.lm.registerMcpServerDefinitionProvider(MCP_PROVIDER_ID, {
      provideMcpServerDefinitions() {
        if (!vscode.workspace.isTrusted) {
          return [];
        }

        const serverDist = path.join(ws.uri.fsPath, 'mcp-server', 'dist', 'index.js');
        if (!fs.existsSync(serverDist)) {
          // Trigger auto-build asynchronously
          autoBuildMcpServer(ws, outputChannel);
          return [];
        }

        // mcp.json already supplies this server. Providing it again could give the model a
        // second copy of every tool definition, and that copy would not carry the env set there.
        if (staticConfigDefinesOmgServer(ws.uri.fsPath)) {
          return [];
        }

        return [
          new vscode.McpStdioServerDefinition(
            'OMG Workflow',
            'node',
            [serverDist],
            { WORKSPACE_ROOT: ws.uri.fsPath },
          ),
        ];
      },
    });

    context.subscriptions.push(disposable);
    outputChannel.appendLine('OMG: MCP server provider registered');
  } catch (err) {
    // A rejected registration must not abort activation; the static configuration still applies.
    outputChannel.appendLine(`OMG: MCP server provider not registered (${err}). Falling back to static configuration.`);
  }
}

async function autoBuildMcpServer(ws: vscode.WorkspaceFolder, outputChannel: vscode.OutputChannel) {
  const mcpDir = path.join(ws.uri.fsPath, 'mcp-server');

  if (!isOmgWorkspace(ws.uri.fsPath)) {
    outputChannel.appendLine('OMG: No OMG mcp-server package in this workspace, skipping auto-build');
    return;
  }

  const nodeModules = path.join(mcpDir, 'node_modules');
  const needsInstall = !fs.existsSync(nodeModules);

  outputChannel.appendLine('OMG: Auto-building MCP server...');

  const terminal = vscode.window.createTerminal({
    name: 'OMG: MCP Build',
    cwd: mcpDir,
    hideFromUser: true,
  });

  const cmd = needsInstall ? 'npm install && npm run build' : 'npm run build';
  terminal.sendText(`${cmd} && echo "OMG_BUILD_COMPLETE"`);

  // Watch for the built file to appear
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(ws, 'mcp-server/dist/index.js'),
  );

  watcher.onDidCreate(() => {
    outputChannel.appendLine('OMG: MCP server built successfully');
    vscode.window.showInformationMessage('OMG: MCP server built. Reload to activate MCP tools.', 'Reload Window')
      .then(choice => {
        if (choice === 'Reload Window') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
    watcher.dispose();
    terminal.dispose();
  });

  // Clean up after timeout
  setTimeout(() => {
    watcher.dispose();
    terminal.dispose();
  }, 120000);
}

function ensureStaticMcpConfig(ws: vscode.WorkspaceFolder, outputChannel: vscode.OutputChannel) {
  const mcpConfigPath = path.join(ws.uri.fsPath, '.vscode', 'mcp.json');
  if (fs.existsSync(mcpConfigPath)) {
    return; // Don't overwrite existing config
  }
  if (!isOmgWorkspace(ws.uri.fsPath)) {
    return;
  }

  // Write mcp.json regardless of whether dist/index.js exists yet.
  // VS Code will simply not start the server until the file appears after the build.
  const mcpConfig = {
    servers: {
      'omg-workflow': {
        type: 'stdio',
        command: 'node',
        args: ['${workspaceFolder}/mcp-server/dist/index.js'],
        env: {
          WORKSPACE_ROOT: '${workspaceFolder}',
        },
      },
    },
  };

  try {
    fs.mkdirSync(path.dirname(mcpConfigPath), { recursive: true });
    fs.writeFileSync(mcpConfigPath, JSON.stringify(mcpConfig, null, 2));
    outputChannel.appendLine('OMG: Generated .vscode/mcp.json (fallback mode)');
  } catch (err) {
    outputChannel.appendLine(`OMG: Could not write .vscode/mcp.json (${err})`);
  }
}
