"""Routes for double-blind review functionality."""

from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, List, Optional

from app.dependencies import get_db, get_current_user
from app.models.auth import User
from app.schemas.feedback.schemas import (
    ReviewCreate,
    ReviewOut,
    FeedbackThreadCreate,
    FeedbackThreadOut
)
from app.services.feedback.review_service import ReviewService
from app.services.feedback.feedback_service import FeedbackService
from app.utils.feedback import text_utils

router = APIRouter()

@router.post("/blind-reviews", response_model=ReviewOut)
async def create_blind_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ReviewOut:
    """Create a new blind review.
    
    In blind reviews:
    1. Reviewer cannot see author identity
    2. Author cannot see reviewer identity until reveal
    3. Comments are automatically redacted
    4. Communication happens through anonymous threads
    
    Args:
        review: Review data
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Created review (with redacted information)
        
    Raises:
        HTTPException: If user not authorized or blind review not enabled
    """
    # Check if blind review is enabled for this submission
    submission = await db.submissions.find_one({"_id": review.submission_id})
    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )
        
    if not submission.get("blind_review_enabled"):
        raise HTTPException(
            status_code=400,
            detail="Blind review not enabled for this submission"
        )
        
    # Verify user is a mentor
    if not current_user.is_mentor:
        raise HTTPException(
            status_code=403,
            detail="Only mentors can create reviews"
        )
        
    # Apply extra redaction to comments
    redacted_comments = text_utils.sanitize_markdown(review.comments)
    redacted_comments, _ = text_utils.redact_pii(redacted_comments)
    redacted_comments = text_utils.stylometric_obfuscation(redacted_comments)
    
    # Create review with anonymous reviewer
    service = ReviewService(db)
    blind_review = await service.create_review(
        submission_id=review.submission_id,
        reviewer_id=f"anon_{current_user.id}",  # Anonymized ID
        scores=review.scores.dict(),
        comments=redacted_comments,
        draft=review.draft
    )
    
    # Store mapping of real to anonymous ID
    await db.reviewer_mappings.insert_one({
        "submission_id": review.submission_id,
        "real_id": current_user.id,
        "anonymous_id": f"anon_{current_user.id}",
        "reveal_allowed": False
    })
    
    return blind_review

@router.post("/blind-threads", response_model=FeedbackThreadOut)
async def create_blind_thread(
    thread: FeedbackThreadCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> FeedbackThreadOut:
    """Create a new blind feedback thread.
    
    Args:
        thread: Thread data
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Created thread (with redacted information)
        
    Raises:
        HTTPException: If user not authorized
    """
    # Check if blind review is enabled
    submission = await db.submissions.find_one({"_id": thread.submission_id})
    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )
        
    if not submission.get("blind_review_enabled"):
        raise HTTPException(
            status_code=400,
            detail="Blind review not enabled for this submission"
        )
        
    # Get anonymous ID if mentor
    author_id = current_user.id
    if current_user.is_mentor:
        mapping = await db.reviewer_mappings.find_one({
            "submission_id": thread.submission_id,
            "real_id": current_user.id
        })
        if mapping:
            author_id = mapping["anonymous_id"]
    
    # Apply redaction to message
    redacted_message = text_utils.sanitize_markdown(
        thread.initial_message.content
    )
    redacted_message, _ = text_utils.redact_pii(redacted_message)
    redacted_message = text_utils.stylometric_obfuscation(redacted_message)
    
    service = FeedbackService(db)
    return await service.create_thread(
        submission_id=thread.submission_id,
        author_id=author_id,
        initial_message=redacted_message
    )

@router.post("/reveal-identities/{submission_id}")
async def reveal_review_identities(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, List[Dict]]:
    """Reveal reviewer identities for a submission.
    
    This should only be done after:
    1. All reviews are complete
    2. Appeal window has passed
    3. Both parties agree
    
    Args:
        submission_id: ID of submission
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Dict with reviewer mappings
        
    Raises:
        HTTPException: If reveal conditions not met
    """
    # Check if user authorized
    submission = await db.submissions.find_one({"_id": submission_id})
    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )
        
    if not current_user.is_admin and submission["author_id"] != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to reveal identities"
        )
        
    # Check if reveal allowed
    reviews = await db.reviews.find({
        "submission_id": submission_id,
        "status": "finalized"
    }).to_list(None)
    
    if not reviews:
        raise HTTPException(
            status_code=400,
            detail="No finalized reviews found"
        )
        
    # Get mappings where reveal is allowed
    mappings = await db.reviewer_mappings.find({
        "submission_id": submission_id,
        "reveal_allowed": True
    }).to_list(None)
    
    if not mappings:
        raise HTTPException(
            status_code=400,
            detail="No reviewers have allowed identity reveal"
        )
        
    # Get reviewer details
    revealed = []
    for mapping in mappings:
        reviewer = await db.reviewers.find_one({"_id": mapping["real_id"]})
        if reviewer:
            revealed.append({
                "anonymous_id": mapping["anonymous_id"],
                "real_id": mapping["real_id"],
                "name": reviewer.get("name"),
                "level": reviewer.get("level"),
                "specialties": reviewer.get("specialties", [])
            })
            
    return {
        "submission_id": submission_id,
        "revealed_reviewers": revealed
    }

@router.post("/opt-in-reveal/{submission_id}")
async def opt_in_identity_reveal(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Opt in to revealing identity for a review.
    
    Args:
        submission_id: ID of submission
        current_user: Authenticated user
        db: Database instance
        
    Raises:
        HTTPException: If user not a reviewer
    """
    # Check if user is a reviewer
    mapping = await db.reviewer_mappings.find_one({
        "submission_id": submission_id,
        "real_id": current_user.id
    })
    
    if not mapping:
        raise HTTPException(
            status_code=404,
            detail="No review found for this submission"
        )
        
    # Update mapping to allow reveal
    await db.reviewer_mappings.update_one(
        {"_id": mapping["_id"]},
        {"$set": {"reveal_allowed": True}}
    )
    
    return {"status": "success"}
