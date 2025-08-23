"""Routes for matching candidates to roles."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.matching.match_request_schema import (
    MatchRequest,
    MatchResponse,
    CandidateScore
)
from app.services.matching.matching_service import MatchingService
from app.services.matching.feature_service import FeatureService
from app.services.matching.scoring_service import ScoringService
from app.services.matching.fairness_service import FairnessService
from app.services.matching.privacy_service import PrivacyService
from app.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/match", response_model=MatchResponse)
async def match_candidates(
    request: MatchRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Find matching candidates for a role.
    
    Args:
        request: Match request with role and filters
        db: Database connection
        current_user: Authenticated user
        
    Returns:
        Ranked list of matching candidates
    """
    # Verify company access
    if current_user["company_id"] != request.company_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to request matches for this company"
        )
        
    # Initialize services
    feature_service = FeatureService(db)
    scoring_service = ScoringService()
    fairness_service = FairnessService(db)
    privacy_service = PrivacyService(db)
    
    matching_service = MatchingService(
        db=db,
        feature_service=feature_service,
        scoring_service=scoring_service,
        fairness_service=fairness_service,
        privacy_service=privacy_service
    )
    
    # Get matches
    recommendations = await matching_service.match_candidates(request)
    
    return MatchResponse(
        request_id=request.request_id or str(request.created_at),
        results=recommendations,
        model_version=matching_service.MODEL_VERSION,
        generated_at=request.created_at
    )
    
@router.post("/match/{recommendation_id}/event")
async def record_match_event(
    recommendation_id: str,
    event_type: str,
    event_data: Optional[dict] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Record a match event (view, invite etc).
    
    Args:
        recommendation_id: ID of recommendation
        event_type: Type of event
        event_data: Additional event data
        db: Database connection
        current_user: Authenticated user
    """
    # Get recommendation
    rec = await db.recommendations.find_one({"_id": recommendation_id})
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
        
    # Verify company access
    if current_user["company_id"] != rec["company_id"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to record events for this recommendation"
        )
        
    # Initialize service
    matching_service = MatchingService(
        db=db,
        feature_service=FeatureService(db),
        scoring_service=ScoringService(),
        fairness_service=FairnessService(db),
        privacy_service=PrivacyService(db)
    )
    
    # Record event
    await matching_service.process_match_event(
        recommendation_id=recommendation_id,
        event_type=event_type,
        event_data=event_data
    )
    
    return {"status": "success"}
    
@router.get("/match/company/{company_id}/history")
async def get_match_history(
    company_id: str,
    status: Optional[str] = None,
    limit: int = 20,
    skip: int = 0,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get match history for a company.
    
    Args:
        company_id: Company ID
        status: Filter by status
        limit: Page size
        skip: Offset
        db: Database connection
        current_user: Authenticated user
        
    Returns:
        List of past recommendations
    """
    # Verify company access
    if current_user["company_id"] != company_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view matches for this company"
        )
        
    # Build query
    query = {"company_id": company_id}
    if status:
        query["status"] = status
        
    # Get recommendations
    cursor = db.recommendations.find(query)
    cursor = cursor.sort("created_at", -1).skip(skip).limit(limit)
    recommendations = await cursor.to_list(length=limit)
    
    return recommendations
