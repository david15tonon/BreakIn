"""Service for scoring candidate matches."""
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import numpy as np

from app.models.matching.candidate_model import CandidateMatchProfile
from app.models.matching.company_model import CompanyMatchProfile
from app.models.matching.recommendation_model import MatchScore
from app.schemas.matching.match_request_schema import RoleRequirements
from app.utils.matching.text_norm import normalize_skills
from app.utils.matching.similarity_utils import (
    compute_skill_overlap,
    compute_culture_match,
    get_sector_alignment
)
from app.utils.matching.decay_utils import time_decay

class ScoringService:
    """Service for scoring candidate-role matches."""

    def __init__(self):
        """Initialize scoring service."""
        # Default weights - can be adjusted per company
        self.weights = {
            "technical_fit": 0.40,  # Technical alignment
            "role_fit": 0.15,      # Role-specific signals
            "soft_skills": 0.15,   # Collaboration & communication
            "growth": 0.10,        # Trajectory & potential
            "availability": 0.10,  # Logistics & timing
            "trust": 0.10          # Reliability & verification
        }
        
        # Thresholds
        self.MIN_SKILL_OVERLAP = 0.4
        self.MIN_SECTOR_MATCH = 0.3
        self.MIN_AVAILABILITY = 0.5
        
    def get_current_weights(self) -> Dict[str, float]:
        """Get current scoring weights."""
        return self.weights.copy()
        
    async def score_batch(self,
                         candidates: List[CandidateMatchProfile],
                         features: Dict[str, Dict[str, float]],
                         role: RoleRequirements,
                         company: CompanyMatchProfile) -> List[MatchScore]:
        """Score a batch of candidates.
        
        Args:
            candidates: List of candidates to score
            features: Pre-computed features for candidates
            role: Role requirements
            company: Company profile
            
        Returns:
            List of match scores
        """
        scores = []
        for candidate in candidates:
            candidate_features = features.get(candidate.id, {})
            score = await self.score_candidate(
                candidate=candidate,
                features=candidate_features,
                role=role,
                company=company
            )
            scores.append(score)
            
        return scores
        
    async def score_candidate(self,
                            candidate: CandidateMatchProfile,
                            features: Dict[str, float],
                            role: RoleRequirements,
                            company: CompanyMatchProfile) -> MatchScore:
        """Score an individual candidate.
        
        Args:
            candidate: Candidate to score
            features: Pre-computed features
            role: Role requirements
            company: Company profile
            
        Returns:
            Match score with components
        """
        # Initialize score components
        technical_fit = await self._compute_technical_fit(
            candidate=candidate,
            role=role,
            features=features
        )
        
        role_fit = await self._compute_role_fit(
            candidate=candidate,
            role=role,
            features=features
        )
        
        soft_skills = await self._compute_soft_skills(
            candidate=candidate,
            features=features
        )
        
        growth = await self._compute_growth_score(
            candidate=candidate,
            features=features
        )
        
        availability = await self._compute_availability(
            candidate=candidate,
            company=company
        )
        
        trust = await self._compute_trust_score(
            candidate=candidate,
            features=features
        )
        
        # Compute weighted final score
        final_score = (
            self.weights["technical_fit"] * technical_fit +
            self.weights["role_fit"] * role_fit +
            self.weights["soft_skills"] * soft_skills +
            self.weights["growth"] * growth + 
            self.weights["availability"] * availability +
            self.weights["trust"] * trust
        )
        
        # Generate explanation reasons
        reasons = []
        if technical_fit > 0.8:
            reasons.append("Strong technical match")
        if role_fit > 0.8:
            reasons.append(f"Great fit for {role.title}")
        if soft_skills > 0.8:
            reasons.append("Excellent collaboration skills")
        if growth > 0.8:
            reasons.append("Strong growth trajectory")
        if availability > 0.9:
            reasons.append("Highly available")
        if trust > 0.9:
            reasons.append("Verified and reliable")
            
        # Add specific signals
        if candidate.sector_counts.get(role.sector, 0) > 2:
            reasons.append(f"Experience in {role.sector}")
        
        culture_match = compute_culture_match(
            candidate.culture_tags,
            company.culture_tags
        )
        if culture_match > 0.7:
            reasons.append("Culture alignment")
            
        return MatchScore(
            technical_fit=technical_fit,
            role_fit=role_fit,
            soft_skills=soft_skills,
            growth=growth,
            availability=availability,
            trust=trust,
            final_score=final_score,
            feature_values=features,
            ranking_reasons=reasons[:3]  # Top 3 reasons
        )
        
    async def _compute_technical_fit(self,
                                   candidate: CandidateMatchProfile,
                                   role: RoleRequirements,
                                   features: Dict[str, float]) -> float:
        """Compute technical fit score."""
        # Normalize skills
        candidate_skills = normalize_skills(candidate.skills)
        required_skills = normalize_skills(role.must_have)
        preferred_skills = normalize_skills(role.nice_to_have)
        
        # Compute overlaps
        required_overlap = compute_skill_overlap(candidate_skills, required_skills)
        preferred_overlap = compute_skill_overlap(candidate_skills, preferred_skills)
        
        if required_overlap < self.MIN_SKILL_OVERLAP:
            return 0.0
            
        # Weight required skills higher
        technical_score = (0.7 * required_overlap + 0.3 * preferred_overlap)
        
        # Factor in reputation
        reputation_factor = min(1.0, candidate.reputation_score / 100.0)
        technical_score *= (0.7 + 0.3 * reputation_factor)
        
        # Consider sector experience
        if role.sector:
            sector_match = get_sector_alignment(
                candidate.sector_counts.get(role.sector, 0)
            )
            if sector_match < self.MIN_SECTOR_MATCH:
                technical_score *= 0.8
            
        return technical_score
        
    async def _compute_role_fit(self,
                               candidate: CandidateMatchProfile,
                               role: RoleRequirements,
                               features: Dict[str, float]) -> float:
        """Compute role-specific fit."""
        score = 0.8  # Base score
        
        # Factor in sprint performance
        sprint_score = features.get("avg_sprint_score", 0.0)
        score *= (0.7 + 0.3 * sprint_score)
        
        # Recent activity bonus
        if features.get("recent_activity", 0) > 0.8:
            score *= 1.1
            
        return min(1.0, score)
        
    async def _compute_soft_skills(self,
                                 candidate: CandidateMatchProfile,
                                 features: Dict[str, float]) -> float:
        """Compute soft skills score."""
        # Base on collaboration score
        score = candidate.soft_skill_score
        
        # Factor in communication signals
        response_rate = candidate.response_rate
        score *= (0.7 + 0.3 * response_rate)
        
        # Leadership bonus if applicable
        if candidate.leadership_score > 0.7:
            score *= 1.1
            
        return min(1.0, score)
        
    async def _compute_growth_score(self,
                                  candidate: CandidateMatchProfile,
                                  features: Dict[str, float]) -> float:
        """Compute growth trajectory score."""
        # Base on reputation growth
        growth = max(0, candidate.growth_slope)
        
        # Factor in learning signals
        if features.get("learning_rate", 0) > 0.7:
            growth *= 1.2
            
        # Recent improvements
        if features.get("recent_improvement", 0) > 0.8:
            growth *= 1.1
            
        return min(1.0, growth)
        
    async def _compute_availability(self,
                                  candidate: CandidateMatchProfile,
                                  company: CompanyMatchProfile) -> float:
        """Compute availability and logistics score."""
        if candidate.availability_status != "open":
            return 0.0
            
        score = 1.0
        
        # Remote vs onsite
        if company.remote_only and not candidate.remote_preference:
            score *= 0.6
            
        # Timezone alignment if specified
        if company.timezone_range:
            tz_min, tz_max = company.timezone_range.split("..")
            candidate_tz = float(candidate.timezone.replace("+", ""))
            tz_min = float(tz_min.replace("+", ""))
            tz_max = float(tz_max.replace("+", ""))
            
            if not (tz_min <= candidate_tz <= tz_max):
                score *= 0.7
                
        # Activity decay
        days_since_active = (datetime.utcnow() - candidate.last_active).days
        activity_decay = time_decay(days_since_active, half_life=30)
        score *= activity_decay
        
        return score if score >= self.MIN_AVAILABILITY else 0.0
        
    async def _compute_trust_score(self,
                                 candidate: CandidateMatchProfile,
                                 features: Dict[str, float]) -> float:
        """Compute trust and reliability score."""
        score = 0.5  # Base score
        
        # Verification status
        if candidate.identity_verified:
            score += 0.3
            
        # Mentor endorsements
        if len(candidate.mentor_endorsements) > 0:
            score += 0.1 * min(2, len(candidate.mentor_endorsements))
            
        # Response reliability
        if candidate.response_rate > 0.8:
            score += 0.1
            
        return min(1.0, score)
