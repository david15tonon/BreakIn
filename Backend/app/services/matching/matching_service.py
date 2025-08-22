"""Core matching service orchestrating candidate recommendations."""
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException

from app.models.matching.candidate_model import CandidateMatchProfile
from app.models.matching.company_model import CompanyMatchProfile
from app.models.matching.recommendation_model import Recommendation, MatchScore
from app.models.matching.match_event_model import MatchEvent, MatchAudit
from app.schemas.matching.match_request_schema import MatchRequest, CandidateScore
from app.services.matching.feature_service import FeatureService
from app.services.matching.scoring_service import ScoringService
from app.services.matching.fairness_service import FairnessService
from app.services.matching.privacy_service import PrivacyService
from app.utils.matching.cache import cache_result

class MatchingService:
    """Service for matching candidates to companies."""

    def __init__(self, 
                 db: AsyncIOMotorDatabase,
                 feature_service: FeatureService,
                 scoring_service: ScoringService,
                 fairness_service: FairnessService,
                 privacy_service: PrivacyService):
        """Initialize matching service.
        
        Args:
            db: Database connection
            feature_service: Service for computing features
            scoring_service: Service for scoring matches
            fairness_service: Service for applying fairness constraints
            privacy_service: Service for privacy rules
        """
        self.db = db
        self.feature_service = feature_service
        self.scoring_service = scoring_service
        self.fairness_service = fairness_service
        self.privacy_service = privacy_service
        
        # Constants
        self.MODEL_VERSION = "v1.0"
        self.CACHE_TTL = 900  # 15 minutes
        
    async def get_candidate_pool(self, request: MatchRequest) -> List[CandidateMatchProfile]:
        """Get initial candidate pool applying hard filters.
        
        Args:
            request: Match request with filters
            
        Returns:
            List of candidates meeting basic criteria
        """
        # Build query
        query = {
            "availability_status": "open",
            "anonymized_view": True
        }
        
        # Apply orbit/seniority filter
        if request.role.seniority != "any":
            if request.role.seniority == "junior":
                query["$or"] = [
                    {"orbit": "core"},
                    {"orbit": "experienced", "apply_as_junior": True}
                ]
            else:
                query["orbit"] = "experienced"
        
        # Required skills (must have)
        if request.role.must_have:
            query["skills"] = {"$all": request.role.must_have}
            
        # Remote/location requirements
        if not request.filters.remote:
            query["relocation_possible"] = True
            
        # Timezone if specified
        if request.filters.timezone_overlap:
            tz_min, tz_max = request.filters.timezone_overlap.split("..")
            query["timezone"] = {"$gte": tz_min, "$lte": tz_max}
            
        # Reputation threshold
        if request.filters.min_reputation:
            query["reputation_score"] = {"$gte": request.filters.min_reputation}
            
        # Get candidates
        cursor = self.db.candidates.find(query)
        candidates = await cursor.to_list(length=100)  # Get larger pool for ranking
        
        return [CandidateMatchProfile(**c) for c in candidates]
        
    @cache_result(ttl=900)  # 15 min cache
    async def match_candidates(self, request: MatchRequest) -> List[CandidateScore]:
        """Find and rank candidates matching the request.
        
        Args:
            request: Match request with role and filters
            
        Returns:
            Ranked list of matching candidates
        """
        # Get initial pool
        candidates = await self.get_candidate_pool(request)
        
        if not candidates:
            return []
            
        # Get company profile
        company = await self.db.companies.find_one({"_id": request.company_id})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        company_profile = CompanyMatchProfile(**company)
        
        # Compute features
        candidate_features = await self.feature_service.compute_batch(
            candidates=candidates,
            role=request.role,
            company=company_profile
        )
        
        # Score candidates
        scores = await self.scoring_service.score_batch(
            candidates=candidates,
            features=candidate_features,
            role=request.role,
            company=company_profile
        )
        
        # Apply fairness constraints
        scores = await self.fairness_service.apply_constraints(
            scores=scores,
            candidates=candidates,
            company=company_profile
        )
        
        # Sort by score and limit
        scores.sort(key=lambda x: x.final_score, reverse=True)
        top_k = scores[:request.filters.max_candidates]
        
        # Create recommendations
        recommendations = []
        for i, (candidate, score) in enumerate(zip(candidates, top_k)):
            # Create recommendation record
            rec = Recommendation(
                request_id=request.request_id,
                company_id=request.company_id,
                candidate_id=candidate.id,
                scores=score,
                rank=i + 1,
                model_version=self.MODEL_VERSION,
                feature_version=candidate.feature_version,
            )
            
            # Apply privacy rules
            anon_id = await self.privacy_service.get_anonymous_handle(
                candidate_id=candidate.id,
                company_id=request.company_id
            )
            rec.anonymized_handle = anon_id
            rec.reveal_allowed = await self.privacy_service.can_reveal_details(
                candidate_id=candidate.id,
                company_id=request.company_id
            )
            
            # Save recommendation
            await self.db.recommendations.insert_one(rec.dict())
            
            # Create candidate score response
            recommendations.append(CandidateScore(
                anon_id=rec.anonymized_handle,
                score=score.final_score,
                reasons=score.ranking_reasons,
                feature_scores={
                    "technical": score.technical_fit,
                    "role_fit": score.role_fit,
                    "soft_skills": score.soft_skills,
                    "growth": score.growth,
                    "availability": score.availability,
                    "trust": score.trust
                },
                rank=rec.rank,
                reveal_allowed=rec.reveal_allowed
            ))
            
            # Create audit log
            audit = MatchAudit(
                recommendation_id=rec.id,
                company_id=request.company_id,
                candidate_id=candidate.id,
                request_id=request.request_id,
                scores=score.feature_values,
                rank=rec.rank,
                model_version=self.MODEL_VERSION,
                feature_version=candidate.feature_version,
                weights_snapshot=self.scoring_service.get_current_weights(),
                fairness_adjustments=score.adjustment_factors,
                actor_id="system"
            )
            await self.db.match_audit.insert_one(audit.dict())
            
        return recommendations
        
    async def process_match_event(self, 
                                recommendation_id: str,
                                event_type: str,
                                event_data: Dict = None) -> None:
        """Process a match event (view, invite etc).
        
        Args:
            recommendation_id: ID of recommendation
            event_type: Type of event
            event_data: Additional event data
        """
        # Get recommendation
        rec = await self.db.recommendations.find_one({"_id": recommendation_id})
        if not rec:
            raise HTTPException(status_code=404, detail="Recommendation not found")
            
        # Create event
        event = MatchEvent(
            recommendation_id=recommendation_id,
            company_id=rec["company_id"],
            candidate_id=rec["candidate_id"],
            event_type=event_type,
            event_data=event_data or {},
            source="ui"
        )
        
        # Set timestamp based on event type
        if event_type == "view":
            event.viewed_at = datetime.utcnow()
        elif event_type == "invite":
            event.invited_at = datetime.utcnow()
        elif event_type == "accept":
            event.responded_at = datetime.utcnow()
        elif event_type == "interview":
            event.interview_at = datetime.utcnow()
        elif event_type == "hire":
            event.hired_at = datetime.utcnow()
            
        # Save event
        await self.db.match_events.insert_one(event.dict())
        
        # Update recommendation status
        update = {"$set": {"status": event_type, "updated_at": datetime.utcnow()}}
        if event_data and "feedback" in event_data:
            if event.source == "company":
                update["$set"]["company_feedback"] = event_data["feedback"]
            else:
                update["$set"]["candidate_feedback"] = event_data["feedback"]
                
        await self.db.recommendations.update_one(
            {"_id": recommendation_id},
            update
        )
