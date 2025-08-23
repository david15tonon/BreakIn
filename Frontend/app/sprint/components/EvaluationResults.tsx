interface EvaluationMetric {
  codeQuality: number;
  efficiency: number;
  problemSolving: number;
  creativity: number;
}

interface Evaluation {
  score: number;
  feedback: string;
  metrics: EvaluationMetric;
  suggestions: string[];
}

interface EvaluationResultsProps {
  evaluation: {
    totalSnapshots: number;
    averageScore: number;
    lastEvaluation: Evaluation | null;
    timeline: Array<{ time: string; score: number }>;
  };
}

// Helper function to format metric names
const formatMetricName = (key: string): string => {
  const names: Record<string, string> = {
    codeQuality: "Code Quality",
    efficiency: "Efficiency",
    problemSolving: "Problem Solving",
    creativity: "Creativity"
  };
  return names[key] || key.replace(/([A-Z])/g, ' $1');
};

export function EvaluationResults({ evaluation }: EvaluationResultsProps) {
  if (!evaluation.lastEvaluation) {
    return (
      <div className="text-center p-8 text-slate-400">
        No evaluation data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">
            {evaluation.averageScore.toFixed(1)}/10
          </div>
          <div className="text-sm text-slate-400">Average Score</div>
        </div>
        
        <div className="text-center p-4 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-cyan-400">
            {evaluation.totalSnapshots}
          </div>
          <div className="text-sm text-slate-400">Code Snapshots</div>
        </div>
        
        <div className="text-center p-4 bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">
            {evaluation.lastEvaluation.metrics.codeQuality.toFixed(1)}/10
          </div>
          <div className="text-sm text-slate-400">Code Quality</div>
        </div>
      </div>

      <div className="p-6 bg-slate-800/50 rounded-lg">
        <h4 className="font-semibold text-slate-200 mb-3">AI Feedback</h4>
        <p className="text-slate-300 mb-4">{evaluation.lastEvaluation.feedback}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {(Object.entries(evaluation.lastEvaluation.metrics) as [keyof EvaluationMetric, number][]).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-bold text-cyan-300">
                {value.toFixed(1)}
              </div>
              <div className="text-xs text-slate-400">
                {formatMetricName(key)}
              </div>
            </div>
          ))}
        </div>

        {evaluation.lastEvaluation.suggestions.length > 0 && (
          <div>
            <h5 className="font-semibold text-slate-200 mb-2">Suggestions</h5>
            <ul className="text-sm text-amber-300 space-y-1">
              {evaluation.lastEvaluation.suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}