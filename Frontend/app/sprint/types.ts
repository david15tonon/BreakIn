export interface CodeSnippet {
  id: string;
  language: string;
  content: string;
  path: string;
  lastModified: string;
}

export interface DeveloperMetrics {
  name: string;
  experience_level: string;
  skills: string[];
  role: string;
  commits: number;
  prs_opened: number;
  prs_merged: number;
  bugs_fixed: number;
  bugs_reported: number;
  coverage: number;
  lines_of_code: number;
  status_log: {
    coding: number;
    review: number;
    testing: number;
  };
  reviews_given: number;
  reviews_received: number;
  notes_activity: number;
  creativity_points: number;
  mentor_feedback: {
    technical_strength: number;
    collaboration: number;
    originality: number;
    growth_suggestions: string;
  };
  ai_evaluation: {
    maintainability_index: number;
    refactor_acceptance_rate: number;
    bugs_detected: number;
    regressions: number;
  };
}

export interface FeatureProgress {
  name: string;
  progress: number;
  tasks: number;
  done: number;
  on_time: boolean;
}

export interface SprintData {
  team: string;
  features: FeatureProgress[];
  developers: DeveloperMetrics[];
}

export interface SprintEvaluation {
  team_score: number;
  team_breakdown: {
    delivery: number;
    code_quality: number;
    collaboration: number;
    creativity: number;
  };
  individual_scores: Array<{
    name: string;
    score: number;
    breakdown: {
      code_quality: number;
      contribution: number;
      collaboration: number;
      creativity: number;
    };
    strengths: string[];
    growth_suggestions: string[];
  }>;
}
