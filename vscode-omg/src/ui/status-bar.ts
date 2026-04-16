import * as vscode from 'vscode';
import * as path from 'path';
import { getActiveWorkflows } from '../utils/omc-reader';

export function createStatusBar(context: vscode.ExtensionContext, ws: vscode.WorkspaceFolder) {
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  statusBar.command = 'omg.showStatus';
  statusBar.tooltip = 'OMG Workflow Status — Click for details';
  context.subscriptions.push(statusBar);

  // Initial update
  updateStatusBar(statusBar, ws);

  // Watch for state changes
  const statePattern = new vscode.RelativePattern(ws, '.omg/state/*-state.json');
  const watcher = vscode.workspace.createFileSystemWatcher(statePattern);

  const update = () => updateStatusBar(statusBar, ws);
  watcher.onDidChange(update);
  watcher.onDidCreate(update);
  watcher.onDidDelete(update);

  context.subscriptions.push(watcher);
}

function updateStatusBar(statusBar: vscode.StatusBarItem, ws: vscode.WorkspaceFolder) {
  const stateDir = path.join(ws.uri.fsPath, '.omg', 'state');
  const active = getActiveWorkflows(stateDir);

  if (active.length === 0) {
    statusBar.text = '$(zap) OMG: idle';
    statusBar.backgroundColor = undefined;
  } else if (active.length === 1) {
    const w = active[0];
    const phase = w.phase_name ? ` [${w.phase_name}]` : w.current_phase !== undefined ? ` [phase ${w.current_phase}]` : '';
    statusBar.text = `$(sync~spin) OMG: ${w.mode}${phase}`;
    statusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else {
    statusBar.text = `$(sync~spin) OMG: ${active.length} active`;
    statusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  }

  statusBar.show();
}
