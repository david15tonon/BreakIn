import os
from typing import Dict, List, Optional
from app.models.evaluation import TeamEvaluationRequest, TeamEvaluationResponse

class AIEvaluator:
    def __init__(self):
        self.api_url = os.getenv("AI_EVALUATION_URL", "https://api.breakin.ai/evaluate")
        self.api_key = os.getenv("AI_API_KEY", "your-ai-api-key")
    
    async def evaluate_team_performance(self, request: TeamEvaluationRequest) -> TeamEvaluationResponse:
        """Envoie les données à l'IA pour évaluation et retourne les résultats"""
        try:
            # Pour l'instant, on utilise l'évaluation locale en attendant l'intégration HTTP
            return self._local_evaluation_fallback(request)
            
        except Exception as e:
            print(f"AI evaluation failed: {e}")
            return self._local_evaluation_fallback(request)
    
    def _local_evaluation_fallback(self, request: TeamEvaluationRequest) -> TeamEvaluationResponse:
        """Évaluation de fallback locale quand l'IA n'est pas disponible"""
        # Logique d'évaluation simplifiée
        team_score = int(sum(dev.ai_evaluation.maintainability_index 
                           for dev in request.developers) / len(request.developers) * 100)
        
        individual_scores = []
        for dev in request.developers:
            score = int(dev.ai_evaluation.maintainability_index * 100)
            individual_scores.append({
                "name": dev.name,
                "pseudonym": dev.pseudonym,
                "score": score,
                "breakdown": {
                    "code_quality": score,
                    "contribution": dev.commits * 2,
                    "collaboration": dev.reviews_given * 5,
                    "creativity": dev.creativity_points * 10
                },
                "strengths": ["Reliable code delivery", "Good team collaboration"],
                "growth_suggestions": ["Improve code documentation", "Increase test coverage"]
            })
        
        return TeamEvaluationResponse(
            team_score=team_score,
            team_breakdown={
                "delivery": int((request.completed_tasks / request.total_tasks) * 100),
                "code_quality": team_score,
                "collaboration": 75,
                "creativity": 70
            },
            individual_scores=individual_scores,
            recommendations=[
                "Focus on completing pending tasks",
                "Improve code review process",
                "Increase test coverage"
            ]
        )