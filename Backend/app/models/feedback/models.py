"""Core database models for the feedback and review system."""

from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId

class Review(BaseModel):
    """A review of a submission by a mentor."""
    id: str = Field(default_factory=lambda: f"rev_{ObjectId()}")
    submission_id: str
    reviewer_id: str
    scores: Dict[str, float]  # Component name -> score mapping
    weights_used: Dict[str, float]  # Snapshot of weights when review was created
    normalized_score: float
    comments: str
    ai_feedback: Optional[Dict] = None
    status: str = "draft"  # draft, finalized, retracted
    locked_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class Reviewer(BaseModel):
    """Profile and metadata for a reviewer/mentor."""
    id: str = Field(default_factory=lambda: f"mentor_{ObjectId()}")
    user_id: str  # Reference to auth system user
    level: str = "trainee"  # trainee, junior, senior, lead
    specialties: List[str] = []
    reliability_score: float = 1.0  # Calibration-based adjustment factor
    reviews_completed: int = 0
    avg_review_time: float = 0.0  # In minutes
    last_active: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class Rubric(BaseModel):
    """Definition of a review rubric with components and weights."""
    id: str = Field(default_factory=lambda: f"rub_{ObjectId()}")
    name: str
    version: int
    description: str
    components: List[Dict[str, str | float]] = []  # List of {key, label, max, weight}
    active: bool = True
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class FeedbackThread(BaseModel):
    """A thread of feedback comments between mentor and author."""
    id: str = Field(default_factory=lambda: f"thread_{ObjectId()}")
    submission_id: str
    messages: List[Dict] = []  # List of {author_id, content, timestamp}
    status: str = "open"  # open, closed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class Appeal(BaseModel):
    """An appeal against a review decision."""
    id: str = Field(default_factory=lambda: f"appeal_{ObjectId()}")
    submission_id: str
    review_id: str
    author_id: str
    reason: str
    evidence: str
    status: str = "pending"  # pending, accepted, rejected
    admin_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class ReviewAudit(BaseModel):
    """Immutable audit log for review actions."""
    id: str = Field(default_factory=lambda: f"audit_{ObjectId()}")
    review_id: str
    action: str  # create, update, finalize, retract
    actor_id: str
    old_state: Optional[Dict] = None
    new_state: Dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class MentorActivity(BaseModel):
    """Summary of mentor contributions and activity."""
    id: str = Field(default_factory=lambda: f"activity_{ObjectId()}")
    mentor_id: str
    period: str  # YYYY-MM format
    reviews_completed: int = 0
    avg_review_time: float = 0.0
    total_time_spent: float = 0.0  # In minutes
    quality_score: float = 0.0  # Based on QA results
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class CalibrationSession(BaseModel):
    """A calibration session for mentors."""
    id: str = Field(default_factory=lambda: f"cal_{ObjectId()}")
    mentor_id: str
    gold_item_id: str
    mentor_scores: Dict[str, float]
    gold_scores: Dict[str, float]
    disagreement: Dict[str, float]
    adjustment_factor: float
    status: str = "pending"  # pending, completed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class ReviewTemplate(BaseModel):
    """Template for standardized reviews."""
    id: str = Field(default_factory=lambda: f"template_{ObjectId()}")
    name: str
    description: str
    category: str  # e.g., "code_quality", "design"
    content: str
    tags: List[str] = []
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }
