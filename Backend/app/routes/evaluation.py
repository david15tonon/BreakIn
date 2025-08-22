from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from app.config import db  # Import correct de la base de données
from app.services.metrics_collector import MetricsCollector
from app.services.ai_evaluator import AIEvaluator
from app.models.evaluation import TeamEvaluationResponse

router = APIRouter()

@router.get("/sprint/{sprint_id}/evaluate", response_model=TeamEvaluationResponse)
async def evaluate_sprint(sprint_id: str):
    """Endpoint principal pour l'évaluation d'un sprint par l'IA"""
    try:
        # Collecter les métriques
        collector = MetricsCollector(sprint_id)
        team_metrics = await collector.collect_team_metrics()
        
        # Convertir en TeamEvaluationRequest
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