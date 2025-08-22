"""Service for managing feedback threads and appeals."""

from datetime import datetime
from typing import Dict, List, Optional
from fastapi import HTTPException

from app.models.feedback.models import (
    FeedbackThread,
    Appeal,
    ReviewAudit
)
from app.utils.feedback import text_utils
from app.services.notification import notify_user
from motor.motor_asyncio import AsyncIOMotorDatabase

class FeedbackService:
    """Service for managing feedback threads and appeals."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """Initialize the feedback service.
        
        Args:
            db: Database instance
        """
        self.db = db
        
    async def create_thread(self,
                          submission_id: str,
                          author_id: str,
                          initial_message: str) -> FeedbackThread:
        """Create a new feedback thread.
        
        Args:
            submission_id: ID of submission
            author_id: ID of thread creator
            initial_message: First message content
            
        Returns:
            Created thread
            
        Raises:
            HTTPException: If validation fails
        """
        # Sanitize and redact message
        message = text_utils.sanitize_markdown(initial_message)
        message, _ = text_utils.redact_pii(message)
        
        # Create thread
        thread = FeedbackThread(
            submission_id=submission_id,
            messages=[{
                "author_id": author_id,
                "content": message,
                "timestamp": datetime.utcnow()
            }]
        )
        
        # Insert into database
        result = await self.db.feedback_threads.insert_one(thread.dict())
        thread.id = str(result.inserted_id)
        
        return thread
        
    async def add_message(self,
                         thread_id: str,
                         author_id: str,
                         content: str) -> FeedbackThread:
        """Add a message to a thread.
        
        Args:
            thread_id: ID of thread
            author_id: ID of message author
            content: Message content
            
        Returns:
            Updated thread
            
        Raises:
            HTTPException: If thread not found or closed
        """
        # Get thread
        thread = await self.db.feedback_threads.find_one({"_id": thread_id})
        if not thread:
            raise HTTPException(
                status_code=404,
                detail="Thread not found"
            )
            
        # Check if closed
        if thread["status"] == "closed":
            raise HTTPException(
                status_code=400,
                detail="Thread is closed"
            )
            
        # Sanitize and redact message
        content = text_utils.sanitize_markdown(content)
        content, _ = text_utils.redact_pii(content)
        
        # Add message
        thread["messages"].append({
            "author_id": author_id,
            "content": content,
            "timestamp": datetime.utcnow()
        })
        thread["updated_at"] = datetime.utcnow()
        
        # Update in database
        await self.db.feedback_threads.replace_one(
            {"_id": thread_id},
            thread
        )
        
        # Notify other participants
        participant_ids = set(
            msg["author_id"] for msg in thread["messages"]
        ) - {author_id}
        
        for participant_id in participant_ids:
            await notify_user(
                participant_id,
                f"New message in feedback thread for submission {thread['submission_id']}"
            )
        
        return FeedbackThread(**thread)
        
    async def close_thread(self,
                          thread_id: str,
                          actor_id: str) -> FeedbackThread:
        """Close a feedback thread.
        
        Args:
            thread_id: ID of thread to close
            actor_id: ID of user closing thread
            
        Returns:
            Closed thread
            
        Raises:
            HTTPException: If thread not found or already closed
        """
        # Get thread
        thread = await self.db.feedback_threads.find_one({"_id": thread_id})
        if not thread:
            raise HTTPException(
                status_code=404,
                detail="Thread not found"
            )
            
        if thread["status"] == "closed":
            raise HTTPException(
                status_code=400,
                detail="Thread already closed"
            )
            
        # Close thread
        thread["status"] = "closed"
        thread["updated_at"] = datetime.utcnow()
        
        # Add system message
        thread["messages"].append({
            "author_id": "system",
            "content": f"Thread closed by {actor_id}",
            "timestamp": datetime.utcnow()
        })
        
        # Update in database
        await self.db.feedback_threads.replace_one(
            {"_id": thread_id},
            thread
        )
        
        return FeedbackThread(**thread)
        
    async def create_appeal(self,
                          submission_id: str,
                          review_id: str,
                          author_id: str,
                          reason: str,
                          evidence: str) -> Appeal:
        """Create a new appeal.
        
        Args:
            submission_id: ID of submission
            review_id: ID of review being appealed
            author_id: ID of appeal creator
            reason: Reason for appeal
            evidence: Supporting evidence
            
        Returns:
            Created appeal
            
        Raises:
            HTTPException: If validation fails or duplicate appeal
        """
        # Check for existing appeal
        existing = await self.db.appeals.find_one({
            "submission_id": submission_id,
            "review_id": review_id,
            "status": {"$in": ["pending", "in_progress"]}
        })
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Active appeal already exists for this review"
            )
            
        # Sanitize and redact content
        reason = text_utils.sanitize_markdown(reason)
        reason, _ = text_utils.redact_pii(reason)
        
        evidence = text_utils.sanitize_markdown(evidence)
        evidence, _ = text_utils.redact_pii(evidence)
        
        # Create appeal
        appeal = Appeal(
            submission_id=submission_id,
            review_id=review_id,
            author_id=author_id,
            reason=reason,
            evidence=evidence
        )
        
        # Insert into database
        result = await self.db.appeals.insert_one(appeal.dict())
        appeal.id = str(result.inserted_id)
        
        # Notify admins
        await notify_user(
            "admin",
            f"New appeal created for review {review_id}"
        )
        
        return appeal
        
    async def process_appeal(self,
                           appeal_id: str,
                           admin_id: str,
                           decision: str,
                           notes: Optional[str] = None) -> Appeal:
        """Process an appeal decision.
        
        Args:
            appeal_id: ID of appeal
            admin_id: ID of admin processing appeal
            decision: Decision (accepted/rejected)
            notes: Optional admin notes
            
        Returns:
            Updated appeal
            
        Raises:
            HTTPException: If appeal not found or already processed
        """
        # Get appeal
        appeal = await self.db.appeals.find_one({"_id": appeal_id})
        if not appeal:
            raise HTTPException(
                status_code=404,
                detail="Appeal not found"
            )
            
        if appeal["status"] != "pending":
            raise HTTPException(
                status_code=400,
                detail="Appeal already processed"
            )
            
        # Update appeal
        appeal["status"] = decision
        appeal["admin_notes"] = notes
        appeal["updated_at"] = datetime.utcnow()
        
        await self.db.appeals.replace_one(
            {"_id": appeal_id},
            appeal
        )
        
        # Create audit entry
        await self._create_appeal_audit(
            appeal_id,
            admin_id,
            decision,
            notes
        )
        
        # If accepted, mark review for re-evaluation
        if decision == "accepted":
            await self.db.reviews.update_one(
                {"_id": appeal["review_id"]},
                {
                    "$set": {
                        "status": "under_review",
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
        # Notify author
        await notify_user(
            appeal["author_id"],
            f"Your appeal for review {appeal['review_id']} has been {decision}"
        )
        
        return Appeal(**appeal)
        
    async def list_threads(self,
                          submission_id: Optional[str] = None,
                          status: Optional[str] = None,
                          limit: int = 50,
                          skip: int = 0) -> List[FeedbackThread]:
        """List feedback threads with optional filters.
        
        Args:
            submission_id: Filter by submission
            status: Filter by status
            limit: Maximum to return
            skip: Number to skip
            
        Returns:
            List of matching threads
        """
        # Build query
        query = {}
        if submission_id:
            query["submission_id"] = submission_id
        if status:
            query["status"] = status
            
        # Execute query
        threads = await self.db.feedback_threads.find(query).sort(
            "updated_at", -1
        ).skip(skip).limit(limit).to_list(None)
        
        return [FeedbackThread(**t) for t in threads]
        
    async def list_appeals(self,
                          submission_id: Optional[str] = None,
                          status: Optional[str] = None,
                          limit: int = 50,
                          skip: int = 0) -> List[Appeal]:
        """List appeals with optional filters.
        
        Args:
            submission_id: Filter by submission
            status: Filter by status
            limit: Maximum to return
            skip: Number to skip
            
        Returns:
            List of matching appeals
        """
        # Build query
        query = {}
        if submission_id:
            query["submission_id"] = submission_id
        if status:
            query["status"] = status
            
        # Execute query
        appeals = await self.db.appeals.find(query).sort(
            "created_at", -1
        ).skip(skip).limit(limit).to_list(None)
        
        return [Appeal(**a) for a in appeals]
        
    async def _create_appeal_audit(self,
                                 appeal_id: str,
                                 admin_id: str,
                                 decision: str,
                                 notes: Optional[str]) -> None:
        """Create an audit entry for appeal decision.
        
        Args:
            appeal_id: ID of appeal
            admin_id: ID of admin
            decision: Decision made
            notes: Optional notes
        """
        audit = ReviewAudit(
            review_id=appeal_id,  # Using appeal ID here
            action="appeal_decision",
            actor_id=admin_id,
            new_state={
                "decision": decision,
                "notes": notes,
                "timestamp": datetime.utcnow()
            }
        )
        
        await self.db.review_audit.insert_one(audit.dict())
