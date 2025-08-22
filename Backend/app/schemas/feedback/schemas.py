"""Pydantic schemas for feedback and review API endpoints."""

from typing import Dict, List, Optional, Union
from datetime import datetime
from pydantic import BaseModel, Field, validator, constr

class ReviewScores(BaseModel):
    """Component scores for a review."""
    code_quality: float = Field(..., ge=0, le=10)
    design: float = Field(..., ge=0, le=10)
    testing: float = Field(..., ge=0, le=10)
    documentation: float = Field(..., ge=0, le=10)
    teamwork: float = Field(..., ge=0, le=10)
    innovation: float = Field(..., ge=0, le=10)
    presentation: float = Field(..., ge=0, le=10)

class ReviewBase(BaseModel):
    """Base schema for review operations."""
    submission_id: str
    scores: ReviewScores
    comments: constr(min_length=50, max_length=5000)
    
    @validator('comments')
    def no_pii_in_comments(cls, v):
        """Validate that comments don't contain obvious PII."""
        from app.utils.feedback.text_utils import contains_pii
        if contains_pii(v):
            raise ValueError("Comments cannot contain PII (emails, phone numbers, etc)")
        return v

class ReviewCreate(ReviewBase):
    """Schema for creating a new review."""
    draft: bool = True

class ReviewUpdate(ReviewBase):
    """Schema for updating an existing review."""
    pass

class ReviewOut(ReviewBase):
    """Schema for review responses."""
    id: str
    reviewer_id: str
    normalized_score: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class RubricComponentBase(BaseModel):
    """Base schema for rubric components."""
    key: str
    label: str
    description: str
    max_score: float = Field(10.0, ge=0)
    weight: float = Field(..., gt=0, le=1)
    
    @validator('weight')
    def weight_sum_validator(cls, v, values, **kwargs):
        """Ensure weights sum to 1.0."""
        return v

class RubricBase(BaseModel):
    """Base schema for rubrics."""
    name: str
    version: int
    description: str
    components: List[RubricComponentBase]

class RubricCreate(RubricBase):
    """Schema for creating a new rubric."""
    pass

class RubricUpdate(RubricBase):
    """Schema for updating an existing rubric."""
    pass

class RubricOut(RubricBase):
    """Schema for rubric responses."""
    id: str
    active: bool
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class FeedbackMessageBase(BaseModel):
    """Base schema for feedback thread messages."""
    content: constr(min_length=1, max_length=2000)
    
    @validator('content')
    def no_pii_in_content(cls, v):
        """Validate that messages don't contain obvious PII."""
        from app.utils.feedback.text_utils import contains_pii
        if contains_pii(v):
            raise ValueError("Messages cannot contain PII (emails, phone numbers, etc)")
        return v

class FeedbackThreadCreate(BaseModel):
    """Schema for creating a new feedback thread."""
    submission_id: str
    initial_message: FeedbackMessageBase

class FeedbackMessageCreate(FeedbackMessageBase):
    """Schema for adding a message to a thread."""
    thread_id: str

class FeedbackThreadOut(BaseModel):
    """Schema for feedback thread responses."""
    id: str
    submission_id: str
    messages: List[Dict]  # {author_id, content, timestamp}
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AppealBase(BaseModel):
    """Base schema for appeals."""
    review_id: str
    reason: constr(min_length=50, max_length=2000)
    evidence: constr(min_length=50, max_length=5000)

class AppealCreate(AppealBase):
    """Schema for creating a new appeal."""
    pass

class AppealUpdate(BaseModel):
    """Schema for updating an appeal."""
    status: str
    admin_notes: Optional[str]

class AppealOut(AppealBase):
    """Schema for appeal responses."""
    id: str
    submission_id: str
    author_id: str
    status: str
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class CalibrationSessionCreate(BaseModel):
    """Schema for creating a calibration session."""
    mentor_id: str
    scores: ReviewScores

class CalibrationSessionOut(BaseModel):
    """Schema for calibration session responses."""
    id: str
    mentor_id: str
    gold_item_id: str
    mentor_scores: Dict[str, float]
    gold_scores: Dict[str, float]
    disagreement: Dict[str, float]
    adjustment_factor: float
    status: str
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True

class ReviewTemplateBase(BaseModel):
    """Base schema for review templates."""
    name: str
    description: str
    category: str
    content: constr(min_length=50, max_length=2000)
    tags: List[str]

class ReviewTemplateCreate(ReviewTemplateBase):
    """Schema for creating a new review template."""
    pass

class ReviewTemplateUpdate(ReviewTemplateBase):
    """Schema for updating a review template."""
    pass

class ReviewTemplateOut(ReviewTemplateBase):
    """Schema for review template responses."""
    id: str
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
