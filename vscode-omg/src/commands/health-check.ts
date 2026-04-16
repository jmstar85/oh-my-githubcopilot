import * as vscode from 'vscode';
import * as path from 'path';
import { checkConventionFiles, checkVersionDrift, type ConventionCheckResult } from '../utils/convention';
import { getActiveWorkflows } from '../utils/omc-reader';

export function registerHealthCheckCommand(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
  context.subscriptions.push(
    vscode.commands.registerCommand('omg.healthCheck', () => runHealthCheck(context, outputChannel)),
    vscode.commands.registerCommand('omg.showStatus', () => showStatus(outputChannel)),
  );
}

async function runHealthCheck(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) {
    vscode.window.showErrorMessage('OMG: No workspace folder open.');
    return;
  }

  const root = ws.uri.fsPath;
  const issues: ConventionCheckResult[] = checkConventionFiles(root);

  // Version drift check
  const bundledPkg = path.join(context.extensionPath, 'resources', 'templates', 'mcp-server', 'package.json');
  const workspacePkg = path.join(root, 'mcp-server', 'package.json');
  const drift = checkVersionDrift(bundledPkg, workspacePkg);
  if (drift) issues.push(drift);

  // Display results
  outputChannel.clear();
  outputChannel.appendLine('=== OMG Health Check ===');
  outputChannel.appendLine('');

  if (issues.length === 0) {
    outputChannel.appendLine('✅ All checks passed! OMG is fully configured.');
    vscode.window.showInformationMessage('OMG: Health check passed — all files present and MCP server ready.');
  } else {
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');
    const infos = issues.filter(i => i.severity === 'info');

    for (const issue of issues) {
      const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      outputChannel.appendLine(`${icon} [${issue.severity.toUpperCase()}] ${issue.message}`);
      if (issue.fix) {
        outputChannel.appendLine(`   Fix: ${issue.fix}`);
      }
    }

    outputChannel.appendLine('');
    outputChannel.appendLine(`Summary: ${errors.length} error(s), ${warnings.length} warning(s), ${infos.length} info(s)`);
    outputChannel.show();

    if (errors.length > 0) {
      vscode.window.showErrorMessage(
        `OMG: Health check found ${errors.length} error(s). Check Output > OMG.`,
        'Open Output',
      ).then(choice => {
        if (choice === 'Open Output') outputChannel.show();
      });
    } else {
      vscode.window.showWarningMessage(
        `OMG: Health check found ${warnings.length} warning(s). Check Output > OMG.`,
      );
    }
  }
}

async function showStatus(outputChannel: vscode.OutputChannel) {
  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) {
    vscode.window.showErrorMessage('OMG: No workspace folder open.');
    return;
  }

  const stateDir = path.join(ws.uri.fsPath, '.omg', 'state');
  const workflows = getActiveWorkflows(stateDir);

  if (workflows.length === 0) {
    vscode.window.showInformationMessage('OMG: No active workflows.');
  } else {
    const labels = workflows.map(w => {
      const phase = w.current_phase !== undefined ? ` [phase ${w.current_phase}]` : '';
      return `${w.mode}${phase}`;
    });
    vscode.window.showInformationMessage(`OMG Active: ${labels.join(', ')}`);
  }
}
