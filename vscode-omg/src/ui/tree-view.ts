import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function registerTreeViews(context: vscode.ExtensionContext, ws: vscode.WorkspaceFolder) {
  // Active Workflows tree
  const workflowProvider = new WorkflowTreeProvider(ws);
  const workflowView = vscode.window.createTreeView('omg.workflows', {
    treeDataProvider: workflowProvider,
  });
  context.subscriptions.push(workflowView);

  // Agents tree
  const agentProvider = new AgentTreeProvider(ws);
  const agentView = vscode.window.createTreeView('omg.agents', {
    treeDataProvider: agentProvider,
  });
  context.subscriptions.push(agentView);

  // PRD Stories tree
  const prdProvider = new PrdTreeProvider(ws);
  const prdView = vscode.window.createTreeView('omg.prd', {
    treeDataProvider: prdProvider,
  });
  context.subscriptions.push(prdView);

  // Watch for changes to refresh trees
  const stateWatcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(ws, '.omg/**/*.json'),
  );
  stateWatcher.onDidChange(() => {
    workflowProvider.refresh();
    prdProvider.refresh();
  });
  stateWatcher.onDidCreate(() => {
    workflowProvider.refresh();
    prdProvider.refresh();
  });
  stateWatcher.onDidDelete(() => {
    workflowProvider.refresh();
    prdProvider.refresh();
  });
  context.subscriptions.push(stateWatcher);
}

// --- Workflow Tree ---

class WorkflowTreeProvider implements vscode.TreeDataProvider<WorkflowItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<WorkflowItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private ws: vscode.WorkspaceFolder) {}

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: WorkflowItem): vscode.TreeItem {
    return element;
  }

  getChildren(): WorkflowItem[] {
    const stateDir = path.join(this.ws.uri.fsPath, '.omg', 'state');
    if (!fs.existsSync(stateDir)) {
      return [new WorkflowItem('No active workflows', '', vscode.TreeItemCollapsibleState.None)];
    }

    const files = fs.readdirSync(stateDir).filter(f => f.endsWith('-state.json'));
    if (files.length === 0) {
      return [new WorkflowItem('No active workflows', '', vscode.TreeItemCollapsibleState.None)];
    }

    return files.map(file => {
      const mode = file.replace('-state.json', '');
      try {
        const data = JSON.parse(fs.readFileSync(path.join(stateDir, file), 'utf-8'));
        const active = data.active ? '$(play)' : '$(debug-stop)';
        const phase = data.phase_name || (data.current_phase !== undefined ? `phase ${data.current_phase}` : '');
        const desc = [data.active ? 'active' : 'stopped', phase].filter(Boolean).join(' — ');
        return new WorkflowItem(`${active} ${mode}`, desc, vscode.TreeItemCollapsibleState.None);
      } catch {
        return new WorkflowItem(mode, 'error reading state', vscode.TreeItemCollapsibleState.None);
      }
    });
  }
}

class WorkflowItem extends vscode.TreeItem {
  constructor(label: string, description: string, collapsibleState: vscode.TreeItemCollapsibleState) {
    super(label, collapsibleState);
    this.description = description;
  }
}

// --- Agent Tree ---

type AgentTreeNode = AgentCategoryItem | AgentLeafItem;

/** Threshold above which agents are grouped into categories */
const AGENT_CATEGORY_THRESHOLD = 20;

