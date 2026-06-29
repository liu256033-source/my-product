export type QuestionType = 'choice' | 'calculation' | 'analysis';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface ProgressEntry {
  done: boolean;
  correct: boolean;
  timestamp: number;
}

export type ProgressMap = Record<string, ProgressEntry>;

export const TYPE_LABELS: Record<QuestionType, string> = {
  choice: '选择题',
  calculation: '计算题',
  analysis: '分析题',
};
