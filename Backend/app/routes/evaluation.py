from fastapi import APIRouter, HTTPException, Depends, status
from app.config import db
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import random
from bson import ObjectId
from app.services.ai_evaluator import AIEvaluator
from app.models.evaluation import (
    TeamEvaluationRequest, 
    TeamEvaluationResponse,
    FeatureProgress,
    DeveloperMetrics,
    MentorFeedback,
    AIEvaluation
)

router = APIRouter()
ai_evaluator = AIEvaluator()

class EvaluationRequest(BaseModel):
    sprint_id: str
    user_id: str
    feedback: str
    rating: int = Field(..., ge=1, le=5)

class SprintEvaluationResult(BaseModel):
    sprint_id: str
    team_score: int
    team_breakdown: Dict[str, int]
    individual_scores: List[Dict[str, Any]]
    recommendations: List[str]
    evaluated_at: datetime

def _generate_mock_metrics(sprint_id: str) -> TeamEvaluationRequest:
    """Génère des métriques de test pour l'évaluation"""
    features = [
        FeatureProgress(
            name=f"Feature {i+1}",
            progress=random.uniform(0.5, 1.0) * 100,
            tasks=random.randint(3, 10),
            done=random.randint(1, 10),
            on_time=random.choice([True, False])
        ) for i in range(3)
    ]
    
    developer_names = ["Alex K.", "Jordan M.", "Taylor R.", "Casey P."]
    developers = []
    
    for i, name in enumerate(developer_names):
        developers.append(
            DeveloperMetrics(
                name=name,
                pseudonym=f"dev{i+1}",
                experience_level=random.choice(["junior", "mid", "senior"]),
                skills=["Python", "FastAPI", "React"],
                role=random.choice(["Backend", "Frontend", "Fullstack"]),
                commits=random.randint(5, 30),
                prs_opened=random.randint(1, 10),
                prs_merged=random.randint(1, 8),
                bugs_fixed=random.randint(0, 5),
                bugs_reported=random.randint(0, 5),
                coverage=random.uniform(60, 95),
                lines_of_code=random.randint(500, 5000),
                status_log={"active": 8, "review": 2, "idle": 1},
                reviews_given=random.randint(1, 10),
                reviews_received=random.randint(1, 10),
                notes_activity=random.randint(0, 20),
                creativity_points=random.randint(1, 10),
                mentor_feedback=MentorFeedback(
                    technical_strength=random.uniform(3, 5),
                    collaboration=random.uniform(3, 5),
                    originality=random.uniform(2, 5),
                    growth_suggestions="Great work! Keep improving your documentation."
                ),
                ai_evaluation=AIEvaluation(
                    maintainability_index=random.uniform(0.6, 1.0),
                    refactor_acceptance_rate=random.uniform(0.5, 1.0),
                    bugs_detected=random.randint(0, 3),
                    regressions=random.randint(0, 2)
                )
            )
        )
    
    return TeamEvaluationRequest(
        team=f"Team-{sprint_id[:4]}",
        sprint_id=sprint_id,
        features=features,
        developers=developers,
        sprint_duration=random.randint(1, 4),
        completed_tasks=sum(f.done for f in features),
        total_tasks=sum(f.tasks for f in features)
    )

@router.post("/evaluate", response_model=SprintEvaluationResult)
async def evaluate_sprint(eval_data: EvaluationRequest):
    """Évalue un sprint terminé et retourne les résultats"""
    # Vérifier si le sprint existe et appartient à l'utilisateur
    sprint = db.sprints.find_one({
        "_id": eval_data.sprint_id,
        "user_id": eval_data.user_id,
        "status": "completed"
    })
    
    if not sprint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sprint not found or not completed"
        )
    
    # Vérifier si une évaluation existe déjà
    existing_eval = db.sprint_evaluations.find_one({"sprint_id": eval_data.sprint_id})
    if existing_eval:
        return existing_eval
    
    # Générer ou récupérer les métriques du sprint
    metrics = _generate_mock_metrics(eval_data.sprint_id)
    
    # Obtenir l'évaluation de l'IA
    evaluation = await ai_evaluator.evaluate_team_performance(metrics)
    
    # Enregistrer les résultats
    result = {
        "sprint_id": eval_data.sprint_id,
        "team_score": evaluation.team_score,
        "team_breakdown": evaluation.team_breakdown,
        "individual_scores": [
            {
                "name": score.name,
                "pseudonym": score.pseudonym,
                "score": score.score,
                "breakdown": score.breakdown,
                "strengths": score.strengths,
                "growth_suggestions": score.growth_suggestions
            } for score in evaluation.individual_scores
        ],
        "recommendations": evaluation.recommendations,
        "evaluated_at": datetime.utcnow(),
        "user_feedback": {
            "rating": eval_data.rating,
            "comments": eval_data.feedback
        }
    }
    
    # Sauvegarder dans la base de données
    db.sprint_evaluations.insert_one(result)
    
    # Mettre à jour le statut du sprint
    db.sprints.update_one(
        {"_id": eval_data.sprint_id},
        {"$set": {"status": "evaluated"}}
    )
    
    return result

@router.get("/{sprint_id}", response_model=SprintEvaluationResult)
async def get_evaluation(sprint_id: str, user_id: str):
    """Récupère les résultats d'évaluation d'un sprint"""
    # Vérifier que l'utilisateur a accès à ce sprint
    sprint = db.sprints.find_one({
        "_id": sprint_id,
        "user_id": user_id
    })
    
    if not sprint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sprint not found or access denied"
        )
    
    # Récupérer l'évaluation
    evaluation = db.sprint_evaluations.find_one({"sprint_id": sprint_id})
    
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evaluation not found"
        )
    
    return evaluation

@router.post("/sprint/{sprint_id}/evaluate")
async def evaluate_sprint_endpoint(sprint_id: str, team_metrics: Dict[str, Any]):
    """Endpoint pour évaluer un sprint avec des métriques d'équipe"""
    try:
        from app.models.evaluation import TeamEvaluationRequest
        request_data = TeamEvaluationRequest(**team_metrics)
        
        # Envoyer à l'IA pour évaluation
        evaluator = AIEvaluator()
        evaluation = await evaluator.evaluate_team_performance(request_data)
        
        # Stocker les résultats
        db.sprint_evaluations.insert_one({
            "sprint_id": sprint_id,
            "evaluation": evaluation.dict(),
            "evaluated_at": datetime.now(),
            "ai_model": "breakin-evaluator-v1"
        })
        
        return evaluation
        
    except Exception as e:
        raise HTTPException(500, f"Evaluation failed: {str(e)}")

@router.get("/sprint/{sprint_id}/evaluation")
async def get_sprint_evaluation(sprint_id: str):
    """Récupère l'évaluation d'un sprint"""
    evaluation = db.sprint_evaluations.find_one(
        {"sprint_id": sprint_id},
        sort=[("evaluated_at", -1)]
    )
    
    if not evaluation:
        raise HTTPException(404, "No evaluation found for this sprint")
    
    return evaluation["evaluation"]

@router.get("/user/{pseudonym}/evaluations")
async def get_user_evaluations(pseudonym: str):
    """Récupère toutes les évaluations d'un utilisateur"""
    evaluations = list(db.sprint_evaluations.find({
        "evaluation.individual_scores.pseudonym": pseudonym
    }))
    
    return [{
        "sprint_id": eval["sprint_id"],
        "evaluated_at": eval["evaluated_at"],
        "user_score": next(
            (score for score in eval["evaluation"]["individual_scores"] 
             if score["pseudonym"] == pseudonym),
            {}
        )
    } for eval in evaluations]