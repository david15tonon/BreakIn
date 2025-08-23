"""Service for managing review assignments to mentors."""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set, Tuple
from fastapi import HTTPException
import random

from app.models.feedback.models import Review, Reviewer
from app.services.gpt import get_mentor_match_score
from motor.motor_asyncio import AsyncIOMotorDatabase

class AssignmentService:
    """Service for assigning reviews to mentors."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """Initialize the assignment service.
        
        Args:
            db: Database instance
        """
        self.db = db
        
    async def assign_reviews(self,
                           submission_ids: List[str],
                           strategy: str = "balanced") -> Dict[str, str]:
        """Assign submissions to mentors.
        
        Args:
            submission_ids: List of submissions needing review
            strategy: Assignment strategy (balanced, expertise, random)
            
        Returns:
            Dict mapping submission_id to reviewer_id
            
        Raises:
            HTTPException: If not enough mentors or invalid strategy
        """
        # Get available mentors
        mentors = await self._get_available_mentors()
        if not mentors:
            raise HTTPException(
                status_code=400,
                detail="No mentors available for assignment"
            )
            
        # Choose assignment strategy
        if strategy == "balanced":
            assignments = await self._balanced_assignment(
                submission_ids, mentors
            )
        elif strategy == "expertise":
            assignments = await self._expertise_based_assignment(
                submission_ids, mentors
            )
        elif strategy == "random":
            assignments = await self._random_assignment(
                submission_ids, mentors
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid assignment strategy"
            )
            
        # Store assignments
        for submission_id, reviewer_id in assignments.items():
            await self._create_assignment(submission_id, reviewer_id)
            
        return assignments
        
    async def _get_available_mentors(self) -> List[Reviewer]:
        """Get list of available mentors.
        
        Returns:
            List of available mentors
        """
        # Get mentors who:
        # 1. Are active (reviewed in last 30 days)
        # 2. Have capacity (less than max assignments)
        # 3. Are not on break
        
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        mentors = await self.db.reviewers.find({
            "last_active": {"$gte": thirty_days_ago},
            "status": "active"
        }).to_list(None)
        
        # Filter by current workload
        available = []
        for mentor in mentors:
            current_assignments = await self.db.reviews.count_documents({
                "reviewer_id": mentor["_id"],
                "status": {"$in": ["draft", "in_progress"]},
                "created_at": {"$gte": thirty_days_ago}
            })
            
            if current_assignments < self._get_mentor_capacity(mentor):
                available.append(Reviewer(**mentor))
                
        return available
        
    def _get_mentor_capacity(self, mentor: Reviewer) -> int:
        """Get maximum review capacity for a mentor.
        
        Args:
            mentor: Reviewer object
            
        Returns:
            Maximum number of concurrent reviews
        """
        # Base capacity by level
        capacities = {
            "trainee": 2,
            "junior": 5,
            "senior": 8,
            "lead": 12
        }
        
        base = capacities.get(mentor.level, 2)
        
        # Adjust by reliability score
        if mentor.reliability_score >= 0.95:
            base += 2
        elif mentor.reliability_score >= 0.85:
            base += 1
        elif mentor.reliability_score < 0.75:
            base -= 1
            
        return max(1, base)
        
    async def _balanced_assignment(self,
                                 submission_ids: List[str],
                                 mentors: List[Reviewer]) -> Dict[str, str]:
        """Assign submissions to balance mentor workload.
        
        Args:
            submission_ids: Submissions to assign
            mentors: Available mentors
            
        Returns:
            Dict mapping submission_id to reviewer_id
        """
        assignments = {}
        mentor_loads = {m.id: 0 for m in mentors}
        
        for submission_id in submission_ids:
            # Get mentor with lowest current load
            mentor_id = min(
                mentor_loads,
                key=lambda k: mentor_loads[k]
            )
            
            assignments[submission_id] = mentor_id
            mentor_loads[mentor_id] += 1
            
        return assignments
        
    async def _expertise_based_assignment(self,
                                        submission_ids: List[str],
                                        mentors: List[Reviewer]) -> Dict[str, str]:
        """Assign submissions based on mentor expertise match.
        
        Args:
            submission_ids: Submissions to assign
            mentors: Available mentors
            
        Returns:
            Dict mapping submission_id to reviewer_id
        """
        assignments = {}
        
        # Get match scores for each submission-mentor pair
        for submission_id in submission_ids:
            best_score = -1
            best_mentor = None
            
            for mentor in mentors:
                # Skip overloaded mentors
                current_load = sum(
                    1 for aid, mid in assignments.items()
                    if mid == mentor.id
                )
                if current_load >= self._get_mentor_capacity(mentor):
                    continue
                    
                # Get match score from Career Match Agent
                score = await get_mentor_match_score(
                    submission_id, mentor.id
                )
                
                if score > best_score:
                    best_score = score
                    best_mentor = mentor
                    
            if best_mentor:
                assignments[submission_id] = best_mentor.id
                
        return assignments
        
    async def _random_assignment(self,
                               submission_ids: List[str],
                               mentors: List[Reviewer]) -> Dict[str, str]:
        """Randomly assign submissions to mentors.
        
        Args:
            submission_ids: Submissions to assign
            mentors: Available mentors
            
        Returns:
            Dict mapping submission_id to reviewer_id
        """
        assignments = {}
        available_mentors = mentors.copy()
        
        for submission_id in submission_ids:
            if not available_mentors:
                available_mentors = mentors.copy()
                
            mentor = random.choice(available_mentors)
            assignments[submission_id] = mentor.id
            
            # Remove mentor if at capacity
            current_load = sum(
                1 for mid in assignments.values()
                if mid == mentor.id
            )
            if current_load >= self._get_mentor_capacity(mentor):
                available_mentors.remove(mentor)
                
        return assignments
        
    async def _create_assignment(self,
                               submission_id: str,
                               reviewer_id: str) -> None:
        """Create a review assignment record.
        
        Args:
            submission_id: ID of submission
            reviewer_id: ID of assigned reviewer
        """
        assignment = {
            "submission_id": submission_id,
            "reviewer_id": reviewer_id,
            "status": "assigned",
            "assigned_at": datetime.utcnow(),
            "completed_at": None
        }
        
        await self.db.review_assignments.insert_one(assignment)
        
        # Notify mentor
        from app.services.notification import notify_user
        await notify_user(
            reviewer_id,
            f"New review assignment for submission {submission_id}"
        )
        
    async def get_assignment_stats(self) -> Dict:
        """Get current assignment statistics.
        
        Returns:
            Dict with assignment stats
        """
        stats = {
            "total_pending": 0,
            "total_in_progress": 0,
            "total_completed": 0,
            "avg_time_to_complete": 0,
            "mentor_loads": {}
        }
        
        # Get counts by status
        stats["total_pending"] = await self.db.review_assignments.count_documents({
            "status": "assigned"
        })
        
        stats["total_in_progress"] = await self.db.review_assignments.count_documents({
            "status": "in_progress"
        })
        
        completed = await self.db.review_assignments.find({
            "status": "completed",
            "assigned_at": {"$exists": True},
            "completed_at": {"$exists": True}
        }).to_list(None)
        
        stats["total_completed"] = len(completed)
        
        # Calculate average completion time
        if completed:
            total_time = sum(
                (c["completed_at"] - c["assigned_at"]).total_seconds()
                for c in completed
            )
            stats["avg_time_to_complete"] = total_time / len(completed)
            
        # Get per-mentor loads
        async for mentor in self.db.reviewers.find({}):
            current_load = await self.db.review_assignments.count_documents({
                "reviewer_id": mentor["_id"],
                "status": {"$in": ["assigned", "in_progress"]}
            })
            stats["mentor_loads"][mentor["_id"]] = current_load
            
        return stats
