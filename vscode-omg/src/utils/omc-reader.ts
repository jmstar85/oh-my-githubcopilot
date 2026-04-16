import * as fs from 'fs';
import * as path from 'path';

/**
 * Read and parse .omg state files. Pure filesystem logic, no vscode dependency.
 */

export interface WorkflowState {
  mode: string;
  active: boolean;
  current_phase?: number;
  phase_name?: string;
  updated_at?: string;
}

export function getActiveWorkflows(stateDir: string): WorkflowState[] {
  if (!fs.existsSync(stateDir)) return [];

  const active: WorkflowState[] = [];
  const files = fs.readdirSync(stateDir).filter(f => f.endsWith('-state.json'));

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(stateDir, file), 'utf-8'));
      if (data.active) {
        active.push({
          mode: file.replace('-state.json', ''),
          active: true,
          current_phase: data.current_phase,
          phase_name: data.phase_name,
          updated_at: data.updated_at,
        });
      }
    } catch {
      // Skip malformed files
    }
  }

  return active;
}

export interface PrdData {
  title: string;
  stories: Array<{
    id: string;
    title: string;
    passes: boolean;
    description?: string;
    acceptance_criteria?: string[];
  }>;
}

export function readPrd(prdPath: string): PrdData | null {
  if (!fs.existsSync(prdPath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(prdPath, 'utf-8'));
    return data as PrdData;
  } catch {
    return null;
  }
}
