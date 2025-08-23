"""Core review service for handling review operations."""

from datetime import datetime
from typing import Dict, List, Optional, Union
from fastapi import HTTPException

from app.models.feedback.models import (
    Review, Reviewer, Rubric, ReviewAudit
)
from app.utils.feedback import scoring_utils, text_utils
from app.services.gpt import get_ai_review
from motor.motor_asyncio import AsyncIOMotorDatabase

class ReviewService:
    """Service for managing review operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """Initialize the review service.
        
        Args:
            db: Database instance
        """
        self.db = db
        
    async def create_review(self,
                          submission_id: str,
                          reviewer_id: str,
                          scores: Dict[str, float],
                          comments: str,
                          draft: bool = True) -> Review:
        """Create a new review.
        
        Args:
            submission_id: ID of the submission being reviewed
            reviewer_id: ID of the reviewer
            scores: Component scores
            comments: Review comments
            draft: Whether this is a draft (default True)
            
        Returns:
            The created review
            
        Raises:
            HTTPException: If validation fails or review already exists
        """
        # Check if review already exists
        existing = await self.db.reviews.find_one({
            "submission_id": submission_id,
            "reviewer_id": reviewer_id
        })
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Review already exists for this submission"
            )
            
        # Get current rubric
        rubric = await self.get_active_rubric()
        if not rubric:
            raise HTTPException(
                status_code=500,
                detail="No active rubric found"
            )
            
        # Validate scores against rubric
        self._validate_scores(scores, rubric)
        
        # Calculate normalized score
        normalized_score = await self._calculate_normalized_score(scores)
        
        # Sanitize and redact comments
        comments = text_utils.sanitize_markdown(comments)
        redacted_comments, _ = text_utils.redact_pii(comments)
        
        # Get AI feedback
        ai_feedback = None
        if not draft:
            try:
                ai_feedback = await get_ai_review(submission_id)
            except Exception as e:
                # Log error but continue
                print(f"Error getting AI feedback: {str(e)}")
        
        # Create review
        review = Review(
            submission_id=submission_id,
            reviewer_id=reviewer_id,
            scores=scores,
            weights_used={c["key"]: c["weight"] for c in rubric.components},
            normalized_score=normalized_score,
            comments=redacted_comments,
            ai_feedback=ai_feedback,
            status="draft" if draft else "finalized",
            locked_at=None if draft else datetime.utcnow()
        )
        
        # Insert into database
        result = await self.db.reviews.insert_one(review.dict())
        review.id = str(result.inserted_id)
        
        # Create audit entry
        await self._create_audit_entry(
            review.id,
            "create",
            reviewer_id,
            None,
            review.dict()
        )
        
        # Update reviewer stats
        await self._update_reviewer_stats(reviewer_id)
        
        return review
        
    async def update_review(self,
                          review_id: str,
                          reviewer_id: str,
                          updates: Dict) -> Review:
        """Update an existing review.
        
        Args:
            review_id: ID of review to update
            reviewer_id: ID of reviewer making update
            updates: Fields to update
            
        Returns:
            Updated review
            
        Raises:
            HTTPException: If review not found or locked
        """
        # Get current review
        review = await self.db.reviews.find_one({"_id": review_id})
        if not review:
            raise HTTPException(
                status_code=404,
                detail="Review not found"
            )
            
        # Check if locked
        if review.get("locked_at"):
            raise HTTPException(
                status_code=400,
                detail="Cannot update locked review"
            )
            
        # Verify reviewer
        if review["reviewer_id"] != reviewer_id:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to update this review"
            )
            
        # Handle score updates
        if "scores" in updates:
            rubric = await self.get_active_rubric()
            self._validate_scores(updates["scores"], rubric)
            updates["normalized_score"] = await self._calculate_normalized_score(
                updates["scores"]
            )
            
        # Handle comment updates
        if "comments" in updates:
            updates["comments"] = text_utils.sanitize_markdown(updates["comments"])
            updates["comments"], _ = text_utils.redact_pii(updates["comments"])
            
        # Update review
        old_state = review.copy()
        review.update(updates)
        review["updated_at"] = datetime.utcnow()
        
        await self.db.reviews.replace_one(
            {"_id": review_id},
            review
        )
        
        # Create audit entry
        await self._create_audit_entry(
            review_id,
            "update",
            reviewer_id,
            old_state,
            review
        )
        
        return Review(**review)
        
    async def finalize_review(self,
                            review_id: str,
                            reviewer_id: str) -> Review:
        """Finalize a review.
        
        Args:
            review_id: ID of review to finalize
            reviewer_id: ID of reviewer finalizing
            
        Returns:
            Finalized review
            
        Raises:
            HTTPException: If review not found or already locked
        """
        # Get current review
        review = await self.db.reviews.find_one({"_id": review_id})
        if not review:
            raise HTTPException(
                status_code=404,
                detail="Review not found"
            )
            
        # Check if already locked
        if review.get("locked_at"):
            raise HTTPException(
                status_code=400,
                detail="Review already finalized"
            )
            
        # Verify reviewer
        if review["reviewer_id"] != reviewer_id:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to finalize this review"
            )
            
        # Get AI feedback
        try:
            ai_feedback = await get_ai_review(review["submission_id"])
            review["ai_feedback"] = ai_feedback
        except Exception as e:
            # Log error but continue
            print(f"Error getting AI feedback: {str(e)}")
            
        # Update review
        old_state = review.copy()
        review["status"] = "finalized"
        review["locked_at"] = datetime.utcnow()
        review["updated_at"] = datetime.utcnow()
        
        await self.db.reviews.replace_one(
            {"_id": review_id},
            review
        )
        
        # Create audit entry
        await self._create_audit_entry(
            review_id,
            "finalize",
            reviewer_id,
            old_state,
            review
        )
        
        # Update reviewer stats
        await self._update_reviewer_stats(reviewer_id)
        
        return Review(**review)
        
    async def get_review(self,
                        review_id: str,
                        include_audit: bool = False) -> Union[Review, Dict]:
        """Get a review by ID.
        
        Args:
            review_id: ID of review to get
            include_audit: Whether to include audit history
            
        Returns:
            Review object, optionally with audit history
            
        Raises:
            HTTPException: If review not found
        """
        review = await self.db.reviews.find_one({"_id": review_id})
        if not review:
            raise HTTPException(
                status_code=404,
                detail="Review not found"
            )
            
        if include_audit:
            audit = await self.db.review_audit.find(
                {"review_id": review_id}
            ).sort("timestamp", 1).to_list(None)
            return {
                "review": Review(**review),
                "audit": audit
            }
            
        return Review(**review)
        
    async def list_reviews(self,
                         submission_id: Optional[str] = None,
                         reviewer_id: Optional[str] = None,
                         status: Optional[str] = None,
                         limit: int = 50,
                         skip: int = 0) -> List[Review]:
        """List reviews with optional filters.
        
        Args:
            submission_id: Filter by submission
            reviewer_id: Filter by reviewer
            status: Filter by status
            limit: Maximum number to return
            skip: Number to skip (for pagination)
            
        Returns:
            List of reviews matching filters
        """
        # Build query
        query = {}
        if submission_id:
            query["submission_id"] = submission_id
        if reviewer_id:
            query["reviewer_id"] = reviewer_id
        if status:
            query["status"] = status
            
        # Execute query
        reviews = await self.db.reviews.find(query).sort(
            "created_at", -1
        ).skip(skip).limit(limit).to_list(None)
        
        return [Review(**r) for r in reviews]
        
    async def get_active_rubric(self) -> Optional[Rubric]:
        """Get the currently active rubric.
        
        Returns:
            Active rubric or None if not found
        """
        rubric = await self.db.rubrics.find_one({"active": True})
        if rubric:
            return Rubric(**rubric)
        return None
        
    async def _calculate_normalized_score(self,
                                       scores: Dict[str, float]) -> float:
        """Calculate normalized score considering population statistics.
        
        Args:
            scores: Raw component scores
            
        Returns:
            Normalized score
        """
        # Get population stats for each component
        stats = {}
        for component in scores:
            component_scores = await self.db.reviews.find(
                {"scores." + component: {"$exists": True}}
            ).distinct("scores." + component)
            
            if component_scores:
                stats[component] = {
                    "mean": sum(component_scores) / len(component_scores),
                    "std": scoring_utils.calculate_std(component_scores)
                }
            else:
                stats[component] = {"mean": 0, "std": 1}
                
        # Normalize each component
        normalized_components = {}
        for component, score in scores.items():
            normalized_components[component] = scoring_utils.calculate_normalized_score(
                score,
                stats[component]["mean"],
                stats[component]["std"]
            )
            
        # Get active rubric for weights
        rubric = await self.get_active_rubric()
        weights = {c["key"]: c["weight"] for c in rubric.components}
        
        # Calculate weighted average
        return scoring_utils.calculate_weighted_average(
            normalized_components,
            weights
        )
        
    def _validate_scores(self,
                        scores: Dict[str, float],
                        rubric: Rubric) -> None:
        """Validate scores against rubric.
        
        Args:
            scores: Scores to validate
            rubric: Current rubric
            
        Raises:
            HTTPException: If validation fails
        """
        # Check all required components present
        required = {c["key"] for c in rubric.components}
        if not all(k in scores for k in required):
            raise HTTPException(
                status_code=400,
                detail=f"Missing required score components: {required - set(scores)}"
            )
            
        # Check score ranges
        for component in rubric.components:
            score = scores.get(component["key"])
            if score is not None:
                if score < 0 or score > component.get("max_score", 10):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid score for {component['key']}"
                    )
                    
    async def _create_audit_entry(self,
                                review_id: str,
                                action: str,
                                actor_id: str,
                                old_state: Optional[Dict],
                                new_state: Dict) -> None:
        """Create an audit entry for a review action.
        
        Args:
            review_id: ID of review
            action: Type of action
            actor_id: ID of actor
            old_state: Previous state (optional)
            new_state: New state
        """
        audit = ReviewAudit(
            review_id=review_id,
            action=action,
            actor_id=actor_id,
            old_state=old_state,
            new_state=new_state
        )
        
        await self.db.review_audit.insert_one(audit.dict())
        
    async def _update_reviewer_stats(self, reviewer_id: str) -> None:
        """Update reviewer statistics.
        
        Args:
            reviewer_id: ID of reviewer to update
        """
        # Get all finalized reviews by this reviewer
        reviews = await self.db.reviews.find({
            "reviewer_id": reviewer_id,
            "status": "finalized"
        }).to_list(None)
        
        if not reviews:
            return
            
        # Calculate stats
        review_count = len(reviews)
        total_time = sum(
            (r["locked_at"] - r["created_at"]).total_seconds() / 60
            for r in reviews
            if r.get("locked_at") and r.get("created_at")
        )
        avg_time = total_time / review_count if review_count > 0 else 0
        
        # Update reviewer
        await self.db.reviewers.update_one(
            {"_id": reviewer_id},
            {
                "$set": {
                    "reviews_completed": review_count,
                    "avg_review_time": avg_time,
                    "last_active": datetime.utcnow()
                }
            }
        )
