'use client';

import { useState, useEffect } from 'react';
import { getDeveloperMetrics, getSprintEvaluation, calculateSprintProgress } from '../services/metricsService';

export interface FeatureProgress {
  name: string;
  progress: number;
  tasks: number;
  done: number;
  on_time: boolean;
}

export interface DeveloperInfo {
  name: string;
  role: string;
  score: number;
  progress: number;
}

export interface SprintEvaluationSummary {
  teamScore: number;
  developerScores: Array<{
    name: string;
    score: number;
    feedback: {
      strengths: string[];
      improvements: string[];
    };
  }>;
}

export function useSprintMetrics(features: FeatureProgress[]) {
  const [developers, setDevelopers] = useState<DeveloperInfo[]>([]);
  const [evaluation, setEvaluation] = useState<SprintEvaluationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const progress = calculateSprintProgress(features);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Charger les métriques des développeurs
        const devMetrics = await getDeveloperMetrics();
        const devsInfo = devMetrics.map(dev => ({
          name: dev.name,
          role: dev.role,
          score: Math.round(dev.ai_evaluation.maintainability_index * 100),
          progress: Math.min(100, (dev.commits / 50) * 100) // Exemple de calcul de progression
        }));
        
        setDevelopers(devsInfo);

        // Charger l'évaluation du sprint
        const evalData = await getSprintEvaluation();
        const summary: SprintEvaluationSummary = {
          teamScore: evalData.team_score,
          developerScores: evalData.individual_scores.map(dev => ({
            name: dev.name,
            score: dev.score,
            feedback: {
              strengths: dev.strengths,
              improvements: dev.growth_suggestions
            }
          }))
        };
        
        setEvaluation(summary);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load metrics'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    progress,
    developers,
    evaluation,
    isLoading,
    error
  };
}
