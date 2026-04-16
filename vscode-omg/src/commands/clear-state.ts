import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function registerClearStateCommand(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
  context.subscriptions.push(
    vscode.commands.registerCommand('omg.clearState', () => clearState(outputChannel)),
  );
}

async function clearState(outputChannel: vscode.OutputChannel) {
  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) {
    vscode.window.showErrorMessage('OMG: No workspace folder open.');
    return;
  }

  const stateDir = path.join(ws.uri.fsPath, '.omg', 'state');
  if (!fs.existsSync(stateDir)) {
    vscode.window.showInformationMessage('OMG: No workflow state to clear.');
    return;
  }

  const answer = await vscode.window.showWarningMessage(
    'OMG: Clear all workflow state? This cannot be undone.',
    'Clear All',
    'Cancel',
  );
  if (answer !== 'Clear All') {
    return;
  }

  try {
    const files = fs.readdirSync(stateDir).filter(f => f.endsWith('-state.json'));
    for (const file of files) {
      fs.unlinkSync(path.join(stateDir, file));
    }
    outputChannel.appendLine(`OMG: Cleared ${files.length} state file(s)`);
    vscode.window.showInformationMessage(`OMG: Cleared ${files.length} workflow state file(s).`);
  } catch (err) {
    outputChannel.appendLine(`OMG: Clear state error: ${err}`);
    vscode.window.showErrorMessage('OMG: Failed to clear state. Check Output > OMG.');
  }
}
