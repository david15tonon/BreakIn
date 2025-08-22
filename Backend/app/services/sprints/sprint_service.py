"""Sprint service implementation."""
from datetime import datetime, timedelta
from typing import Optional, List, Dict
from bson import ObjectId
from fastapi import HTTPException, status

from app.services.db import get_db
from app.schemas.sprints.sprint_schema import (
    SprintCreate,
    SprintUpdate,
    SprintStats,
    SprintSearchParams
)
from app.models.sprints.sprint_model import SprintModel, SprintState
from app.utils.time_utils import is_within_business_hours

class SprintService:
    """Service for sprint-related operations."""
    
    def __init__(self):
        """Initialize the service."""
        self.db = get_db()
    
    async def create_sprint(self, sprint_data: SprintCreate, owner_id: str) -> SprintModel:
        """Create a new sprint."""
        # Validate template exists
        template = await self.db.sprint_templates.find_one(
            {"_id": ObjectId(sprint_data.template_id)}
        )
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint template not found"
            )
        
        # Create sprint dict
        sprint_dict = sprint_data.dict()
        sprint_dict["owner_id"] = owner_id
        sprint_dict["state"] = SprintState.DRAFT
        sprint_dict["template_id"] = ObjectId(sprint_data.template_id)
        sprint_dict["created_at"] = datetime.utcnow()
        sprint_dict["updated_at"] = sprint_dict["created_at"]
        
        # Insert sprint
        result = await self.db.sprints.insert_one(sprint_dict)
        sprint_dict["_id"] = result.inserted_id
        
        return SprintModel(**sprint_dict)
    
    async def get_sprint(self, sprint_id: str) -> Optional[SprintModel]:
        """Get sprint by ID."""
        sprint = await self.db.sprints.find_one({"_id": ObjectId(sprint_id)})
        if sprint:
            return SprintModel(**sprint)
        return None
    
    async def update_sprint(
        self,
        sprint_id: str,
        update_data: SprintUpdate
    ) -> SprintModel:
        """Update sprint data."""
        # Get current sprint
        sprint = await self.get_sprint(sprint_id)
        if not sprint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint not found"
            )
        
        # Validate state
        if sprint.state not in [SprintState.DRAFT, SprintState.PUBLISHED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update active or completed sprint"
            )
        
        # Prepare update data
        update_dict = update_data.dict(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        
        # Update sprint
        result = await self.db.sprints.update_one(
            {"_id": ObjectId(sprint_id)},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Update failed"
            )
        
        return await self.get_sprint(sprint_id)
    
    async def publish_sprint(
        self,
        sprint_id: str,
        announcement: Optional[str] = None
    ) -> SprintModel:
        """Publish a sprint."""
        sprint = await self.get_sprint(sprint_id)
        if not sprint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint not found"
            )
        
        if sprint.state != SprintState.DRAFT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sprint is not in draft state"
            )
        
        # Update state
        result = await self.db.sprints.update_one(
            {"_id": ObjectId(sprint_id)},
            {
                "$set": {
                    "state": SprintState.PUBLISHED,
                    "published_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to publish sprint"
            )
        
        # TODO: Send notifications if announcement provided
        
        return await self.get_sprint(sprint_id)
    
    async def start_sprint(self, sprint_id: str) -> SprintModel:
        """Start a published sprint."""
        sprint = await self.get_sprint(sprint_id)
        if not sprint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint not found"
            )
        
        if sprint.state != SprintState.PUBLISHED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sprint must be published before starting"
            )
        
        # Validate start time
        now = datetime.utcnow()
        if now < sprint.start_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sprint start time has not been reached"
            )
        
        # Update state
        result = await self.db.sprints.update_one(
            {"_id": ObjectId(sprint_id)},
            {
                "$set": {
                    "state": SprintState.ACTIVE,
                    "updated_at": now
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to start sprint"
            )
        
        return await self.get_sprint(sprint_id)
    
    async def close_sprint(self, sprint_id: str) -> SprintModel:
        """Close an active sprint."""
        sprint = await self.get_sprint(sprint_id)
        if not sprint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint not found"
            )
        
        if sprint.state != SprintState.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sprint must be active to close"
            )
        
        # Validate end time
        now = datetime.utcnow()
        if now < sprint.end_at and not sprint.config.auto_close:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sprint end time has not been reached"
            )
        
        # Update state
        result = await self.db.sprints.update_one(
            {"_id": ObjectId(sprint_id)},
            {
                "$set": {
                    "state": SprintState.CLOSED,
                    "updated_at": now
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to close sprint"
            )
        
        # TODO: Trigger scoring finalization
        # TODO: Generate leaderboards
        
        return await self.get_sprint(sprint_id)
    
    async def archive_sprint(self, sprint_id: str) -> SprintModel:
        """Archive a closed sprint."""
        sprint = await self.get_sprint(sprint_id)
        if not sprint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint not found"
            )
        
        if sprint.state != SprintState.CLOSED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sprint must be closed to archive"
            )
        
        # Update state
        now = datetime.utcnow()
        result = await self.db.sprints.update_one(
            {"_id": ObjectId(sprint_id)},
            {
                "$set": {
                    "state": SprintState.ARCHIVED,
                    "archived_at": now,
                    "updated_at": now
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to archive sprint"
            )
        
        # TODO: Trigger archive worker for long-term storage
        
        return await self.get_sprint(sprint_id)
    
    async def extend_deadline(
        self,
        sprint_id: str,
        hours: int,
        reason: str
    ) -> SprintModel:
        """Extend sprint deadline."""
        sprint = await self.get_sprint(sprint_id)
        if not sprint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint not found"
            )
        
        if sprint.state != SprintState.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only extend active sprints"
            )
        
        # Validate extension
        if hours < 1 or hours > 168:  # Max 1 week extension
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid extension duration"
            )
        
        new_end = sprint.end_at + timedelta(hours=hours)
        
        # Update deadline
        result = await self.db.sprints.update_one(
            {"_id": ObjectId(sprint_id)},
            {
                "$set": {
                    "end_at": new_end,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to extend deadline"
            )
        
        # Record extension event
        await self.db.sprint_events.insert_one({
            "sprint_id": ObjectId(sprint_id),
            "type": "deadline_extension",
            "timestamp": datetime.utcnow(),
            "details": {
                "hours": hours,
                "reason": reason,
                "old_end": sprint.end_at,
                "new_end": new_end
            }
        })
        
        return await self.get_sprint(sprint_id)
    
    async def get_sprint_stats(self, sprint_id: str) -> SprintStats:
        """Get sprint statistics."""
        # Get base sprint data
        sprint = await self.get_sprint(sprint_id)
        if not sprint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sprint not found"
            )
        
        # Get participants count
        squad_cursor = self.db.squads.find({"sprint_id": ObjectId(sprint_id)})
        total_participants = 0
        active_squads = 0
        async for squad in squad_cursor:
            total_participants += len(squad["members"])
            if squad["state"] == "active":
                active_squads += 1
        
        # Get submission stats
        submission_pipeline = [
            {"$match": {"sprint_id": ObjectId(sprint_id)}},
            {
                "$group": {
                    "_id": None,
                    "completed": {
                        "$sum": {
                            "$cond": [
                                {"$in": ["$status", ["accepted", "rejected"]]},
                                1,
                                0
                            ]
                        }
                    },
                    "total_score": {"$sum": "$aggregated_score"},
                    "scored_count": {
                        "$sum": {
                            "$cond": [
                                {"$ne": ["$aggregated_score", None]},
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]
        
        stats = await self.db.submissions.aggregate(submission_pipeline).next()
        
        # Get review stats
        review_pipeline = [
            {"$match": {"sprint_id": ObjectId(sprint_id)}},
            {
                "$group": {
                    "_id": None,
                    "completed_reviews": {
                        "$sum": {
                            "$cond": [
                                {"$eq": ["$status", "completed"]},
                                1,
                                0
                            ]
                        }
                    },
                    "total_reviews": {"$sum": 1},
                    "total_time": {
                        "$sum": "$time_spent_minutes"
                    }
                }
            }
        ]
        
        review_stats = await self.db.submission_reviews.aggregate(
            review_pipeline
        ).next()
        
        return SprintStats(
            total_participants=total_participants,
            active_squads=active_squads,
            completed_submissions=stats["completed"],
            average_score=(
                stats["total_score"] / stats["scored_count"]
                if stats["scored_count"] > 0
                else None
            ),
            completion_rate=(
                stats["completed"] / active_squads
                if active_squads > 0
                else 0
            ),
            review_completion_rate=(
                review_stats["completed_reviews"] / review_stats["total_reviews"]
                if review_stats["total_reviews"] > 0
                else 0
            ),
            average_review_time_hours=(
                review_stats["total_time"] / review_stats["completed_reviews"] / 60
                if review_stats["completed_reviews"] > 0
                else None
            )
        )
    
    async def search_sprints(
        self,
        params: SprintSearchParams,
        skip: int = 0,
        limit: int = 20
    ) -> List[SprintModel]:
        """Search sprints based on criteria."""
        # Build query
        query = {}
        
        if params.status:
            query["state"] = {"$in": params.status}
            
        if params.sector_tags:
            query["sector_tags"] = {"$all": params.sector_tags}
            
        if params.difficulty_range:
            query["difficulty_level"] = {
                "$gte": params.difficulty_range[0],
                "$lte": params.difficulty_range[1]
            }
            
        if params.start_after:
            query["start_at"] = {"$gt": params.start_after}
            
        if params.end_before:
            query["end_at"] = {"$lt": params.end_before}
            
        if params.owner_id:
            query["owner_id"] = params.owner_id
        
        # Execute query
        cursor = self.db.sprints.find(query).sort(
            "start_at", -1
        ).skip(skip).limit(limit)
        
        sprints = []
        async for sprint in cursor:
            sprints.append(SprintModel(**sprint))
            
        return sprints
