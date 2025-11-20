export enum AppState {
  IDLE = 'IDLE',
  CLONING = 'CLONING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface Vulnerability {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  description: string;
  location: string;
}

export interface RefactoredFile {
  filename: string;
  originalContent: string;
  newContent: string;
  changesSummary: string[];
}

export interface AnalysisResult {
  summary: string;
  vulnerabilities: Vulnerability[];
  files: RefactoredFile[];
  tokensUsed: number;
}

export interface MockFile {
  name: string;
  content: string;
}