class AgentTreeProvider implements vscode.TreeDataProvider<AgentTreeNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<AgentTreeNode | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private ws: vscode.WorkspaceFolder) {}

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: AgentTreeNode): vscode.TreeItem {
    return element;
  }

  getChildren(element?: AgentTreeNode): AgentTreeNode[] {
    const agentsDir = path.join(this.ws.uri.fsPath, '.github', 'agents');
    if (!fs.existsSync(agentsDir)) {
      return [new AgentLeafItem('No agents found', 'Run OMG: Initialize Workspace', '')];
    }

    const files = fs.readdirSync(agentsDir)
      .filter(f => f.endsWith('.agent.md'))
      .sort();

    if (!element) {
      // Top level — flat list when at/below threshold, grouped above
      if (files.length <= AGENT_CATEGORY_THRESHOLD) {
        return files.map(f => this.fileToLeaf(agentsDir, f));
      }
      // Grouped: language reviewers (name ends with -reviewer) vs core
      const reviewerFiles = files.filter(f => f.includes('-reviewer'));
      const coreFiles = files.filter(f => !f.includes('-reviewer'));
      const categories: AgentCategoryItem[] = [];
      if (coreFiles.length > 0) {
        categories.push(new AgentCategoryItem('Core Agents', coreFiles.map(f => this.fileToLeaf(agentsDir, f))));
      }
      if (reviewerFiles.length > 0) {
        categories.push(new AgentCategoryItem('Language Reviewers', reviewerFiles.map(f => this.fileToLeaf(agentsDir, f))));
      }
      return categories;
    }

    if (element instanceof AgentCategoryItem) {
      return element.children;
    }

    return [];
  }

  private fileToLeaf(agentsDir: string, file: string): AgentLeafItem {
    const name = file.replace('.agent.md', '');
    const content = fs.readFileSync(path.join(agentsDir, file), 'utf-8');
    const descMatch = content.match(/description:\s*>\s*\n\s*(.+)/);
    const desc = descMatch ? descMatch[1].trim() : '';
    const item = new AgentLeafItem(`@${name}`, desc, path.join(agentsDir, file));
    return item;
  }
}

class AgentCategoryItem extends vscode.TreeItem {
  constructor(label: string, public readonly children: AgentLeafItem[]) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);
    this.iconPath = new vscode.ThemeIcon('folder');
    this.description = `${children.length}`;
  }
}

class AgentLeafItem extends vscode.TreeItem {
  constructor(label: string, description: string, filePath: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.iconPath = new vscode.ThemeIcon('person');
    if (filePath) {
      this.resourceUri = vscode.Uri.file(filePath);
      this.command = {
        command: 'vscode.open',
        title: 'Open Agent Definition',
        arguments: [vscode.Uri.file(filePath)],
      };
    }
  }
}

/** @deprecated Use AgentLeafItem instead */
class AgentItem extends AgentLeafItem {
  constructor(label: string, description: string) {
    super(label, description, '');
  }
}

// --- PRD Tree ---

class PrdTreeProvider implements vscode.TreeDataProvider<PrdItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<PrdItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private ws: vscode.WorkspaceFolder) {}

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: PrdItem): vscode.TreeItem {
    return element;
  }

  getChildren(): PrdItem[] {
    const prdPath = path.join(this.ws.uri.fsPath, '.omg', 'prd.json');
    if (!fs.existsSync(prdPath)) {
      return [new PrdItem('No PRD found', 'Start a ralph or omg-autopilot workflow', false)];
    }

    try {
      const prd = JSON.parse(fs.readFileSync(prdPath, 'utf-8'));
      const items: PrdItem[] = [];

      if (prd.title) {
        items.push(new PrdItem(`📋 ${prd.title}`, '', false));
      }

      if (Array.isArray(prd.stories)) {
        for (const story of prd.stories) {
          const icon = story.passes ? '✅' : '⬜';
          items.push(new PrdItem(`${icon} ${story.title}`, story.id, story.passes));
        }
      }

      return items.length > 0 ? items : [new PrdItem('PRD is empty', '', false)];
    } catch {
      return [new PrdItem('Error reading PRD', 'Check .omg/prd.json', false)];
    }
  }
}

class PrdItem extends vscode.TreeItem {
  constructor(label: string, description: string, passes: boolean) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.iconPath = passes ? new vscode.ThemeIcon('pass') : undefined;
  }
}
