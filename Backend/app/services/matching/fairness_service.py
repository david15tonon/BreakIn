"""Service for enforcing fairness constraints in matching."""
from typing import List, Dict, Optional, Tuple
import numpy as np
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.matching.candidate_model import CandidateMatchProfile
from app.models.matching.company_model import CompanyMatchProfile
from app.models.matching.recommendation_model import MatchScore
from app.utils.matching.constraint_solver import solve_fairness_constraints

class FairnessService:
    """Service for applying fairness constraints to match results."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """Initialize fairness service.
        
        Args:
            db: Database connection
        """
        self.db = db
        
        # Default fairness thresholds
        self.MIN_GROUP_REPRESENTATION = 0.2  # Minimum % for protected groups
        self.MAX_SCORE_REDUCTION = 0.3  # Max score reduction for fairness
        
    async def apply_constraints(self,
                              scores: List[MatchScore],
                              candidates: List[CandidateMatchProfile],
                              company: CompanyMatchProfile) -> List[MatchScore]:
        """Apply fairness constraints to scores.
        
        Args:
            scores: Original match scores
            candidates: Candidate profiles
            company: Company profile with fairness settings
            
        Returns:
            Adjusted scores meeting fairness constraints
        """
        if not company.fairness_constraints:
            return scores
            
        # Get protected attributes for candidates
        protected_attrs = await self._get_protected_attributes(
            candidate_ids=[c.id for c in candidates]
        )
        
        # Apply each constraint
        adjusted_scores = scores.copy()
        for constraint in company.fairness_constraints:
            adjusted_scores = await self._apply_constraint(
                scores=adjusted_scores,
                candidates=candidates,
                protected_attrs=protected_attrs,
                constraint=constraint,
                company=company
            )
            
        return adjusted_scores
        
    async def _get_protected_attributes(self,
                                      candidate_ids: List[str]) -> Dict[str, Dict[str, str]]:
        """Get protected attributes for candidates.
        
        Args:
            candidate_ids: List of candidate IDs
            
        Returns:
            Dict mapping candidate IDs to their protected attributes
        """
        cursor = self.db.candidate_attributes.find({
            "candidate_id": {"$in": candidate_ids}
        })
        
        attributes = {}
        async for doc in cursor:
            attributes[doc["candidate_id"]] = doc.get("protected_attributes", {})
            
        return attributes
        
    async def _apply_constraint(self,
                              scores: List[MatchScore],
                              candidates: List[CandidateMatchProfile],
                              protected_attrs: Dict[str, Dict[str, str]],
                              constraint: str,
                              company: CompanyMatchProfile) -> List[MatchScore]:
        """Apply a single fairness constraint.
        
        Args:
            scores: Scores to adjust
            candidates: Candidate profiles
            protected_attrs: Protected attributes per candidate
            constraint: Constraint to apply
            company: Company profile
            
        Returns:
            Adjusted scores meeting the constraint
        """
        if constraint.startswith("min_underrepresented_"):
            # Extract minimum percentage
            min_pct = float(constraint.split("_")[-1]) / 100
            return await self._apply_representation_constraint(
                scores=scores,
                candidates=candidates,
                protected_attrs=protected_attrs,
                min_percentage=min_pct,
                company=company
            )
            
        elif constraint == "equal_opportunity":
            return await self._apply_equal_opportunity(
                scores=scores,
                candidates=candidates,
                protected_attrs=protected_attrs
            )
            
        return scores
        
    async def _apply_representation_constraint(self,
                                             scores: List[MatchScore],
                                             candidates: List[CandidateMatchProfile],
                                             protected_attrs: Dict[str, Dict[str, str]],
                                             min_percentage: float,
                                             company: CompanyMatchProfile) -> List[MatchScore]:
        """Apply minimum representation constraint.
        
        Args:
            scores: Original scores
            candidates: Candidate profiles
            protected_attrs: Protected attributes
            min_percentage: Minimum required percentage
            company: Company profile
            
        Returns:
            Adjusted scores meeting representation constraint
        """
        # Get target attributes from company settings
        target_attrs = company.diversity_targets or {}
        if not target_attrs:
            return scores
            
        # Calculate current representation
        total = len(scores)
        target_count = int(total * min_percentage)
        
        adjusted_scores = []
        for score, candidate in zip(scores, candidates):
            attrs = protected_attrs.get(candidate.id, {})
            
            # Check if candidate has any target attributes
            matches_target = any(
                attrs.get(attr) == val
                for attr, val in target_attrs.items()
            )
            
            if matches_target:
                # Boost score for underrepresented groups
                boost = min(0.2, (target_count / total) - score.final_score)
                new_score = min(1.0, score.final_score + boost)
                
                score.final_score = new_score
                score.adjustment_factors["diversity_boost"] = boost
                
            adjusted_scores.append(score)
            
        return adjusted_scores
        
    async def _apply_equal_opportunity(self,
                                     scores: List[MatchScore],
                                     candidates: List[CandidateMatchProfile],
                                     protected_attrs: Dict[str, Dict[str, str]]) -> List[MatchScore]:
        """Apply equal opportunity fairness.
        
        This ensures similar candidates from different groups get similar scores.
        
        Args:
            scores: Original scores
            candidates: Candidate profiles
            protected_attrs: Protected attributes
            
        Returns:
            Adjusted scores with equal opportunity
        """
        if len(scores) < 2:
            return scores
            
        # Group candidates by protected attributes
        groups = {}
        for score, candidate in zip(scores, candidates):
            attrs = protected_attrs.get(candidate.id, {})
            key = tuple(sorted(attrs.items()))
            if key not in groups:
                groups[key] = []
            groups[key].append((score, candidate))
            
        # Skip if only one group
        if len(groups) < 2:
            return scores
            
        # Calculate mean score per group
        group_means = {
            k: np.mean([s.final_score for s, _ in v])
            for k, v in groups.items()
        }
        
        # Adjust scores to reduce inter-group differences
        global_mean = np.mean([s.final_score for s in scores])
        adjusted_scores = []
        
        for score, candidate in zip(scores, candidates):
            attrs = protected_attrs.get(candidate.id, {})
            key = tuple(sorted(attrs.items()))
            
            # Calculate adjustment factor
            group_mean = group_means[key]
            if group_mean != global_mean:
                adjustment = (global_mean - group_mean) * 0.5  # Partial adjustment
                new_score = score.final_score + adjustment
                
                # Ensure score stays in valid range
                new_score = max(0.0, min(1.0, new_score))
                
                score.final_score = new_score
                score.adjustment_factors["equal_opportunity"] = adjustment
                
            adjusted_scores.append(score)
            
        return adjusted_scores
        
    async def log_fairness_metrics(self,
                                 request_id: str,
                                 original_scores: List[MatchScore],
                                 adjusted_scores: List[MatchScore],
                                 candidates: List[CandidateMatchProfile],
                                 protected_attrs: Dict[str, Dict[str, str]]) -> None:
        """Log fairness metrics for monitoring.
        
        Args:
            request_id: ID of match request
            original_scores: Scores before fairness adjustments
            adjusted_scores: Scores after fairness adjustments
            candidates: Candidate profiles
            protected_attrs: Protected attributes
        """
        metrics = {
            "request_id": request_id,
            "timestamp": datetime.utcnow(),
            "original_mean": np.mean([s.final_score for s in original_scores]),
            "adjusted_mean": np.mean([s.final_score for s in adjusted_scores]),
            "adjustment_magnitude": np.mean([
                abs(a.final_score - o.final_score)
                for a, o in zip(adjusted_scores, original_scores)
            ]),
            "protected_group_stats": self._compute_group_stats(
                scores=adjusted_scores,
                candidates=candidates,
                protected_attrs=protected_attrs
            )
        }
        
        await self.db.fairness_metrics.insert_one(metrics)
        
    def _compute_group_stats(self,
                            scores: List[MatchScore],
                            candidates: List[CandidateMatchProfile],
                            protected_attrs: Dict[str, Dict[str, str]]) -> Dict:
        """Compute statistics per protected group."""
        stats = {}
        
        # Group scores by protected attributes
        for score, candidate in zip(scores, candidates):
            attrs = protected_attrs.get(candidate.id, {})
            for attr, value in attrs.items():
                key = f"{attr}:{value}"
                if key not in stats:
                    stats[key] = []
                stats[key].append(score.final_score)
                
        # Compute stats per group
        return {
            k: {
                "count": len(v),
                "mean_score": np.mean(v),
                "std_score": np.std(v)
            }
            for k, v in stats.items()
        }
