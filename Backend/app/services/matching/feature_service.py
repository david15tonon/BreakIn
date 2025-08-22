"""Service for computing match features."""
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import numpy as np
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.matching.candidate_model import CandidateMatchProfile
from app.models.matching.company_model import CompanyMatchProfile
from app.schemas.matching.match_request_schema import RoleRequirements
from app.utils.matching.text_norm import normalize_skills
from app.utils.matching.similarity_utils import compute_skill_overlap

class FeatureService:
    """Service for computing matching features."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """Initialize feature service.
        
        Args:
            db: Database connection
        """
        self.db = db
        
    async def compute_batch(self,
                          candidates: List[CandidateMatchProfile],
                          role: RoleRequirements,
                          company: CompanyMatchProfile) -> Dict[str, Dict[str, float]]:
        """Compute features for a batch of candidates.
        
        Args:
            candidates: List of candidates
            role: Role requirements
            company: Company profile
            
        Returns:
            Dict mapping candidate IDs to feature dictionaries
        """
        features = {}
        for candidate in candidates:
            candidate_features = await self.compute_features(
                candidate=candidate,
                role=role,
                company=company
            )
            features[candidate.id] = candidate_features
            
        return features
        
    async def compute_features(self,
                             candidate: CandidateMatchProfile,
                             role: RoleRequirements,
                             company: CompanyMatchProfile) -> Dict[str, float]:
        """Compute features for a single candidate.
        
        Args:
            candidate: Candidate to compute features for
            role: Role requirements
            company: Company profile
            
        Returns:
            Dictionary of computed features
        """
        features = {}
        
        # Get recent sprints
        sprints = await self._get_recent_sprints(candidate.id)
        
        # Technical features
        features.update(await self._compute_technical_features(
            candidate=candidate,
            role=role,
            sprints=sprints
        ))
        
        # Experience features
        features.update(await self._compute_experience_features(
            candidate=candidate,
            role=role,
            sprints=sprints
        ))
        
        # Activity features
        features.update(await self._compute_activity_features(
            candidate=candidate,
            sprints=sprints
        ))
        
        # Growth features
        features.update(await self._compute_growth_features(
            candidate=candidate,
            sprints=sprints
        ))
        
        # Collaboration features
        features.update(await self._compute_collaboration_features(
            candidate=candidate,
            sprints=sprints
        ))
        
        return features
        
    async def _get_recent_sprints(self, candidate_id: str) -> List[Dict]:
        """Get recent sprints for a candidate.
        
        Args:
            candidate_id: ID of candidate
            
        Returns:
            List of recent sprint records
        """
        # Get sprints from last 6 months
        cutoff = datetime.utcnow() - timedelta(days=180)
        
        cursor = self.db.sprints.find({
            "candidate_id": candidate_id,
            "completed_at": {"$gte": cutoff}
        }).sort("completed_at", -1)
        
        return await cursor.to_list(length=100)
        
    async def _compute_technical_features(self,
                                        candidate: CandidateMatchProfile,
                                        role: RoleRequirements,
                                        sprints: List[Dict]) -> Dict[str, float]:
        """Compute technical skill features."""
        features = {}
        
        # Skill overlap scores
        candidate_skills = normalize_skills(candidate.skills)
        required_skills = normalize_skills(role.must_have)
        preferred_skills = normalize_skills(role.nice_to_have)
        
        features["required_skill_overlap"] = compute_skill_overlap(
            candidate_skills,
            required_skills
        )
        features["preferred_skill_overlap"] = compute_skill_overlap(
            candidate_skills,
            preferred_skills
        )
        
        # Recent tech stack usage
        if sprints:
            tech_usage = {}
            for sprint in sprints:
                for tech in sprint.get("technologies", []):
                    tech_usage[tech] = tech_usage.get(tech, 0) + 1
                    
            # Normalize by sprint count
            sprint_count = len(sprints)
            tech_usage = {k: v/sprint_count for k,v in tech_usage.items()}
            
            # Score overlap with role tech
            role_tech = set(role.must_have + role.nice_to_have)
            tech_match = sum(tech_usage.get(t, 0) for t in role_tech)
            features["recent_tech_usage"] = min(1.0, tech_match)
            
        # Code quality signals
        if sprints:
            code_scores = [s.get("code_quality_score", 0) for s in sprints]
            features["avg_code_quality"] = np.mean(code_scores)
            features["recent_code_quality"] = code_scores[0] if code_scores else 0
            
        return features
        
    async def _compute_experience_features(self,
                                         candidate: CandidateMatchProfile,
                                         role: RoleRequirements,
                                         sprints: List[Dict]) -> Dict[str, float]:
        """Compute experience-related features."""
        features = {}
        
        # Sector experience
        if role.sector:
            sector_sprints = [s for s in sprints if s.get("sector") == role.sector]
            features["sector_experience"] = len(sector_sprints) / max(1, len(sprints))
            
            if sector_sprints:
                sector_scores = [s.get("overall_score", 0) for s in sector_sprints]
                features["sector_performance"] = np.mean(sector_scores)
                
        # Role-specific features
        features["role_sprints"] = sum(
            1 for s in sprints if role.title.lower() in s.get("role", "").lower()
        ) / max(1, len(sprints))
        
        # Sprint performance
        if sprints:
            sprint_scores = [s.get("overall_score", 0) for s in sprints]
            features["avg_sprint_score"] = np.mean(sprint_scores)
            features["recent_sprint_score"] = sprint_scores[0]
            
        return features
        
    async def _compute_activity_features(self,
                                       candidate: CandidateMatchProfile,
                                       sprints: List[Dict]) -> Dict[str, float]:
        """Compute activity-related features."""
        features = {}
        
        # Recent activity level
        days_since_active = (datetime.utcnow() - candidate.last_active).days
        features["recent_activity"] = np.exp(-days_since_active / 30)  # 30 day decay
        
        # Sprint completion rate
        if sprints:
            completed = sum(1 for s in sprints if s.get("status") == "completed")
            features["completion_rate"] = completed / len(sprints)
            
            # Sprint frequency
            if len(sprints) > 1:
                dates = [datetime.fromisoformat(s["completed_at"]) for s in sprints]
                intervals = [(dates[i] - dates[i+1]).days 
                           for i in range(len(dates)-1)]
                features["sprint_frequency"] = 30 / (np.mean(intervals) + 1)  # Sprints per month
                
        # Response time
        features["response_time"] = candidate.response_rate
        
        return features
        
    async def _compute_growth_features(self,
                                     candidate: CandidateMatchProfile,
                                     sprints: List[Dict]) -> Dict[str, float]:
        """Compute growth and improvement features."""
        features = {}
        
        # Reputation growth
        features["reputation_growth"] = max(0, candidate.growth_slope)
        
        # Sprint score progression
        if len(sprints) > 1:
            scores = [s.get("overall_score", 0) for s in sprints]
            if len(scores) >= 3:
                # Fit linear regression to detect trend
                x = np.arange(len(scores))
                z = np.polyfit(x, scores, 1)
                features["learning_rate"] = max(0, z[0])  # Slope of improvement
                
                # Recent improvement
                recent_avg = np.mean(scores[:3])
                past_avg = np.mean(scores[-3:])
                features["recent_improvement"] = max(0, (recent_avg - past_avg) / past_avg)
                
        # Skill acquisition
        if len(sprints) > 1:
            initial_skills = set(sprints[-1].get("technologies", []))
            current_skills = set(sprints[0].get("technologies", []))
            new_skills = len(current_skills - initial_skills)
            features["skill_acquisition"] = new_skills / max(1, len(initial_skills))
            
        return features
        
    async def _compute_collaboration_features(self,
                                           candidate: CandidateMatchProfile,
                                           sprints: List[Dict]) -> Dict[str, float]:
        """Compute collaboration and soft skill features."""
        features = {}
        
        # Team performance
        if sprints:
            team_scores = []
            for sprint in sprints:
                if sprint.get("team_score"):
                    team_scores.append(sprint["team_score"])
                    
            if team_scores:
                features["avg_team_score"] = np.mean(team_scores)
                features["recent_team_score"] = team_scores[0]
                
        # Leadership signals
        features["leadership_emergence"] = candidate.leadership_score
        
        # Communication effectiveness
        if sprints:
            comm_scores = [s.get("communication_score", 0) for s in sprints]
            features["communication_score"] = np.mean(comm_scores)
            
        return features
