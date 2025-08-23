"""Routes for submitting and managing reviews."""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies import get_db, get_current_user
from app.models.auth import User
from app.schemas.feedback.schemas import (
    ReviewCreate, ReviewUpdate, ReviewOut,
    RubricCreate, RubricUpdate, RubricOut
)
from app.services.feedback.review_service import ReviewService

router = APIRouter()

@router.post("/reviews", response_model=ReviewOut)
async def create_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ReviewOut:
    """Create a new review.
    
    Args:
        review: Review data
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Created review
        
    Raises:
        HTTPException: If user not authorized or validation fails
    """
    # Verify user is a mentor
    if not current_user.is_mentor:
        raise HTTPException(
            status_code=403,
            detail="Only mentors can create reviews"
        )
        
    service = ReviewService(db)
    return await service.create_review(
        submission_id=review.submission_id,
        reviewer_id=current_user.id,
        scores=review.scores.dict(),
        comments=review.comments,
        draft=review.draft
    )

@router.put("/reviews/{review_id}", response_model=ReviewOut)
async def update_review(
    review_id: str,
    updates: ReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ReviewOut:
    """Update an existing review.
    
    Args:
        review_id: ID of review to update
        updates: Review updates
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Updated review
        
    Raises:
        HTTPException: If user not authorized or review locked
    """
    service = ReviewService(db)
    return await service.update_review(
        review_id=review_id,
        reviewer_id=current_user.id,
        updates=updates.dict()
    )

@router.post("/reviews/{review_id}/finalize", response_model=ReviewOut)
async def finalize_review(
    review_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ReviewOut:
    """Finalize a review.
    
    Args:
        review_id: ID of review to finalize
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Finalized review
        
    Raises:
        HTTPException: If user not authorized or review locked
    """
    service = ReviewService(db)
    return await service.finalize_review(
        review_id=review_id,
        reviewer_id=current_user.id
    )

@router.get("/reviews/{review_id}", response_model=ReviewOut)
async def get_review(
    review_id: str,
    include_audit: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> ReviewOut:
    """Get a review by ID.
    
    Args:
        review_id: ID of review to get
        include_audit: Whether to include audit history
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Review data
        
    Raises:
        HTTPException: If review not found or user not authorized
    """
    service = ReviewService(db)
    review = await service.get_review(
        review_id=review_id,
        include_audit=include_audit
    )
    
    # Check authorization
    if not current_user.is_mentor and not current_user.is_admin:
        # Authors can only see their own submissions
        submission = await db.submissions.find_one({
            "_id": review.submission_id
        })
        if not submission or submission["author_id"] != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to view this review"
            )
            
    return review

@router.get("/reviews", response_model=List[ReviewOut])
async def list_reviews(
    submission_id: Optional[str] = None,
    reviewer_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> List[ReviewOut]:
    """List reviews with optional filters.
    
    Args:
        submission_id: Filter by submission
        reviewer_id: Filter by reviewer
        status: Filter by status
        limit: Maximum to return
        skip: Number to skip
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        List of reviews
        
    Raises:
        HTTPException: If user not authorized
    """
    # Apply authorization filters
    if not current_user.is_admin:
        if current_user.is_mentor:
            # Mentors can only see their own reviews
            reviewer_id = current_user.id
        else:
            # Authors can only see reviews of their submissions
            submission_ids = await db.submissions.distinct(
                "_id",
                {"author_id": current_user.id}
            )
            if submission_id and submission_id not in submission_ids:
                raise HTTPException(
                    status_code=403,
                    detail="Not authorized to view these reviews"
                )
            submission_id = {"$in": submission_ids}
            
    service = ReviewService(db)
    return await service.list_reviews(
        submission_id=submission_id,
        reviewer_id=reviewer_id,
        status=status,
        limit=limit,
        skip=skip
    )

@router.post("/rubrics", response_model=RubricOut)
async def create_rubric(
    rubric: RubricCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> RubricOut:
    """Create a new review rubric.
    
    Args:
        rubric: Rubric data
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Created rubric
        
    Raises:
        HTTPException: If user not admin
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Only admins can create rubrics"
        )
        
    service = ReviewService(db)
    return await service.create_rubric(
        **rubric.dict(),
        created_by=current_user.id
    )

@router.put("/rubrics/{rubric_id}", response_model=RubricOut)
async def update_rubric(
    rubric_id: str,
    updates: RubricUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> RubricOut:
    """Update an existing rubric.
    
    Args:
        rubric_id: ID of rubric to update
        updates: Rubric updates
        current_user: Authenticated user
        db: Database instance
        
    Returns:
        Updated rubric
        
    Raises:
        HTTPException: If user not admin
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Only admins can update rubrics"
        )
        
    service = ReviewService(db)
    return await service.update_rubric(
        rubric_id=rubric_id,
        **updates.dict()
    )

@router.get("/rubrics/active", response_model=RubricOut)
async def get_active_rubric(
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> RubricOut:
    """Get the currently active rubric.
    
    Args:
        db: Database instance
        
    Returns:
        Active rubric
        
    Raises:
        HTTPException: If no active rubric found
    """
    service = ReviewService(db)
    rubric = await service.get_active_rubric()
    if not rubric:
        raise HTTPException(
            status_code=404,
            detail="No active rubric found"
        )
    return rubric

@router.get("/rubrics/{rubric_id}", response_model=RubricOut)
async def get_rubric(
    rubric_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> RubricOut:
    """Get a rubric by ID.
    
    Args:
        rubric_id: ID of rubric to get
        db: Database instance
        
    Returns:
        Rubric data
        
    Raises:
        HTTPException: If rubric not found
    """
    service = ReviewService(db)
    rubric = await service.get_rubric(rubric_id)
    if not rubric:
        raise HTTPException(
            status_code=404,
            detail="Rubric not found"
        )
    return rubric
