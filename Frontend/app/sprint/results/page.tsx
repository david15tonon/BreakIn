import { EvaluationResults } from '../components/EvaluationResults';

// Définir les données d'évaluation ici
const evaluationData = {
  totalSnapshots: 15,
  averageScore: 8.2,
  lastEvaluation: {
    score: 8.5,
    feedback: "Excellent code structure with good efficiency. Consider adding more error handling for edge cases.",
    metrics: {
      codeQuality: 8.7,
      efficiency: 8.2,
      problemSolving: 8.0,
      creativity: 7.8
    },
    suggestions: [
      "Add input validation for payment amounts",
      "Implement retry logic for failed transactions",
      "Consider adding logging for debugging"
    ]
  },
  timeline: [
    { time: "2024-01-15T10:00:00Z", score: 7.2 },
    { time: "2024-01-15T10:15:00Z", score: 7.8 },
    { time: "2024-01-15T10:30:00Z", score: 8.3 },
    { time: "2024-01-15T10:45:00Z", score: 8.5 }
  ]
};

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#0e1628] text-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sprint Results</h1>
          <p className="text-slate-400">Your performance evaluation and feedback</p>
        </div>

        {/* Evaluation Results */}
        <EvaluationResults evaluation={evaluationData} />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Back to Sprint
          </button>
          <button
            onClick={() => window.location.href = '/sprint'}
            className="px-6 py-2 bg-emerald-500 text-emerald-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors"
          >
            New Sprint
          </button>
        </div>
      </div>
    </div>
  );
}