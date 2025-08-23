"""Submission service implementation."""
from datetime import datetime
from typing import Optional, List, Dict, BinaryIO
from bson import ObjectId
from fastapi import HTTPException, status, UploadFile

from app.services.db import get_db
from app.models.sprints.submission_model import (
    SubmissionModel,
    SubmissionStatus,
    ArtifactMetadata
)
from app.services.sprints.sprint_service import SprintService
from app.utils.sprints.file_utils import validate_artifacts, scan_for_viruses
from app.workers.sprints.scoring_worker import trigger_scoring_pipeline

class SubmissionService:
    """Service for submission-related operations."""
    
    def __init__(self):
        """Initialize the service."""
        self.db = get_db()
        self.sprint_service = SprintService()
    
    async def create_submission(
        self,
        sprint_id: str,
        squad_id: str,
        author_anon_ids: List[str],
        artifacts: List[UploadFile],
        repository_url: Optional[str] = None
    ) -> SubmissionModel:
        """Create a new submission."""
        # Validate sprint and state
        sprint = await self.sprint_service.get_sprint(sprint_id)
        if not sprint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint not found"
            )
            
        if sprint.state != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sprint is not active"
            )
        
        # Get squad
        squad = await self.db.squads.find_one({
            "_id": ObjectId(squad_id),
            "sprint_id": ObjectId(sprint_id)
        })
        if not squad:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Squad not found"
            )
        
        # Validate submission attempts
        if squad["submission_attempts"] >= sprint.config.max_submissions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum submission attempts reached"
            )
        
        # Validate artifacts
        artifact_metadata = await validate_artifacts(
            artifacts,
            sprint.config.artifact_types
        )
        
        # Check for viruses
        scan_results = await scan_for_viruses(artifacts)
        if not scan_results.clean:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Virus detected in {scan_results.infected_files}"
            )
        
        # Create submission
        submission_dict = {
            "sprint_id": ObjectId(sprint_id),
            "squad_id": ObjectId(squad_id),
            "author_anon_ids": author_anon_ids,
            "artifacts": [artifact.dict() for artifact in artifact_metadata],
            "repository_url": repository_url,
            "status": SubmissionStatus.SUBMITTED,
            "attempt_number": squad["submission_attempts"] + 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "submitted_at": datetime.utcnow()
        }
        
        # Check if late submission
        if datetime.utcnow() > sprint.end_at:
            submission_dict["is_late"] = True
            submission_dict["late_minutes"] = int(
                (datetime.utcnow() - sprint.end_at).total_seconds() / 60
            )
            if not sprint.config.allow_late_submissions:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Late submissions are not allowed"
                )
            submission_dict["penalty_percent"] = sprint.config.late_penalty_percent
        
        # Insert submission
        result = await self.db.submissions.insert_one(submission_dict)
        submission_dict["_id"] = result.inserted_id
        
        # Update squad submission count
        await self.db.squads.update_one(
            {"_id": ObjectId(squad_id)},
            {
                "$inc": {"submission_attempts": 1},
                "$set": {
                    "latest_submission_id": result.inserted_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Trigger scoring pipeline
        await trigger_scoring_pipeline(str(result.inserted_id))
        
        return SubmissionModel(**submission_dict)
    
    async def get_submission(
        self,
        submission_id: str,
        include_reviews: bool = False
    ) -> Optional[Dict]:
        """Get submission by ID."""
        submission = await self.db.submissions.find_one(
            {"_id": ObjectId(submission_id)}
        )
        if not submission:
            return None
            
        if include_reviews:
            reviews = []
            async for review in self.db.submission_reviews.find(
                {"submission_id": ObjectId(submission_id)}
            ):
                reviews.append(review)
            submission["reviews"] = reviews
            
        return submission
    
    async def update_submission_status(
        self,
        submission_id: str,
        status: SubmissionStatus,
        message: Optional[str] = None
    ) -> SubmissionModel:
        """Update submission status."""
        submission = await self.get_submission(submission_id)
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found"
            )
        
        # Update status
        update_dict = {
            "status": status,
            "updated_at": datetime.utcnow()
        }
        
        if status == SubmissionStatus.UNDER_REVIEW:
            update_dict["review_started_at"] = datetime.utcnow()
        elif status in [SubmissionStatus.ACCEPTED, SubmissionStatus.REJECTED]:
            update_dict["review_completed_at"] = datetime.utcnow()
        
        result = await self.db.submissions.update_one(
            {"_id": ObjectId(submission_id)},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update submission status"
            )
        
        # Record status change event
        await self.db.sprint_events.insert_one({
            "sprint_id": submission["sprint_id"],
            "squad_id": submission["squad_id"],
            "submission_id": ObjectId(submission_id),
            "type": "submission_status_change",
            "timestamp": datetime.utcnow(),
            "details": {
                "old_status": submission["status"],
                "new_status": status,
                "message": message
            }
        })
        
        return await self.get_submission(submission_id)
    
    async def get_squad_submissions(
        self,
        sprint_id: str,
        squad_id: str
    ) -> List[SubmissionModel]:
        """Get all submissions for a squad."""
        cursor = self.db.submissions.find({
            "sprint_id": ObjectId(sprint_id),
            "squad_id": ObjectId(squad_id)
        }).sort("created_at", -1)
        
        submissions = []
        async for submission in cursor:
            submissions.append(SubmissionModel(**submission))
            
        return submissions
    
    async def get_sprint_submissions(
        self,
        sprint_id: str,
        status: Optional[List[SubmissionStatus]] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[SubmissionModel]:
        """Get submissions for a sprint."""
        query = {"sprint_id": ObjectId(sprint_id)}
        if status:
            query["status"] = {"$in": status}
            
        cursor = self.db.submissions.find(query).sort(
            "created_at", -1
        ).skip(skip).limit(limit)
        
        submissions = []
        async for submission in cursor:
            submissions.append(SubmissionModel(**submission))
            
        return submissions
    
    async def update_submission_score(
        self,
        submission_id: str,
        score_data: Dict
    ) -> SubmissionModel:
        """Update submission score."""
        submission = await self.get_submission(submission_id)
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found"
            )
        
        # Calculate final score with penalty
        aggregated_score = score_data["aggregated_score"]
        if submission["penalty_percent"] > 0:
            penalty_multiplier = 1 - (submission["penalty_percent"] / 100)
            final_score = aggregated_score * penalty_multiplier
        else:
            final_score = aggregated_score
        
        # Update scores
        update_dict = {
            "scores": score_data["scores"],
            "aggregated_score": aggregated_score,
            "final_score": final_score,
            "updated_at": datetime.utcnow()
        }
        
        result = await self.db.submissions.update_one(
            {"_id": ObjectId(submission_id)},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update submission score"
            )
        
        return await self.get_submission(submission_id)
