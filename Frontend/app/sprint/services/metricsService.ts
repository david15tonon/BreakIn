// Ce service est interne et ne doit pas être importé directement par les développeurs

interface InternalDeveloperMetrics {
  name: string;
  role: string;
  commits: number;
  prs_merged: number;
  bugs_fixed: number;
  lines_of_code: number;
  ai_evaluation: {
    maintainability_index: number;
  };
}

interface InternalSprintEvaluation {
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

// Données de démonstration - en production, cela viendrait d'une API
const demoDevelopers: InternalDeveloperMetrics[] = [
  {
    name: "Alex Dupont",
    role: "Développeur Full Stack",
    commits: 42,
    prs_merged: 12,
    bugs_fixed: 8,
    lines_of_code: 12500,
    ai_evaluation: { maintainability_index: 0.82 }
  },
  // ... autres développeurs
];

const demoEvaluation: InternalSprintEvaluation = {
  team_score: 84,
  team_breakdown: {
    delivery: 82,
    code_quality: 85,
    collaboration: 88,
    creativity: 76
  },
  individual_scores: [
    // ... données d'évaluation
  ]
};

// Fonction pour obtenir les métriques des développeurs
export function getDeveloperMetrics() {
  // En production, cela ferait un appel API
  return Promise.resolve(demoDevelopers);
}

// Fonction pour obtenir l'évaluation du sprint
export function getSprintEvaluation() {
  // En production, cela ferait un appel API
  return Promise.resolve(demoEvaluation);
}

// Fonction pour calculer la progression globale
export function calculateSprintProgress(features: Array<{ progress: number }>) {
  if (features.length === 0) return 0;
  const total = features.reduce((sum, f) => sum + f.progress, 0);
  return total / features.length;
}
