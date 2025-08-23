// lib/services/trackingService.ts
interface CodeSnapshot {
  code: string;
  timestamp: string;
  metrics: {
    keystrokes: number;
    elapsedTime: number;
    focusTime: number;
    codeChanges: number;
    tabSwitches: number;
  };
  userId: string;
  sprintId: string;
  taskId: string;
}

interface EvaluationResult {
  score: number;
  feedback: string;
  metrics: {
    codeQuality: number;
    efficiency: number;
    problemSolving: number;
    creativity: number;
  };
  suggestions: string[];
}

export class TrackingService {
  private static instance: TrackingService;
  private snapshots: CodeSnapshot[] = [];
  private evaluationResults: EvaluationResult[] = [];

  static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }
    return TrackingService.instance;
  }

  async trackCodeSnapshot(snapshot: Omit<CodeSnapshot, 'timestamp'>): Promise<void> {
    const fullSnapshot: CodeSnapshot = {
      ...snapshot,
      timestamp: new Date().toISOString()
    };

    this.snapshots.push(fullSnapshot);
    
    // Envoyer à l'évaluateur IA
    await this.sendToEvaluator(fullSnapshot);
  }

  private async sendToEvaluator(snapshot: CodeSnapshot): Promise<void> {
    try {
      const response = await fetch('/api/evaluate/code-snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
      });

      if (response.ok) {
        const result: EvaluationResult = await response.json();
        this.evaluationResults.push(result);
        
        // Déclencher des événements live si nécessaire
        this.triggerLiveFeedback(result);
      }
    } catch (error) {
      console.error('Error sending to evaluator:', error);
    }
  }

  private triggerLiveFeedback(result: EvaluationResult): void {
    // Générer des feedbacks live basés sur l'évaluation
    if (result.metrics.codeQuality < 6) {
      this.addLiveEvent({
        user: 'AI-Evaluator',
        action: 'suggestion',
        message: 'Consider improving code structure and comments'
      });
    }
    
    if (result.metrics.efficiency > 8) {
      this.addLiveEvent({
        user: 'AI-Evaluator', 
        action: 'praise',
        message: 'Great coding efficiency detected!'
      });
    }
  }

  private addLiveEvent(event: { user: string; action: string; message: string }): void {
    // Émettre un événement personnalisé pour le live feed
    window.dispatchEvent(new CustomEvent('live-feedback', { 
      detail: event 
    }));
  }

  getEvaluationSummary() {
    const totalScore = this.evaluationResults.reduce((sum, result) => sum + result.score, 0);
    const averageScore = this.evaluationResults.length > 0 
      ? totalScore / this.evaluationResults.length 
      : 0;

    return {
      totalSnapshots: this.snapshots.length,
      averageScore: Math.round(averageScore * 100) / 100,
      lastEvaluation: this.evaluationResults[this.evaluationResults.length - 1],
      timeline: this.snapshots.map((snapshot, index) => ({
        time: snapshot.timestamp,
        score: this.evaluationResults[index]?.score || 0
      }))
    };
  }

  clearSession(): void {
    this.snapshots = [];
    this.evaluationResults = [];
  }
}