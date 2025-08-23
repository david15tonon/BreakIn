"""Review model definitions for MongoDB."""
from datetime import datetime
from typing import Optional, Dict, List
from enum import Enum
from pydantic import BaseModel, Field
from bson import ObjectId

from app.models.sprints.submission_model import ScoreCard

class ReviewerType(str, Enum):
    """Types of reviewers."""
    MENTOR = "mentor"
    AI = "ai"
    PEER = "peer"
    ADMIN = "admin"

class ReviewStatus(str, Enum):
    """Review status states."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    APPEALED = "appealed"
    OVERRIDDEN = "overridden"

class CodeIssue(BaseModel):
    """Code issue identified in review."""
    severity: str  # critical, major, minor
    file_path: str
    line_number: int
    message: str
    suggestion: Optional[str] = None
    category: str  # security, performance, style, etc.

class ReviewFeedback(BaseModel):
    """Detailed review feedback."""
    strengths: List[str] = []
    areas_for_improvement: List[str] = []
    code_issues: List[CodeIssue] = []
    general_comments: str
    suggested_resources: List[str] = []

class SubmissionReviewModel(BaseModel):
    """Review document model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    submission_id: ObjectId
    reviewer_id: str
    reviewer_type: ReviewerType
    
    # Review content
    scores: ScoreCard
    feedback: ReviewFeedback
    
    # Status
    status: ReviewStatus = ReviewStatus.PENDING
    is_final: bool = False
    requires_revision: bool = False
    
    # Time tracking
    assigned_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    time_spent_minutes: Optional[int] = None
    
    # Appeal handling
    has_appeal: bool = False
    appeal_reason: Optional[str] = None
    appeal_response: Optional[str] = None
    appeal_resolved_at: Optional[datetime] = None
    
    # Mentor oversight (for AI reviews)
    mentor_approved: Optional[bool] = None
    mentor_comments: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "submission_id": "507f1f77bcf86cd799439011",
                "reviewer_id": "mentor:44",
                "reviewer_type": "mentor",
                "scores": {
                    "code_quality": 8.5,
                    "design": 9.0,
                    "testing": 7.5,
                    "documentation": 8.0,
                    "teamwork": 8.0
                },
                "feedback": {
                    "strengths": ["Well-structured code", "Clear documentation"],
                    "areas_for_improvement": ["Add more unit tests", "Consider edge cases"],
                    "general_comments": "Good overall implementation"
                }
            }
        }
