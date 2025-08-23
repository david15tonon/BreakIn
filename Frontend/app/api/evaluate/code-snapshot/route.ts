// app/api/evaluate/code-snapshot/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface CodeSnapshot {
  code: string;
  timestamp: string;
  metrics: any;
  userId: string;
  sprintId: string;
  taskId: string;
}

export async function POST(request: NextRequest) {
  try {
    const snapshot: CodeSnapshot = await request.json();

    // Simulation de l'évaluation IA
    const evaluation = await evaluateCodeWithAI(snapshot);

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'Evaluation failed' },
      { status: 500 }
    );
  }
}

async function evaluateCodeWithAI(snapshot: CodeSnapshot) {
  // Ici vous intégrerez votre vrai service IA
  // Pour l'instant, simulation basée sur des règles

  const { code, metrics } = snapshot;
  
  // Analyse simple du code
  const lines = code.split('\n').length;
  const comments = (code.match(/\/\/|\/\*/g) || []).length;
  const commentRatio = lines > 0 ? comments / lines : 0;
  
  // Métriques de performance
  const efficiencyScore = Math.min(10, metrics.focusTime / metrics.elapsedTime * 10);
  const activityScore = Math.min(10, metrics.keystrokes / 100);
  
  // Score basé sur des règles simples
  const baseScore = 6 + Math.random() * 2; // Base 6-8
  const codeQuality = Math.min(10, baseScore + commentRatio * 2);
  const efficiency = Math.min(10, efficiencyScore * 0.7 + activityScore * 0.3);
  
  const finalScore = Math.round((codeQuality * 0.6 + efficiency * 0.4) * 10) / 10;

  return {
    score: finalScore,
    feedback: getFeedbackBasedOnScore(finalScore, code),
    metrics: {
      codeQuality: Math.round(codeQuality * 10) / 10,
      efficiency: Math.round(efficiency * 10) / 10,
      problemSolving: Math.min(10, 7 + Math.random() * 2),
      creativity: Math.min(10, 6 + Math.random() * 3)
    },
    suggestions: generateSuggestions(code, finalScore)
  };
}

function getFeedbackBasedOnScore(score: number, code: string): string {
  if (score >= 9) return 'Excellent code! Clean, efficient, and well-structured.';
  if (score >= 7) return 'Good implementation with some minor improvements possible.';
  if (score >= 5) return 'Solid foundation, consider refactoring for better practices.';
  return 'Needs significant improvement in structure and efficiency.';
}

function generateSuggestions(code: string, score: number): string[] {
  const suggestions: string[] = [];
  
  if (code.length < 50) {
    suggestions.push('Consider adding more implementation details');
  }
  
  if ((code.match(/\/\/|\/\*/g) || []).length < 3) {
    suggestions.push('Add more comments to explain your logic');
  }
  
  if (score < 7) {
    suggestions.push('Break down complex functions into smaller, reusable components');
    suggestions.push('Consider error handling for edge cases');
  }
  
  return suggestions.slice(0, 3);
}