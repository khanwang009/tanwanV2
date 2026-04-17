export interface TemplateConfig {
  id: string;
  code: string;
  name: string;
  renderer: string;
  category: string;
}

export interface LevelConfig {
  id: string;
  templateId: string;
  title: string;
  goal: string;
  difficulty: 'easy' | 'medium' | 'hard';
  levelType: 'diagnostic' | 'understanding' | 'transfer' | 'review';
  knowledgeNodeId: string;
  params?: any; // Template-specific payload
}

export interface LevelAttempt {
  levelId: string;
  knowledgeNodeId: string;
  startTime: number;
  endTime: number;
  timeSpentMs: number;
  isCorrect: boolean;
  score: number;
  errorTypesMatched?: string[];
  submittedData: any;
}

export interface LevelResult {
  isCorrect: boolean;
  score: number;
  feedbackText: string;
  matchedErrorType?: string;
  providedData: any;
}

export interface TrainingPack {
  id: string;
  studentId: string;
  themeName: string;
  status: 'draft' | 'published' | 'completed';
  sourceDiagnosisIds: string[];
  knowledgeNodeIds: string[];
  errorTypeCodes: string[];
  primaryTemplateId: string;
  levelIds: string[];
  suggestedFlow: string[];
  levels?: LevelConfig[]; // Hydrated
}

export interface RemediationRule {
  errorTypeCode: string;
  targetTemplateId: string;
}

export interface RendererProps {
  level: LevelConfig;
  onComplete: (result: LevelResult) => void;
}
