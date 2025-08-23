'use client';

import { useState, useEffect } from 'react';

interface SprintEvaluationProps {
  sprintId: string;
}

// Définition des types pour l'évaluation
interface Evaluation {
  team_score: number;
  team_breakdown: {
    delivery: number;
    code_quality: number;
    collaboration: number;
    creativity: number;
  };
  individual_scores: Array<{
    name: string;
    pseudonym: string;
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
  recommendations: string[];
}

export default function SprintEvaluation({ sprintId }: SprintEvaluationProps) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluation();
  }, [sprintId]);

  const fetchEvaluation = async () => {
    try {
      const res = await fetch(`/api/sprint/${sprintId}/evaluate`);
      const data: Evaluation = await res.json();
      setEvaluation(data);
    } catch (error) {
      console.error('Failed to fetch evaluation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-slate-400">Loading evaluation...</div>;
  if (!evaluation) return <div className="text-slate-400">No evaluation available</div>;

  return (
    <div className="space-y-6">
      {/* Team Score */}
      <div className="text-center p-6 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-bold text-emerald-400">
          Team Score: {evaluation.team_score}/100
        </h2>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {Object.entries(evaluation.team_breakdown).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-semibold text-slate-200">{value}/100</div>
              <div className="text-sm text-slate-400 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Scores */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-200">Individual Performance</h3>
        <div className="space-y-4">
          {evaluation.individual_scores.map((dev) => (
            <div key={dev.pseudonym} className="p-4 bg-slate-800 rounded-lg">
              <h4 className="font-semibold text-slate-200">{dev.name}</h4>
              <div className="text-emerald-400 text-lg font-bold">{dev.score}/100</div>
              
              <div className="grid grid-cols-4 gap-4 mt-2">
                {Object.entries(dev.breakdown).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-sm text-slate-200">{value}/100</div>
                    <div className="text-xs text-slate-400 capitalize">{key}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <h5 className="text-sm font-semibold text-slate-200">Strengths</h5>
                <ul className="text-sm text-emerald-400">
                  {dev.strengths.map((strength: string, index: number) => (
                    <li key={index}>✓ {strength}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-2">
                <h5 className="text-sm font-semibold text-slate-200">Growth Areas</h5>
                <ul className="text-sm text-amber-400">
                  {dev.growth_suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {evaluation.recommendations && evaluation.recommendations.length > 0 && (
        <div className="p-4 bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">Recommendations</h3>
          <ul className="text-sm text-blue-300">
            {evaluation.recommendations.map((recommendation: string, index: number) => (
              <li key={index} className="mb-1">• {recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}