"""Routes for feedback threads and appeals."""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies import get_db, get_current_user
from app.models.auth import User
from app.schemas.feedback.schemas import (
    FeedbackThreadCreate,
    FeedbackMessageCreate,
    FeedbackThreadOut,
    AppealCreate,
    AppealUpdate,
    AppealOut
)
from app.services.feedback.feedback_service import FeedbackService

router = APIRouter()

@router.post("/threads", response_model=FeedbackThreadOut)
async def create_thread(
    thread: FeedbackThreadCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> FeedbackThreadOut:
    """Create a new feedback thread.
    
    Args:
        thread: Thread data
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Created thread
        
    Raises:
        HTTPException: If user not authorized
    """
    # Verify user can create thread
    submission = await db.submissions.find_one({"_id": thread.submission_id})
    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )
        
    if not current_user.is_mentor and submission["author_id"] != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to create thread for this submission"
        )
        
    service = FeedbackService(db)
    return await service.create_thread(
        submission_id=thread.submission_id,
        author_id=current_user.id,
        initial_message=thread.initial_message.content
    )

@router.post("/threads/{thread_id}/messages", response_model=FeedbackThreadOut)
async def add_message(
    message: FeedbackMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> FeedbackThreadOut:
    """Add a message to a thread.
    
    Args:
        message: Message data
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Updated thread
        
    Raises:
        HTTPException: If user not authorized or thread closed
    """
    # Get thread
    thread = await db.feedback_threads.find_one({"_id": message.thread_id})
    if not thread:
        raise HTTPException(
            status_code=404,
            detail="Thread not found"
        )
        
    # Verify user can post to thread
    submission = await db.submissions.find_one({"_id": thread["submission_id"]})
    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )
        
    if not current_user.is_mentor and submission["author_id"] != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to post to this thread"
        )
        
    service = FeedbackService(db)
    return await service.add_message(
        thread_id=message.thread_id,
        author_id=current_user.id,
        content=message.content
    )

@router.post("/threads/{thread_id}/close", response_model=FeedbackThreadOut)
async def close_thread(
    thread_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> FeedbackThreadOut:
    """Close a feedback thread.
    
    Args:
        thread_id: ID of thread to close
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Closed thread
        
    Raises:
        HTTPException: If user not authorized
    """
    # Only mentors and admins can close threads
    if not current_user.is_mentor and not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Only mentors and admins can close threads"
        )
        
    service = FeedbackService(db)
    return await service.close_thread(
        thread_id=thread_id,
        actor_id=current_user.id
    )

@router.get("/threads", response_model=List[FeedbackThreadOut])
async def list_threads(
    submission_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[FeedbackThreadOut]:
    """List feedback threads with optional filters.
    
    Args:
        submission_id: Filter by submission
        status: Filter by status
        limit: Maximum to return
        skip: Number to skip
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        List of threads
        
    Raises:
        HTTPException: If user not authorized
    """
    # Apply authorization filters
    if not current_user.is_admin and not current_user.is_mentor:
        # Regular users can only see threads for their submissions
        submission_ids = await db.submissions.distinct(
            "_id",
            {"author_id": current_user.id}
        )
        if submission_id and submission_id not in submission_ids:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to view these threads"
            )
        submission_id = {"$in": submission_ids}
        
    service = FeedbackService(db)
    return await service.list_threads(
        submission_id=submission_id,
        status=status,
        limit=limit,
        skip=skip
    )

@router.post("/appeals", response_model=AppealOut)
async def create_appeal(
    appeal: AppealCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> AppealOut:
    """Create a new appeal.
    
    Args:
        appeal: Appeal data
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Created appeal
        
    Raises:
        HTTPException: If user not authorized or review not found
    """
    # Get review
    review = await db.reviews.find_one({"_id": appeal.review_id})
    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )
        
    # Verify user can appeal
    submission = await db.submissions.find_one({"_id": review["submission_id"]})
    if not submission or submission["author_id"] != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to appeal this review"
        )
        
    service = FeedbackService(db)
    return await service.create_appeal(
        submission_id=review["submission_id"],
        review_id=appeal.review_id,
        author_id=current_user.id,
        reason=appeal.reason,
        evidence=appeal.evidence
    )

@router.put("/appeals/{appeal_id}", response_model=AppealOut)
async def process_appeal(
    appeal_id: str,
    update: AppealUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> AppealOut:
    """Process an appeal decision.
    
    Args:
        appeal_id: ID of appeal to process
        update: Appeal decision
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Updated appeal
        
    Raises:
        HTTPException: If user not admin
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Only admins can process appeals"
        )
        
    service = FeedbackService(db)
    return await service.process_appeal(
        appeal_id=appeal_id,
        admin_id=current_user.id,
        decision=update.status,
        notes=update.admin_notes
    )

@router.get("/appeals", response_model=List[AppealOut])
async def list_appeals(
    submission_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[AppealOut]:
    """List appeals with optional filters.
    
    Args:
        submission_id: Filter by submission
        status: Filter by status
        limit: Maximum to return
        skip: Number to skip
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        List of appeals
        
    Raises:
        HTTPException: If user not authorized
    """
    # Apply authorization filters
    if not current_user.is_admin:
        # Regular users can only see their own appeals
        submission_ids = await db.submissions.distinct(
            "_id",
            {"author_id": current_user.id}
        )
        if submission_id and submission_id not in submission_ids:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to view these appeals"
            )
        submission_id = {"$in": submission_ids}
        
    service = FeedbackService(db)
    return await service.list_appeals(
        submission_id=submission_id,
        status=status,
        limit=limit,
        skip=skip
    )
