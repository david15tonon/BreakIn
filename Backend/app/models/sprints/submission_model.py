"""Submission model definitions for MongoDB."""
from datetime import datetime
from typing import Optional, Dict, List
from enum import Enum
from pydantic import BaseModel, Field, HttpUrl
from bson import ObjectId

class SubmissionStatus(str, Enum):
    """Submission status states."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    NEEDS_REVISION = "needs_revision"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class ArtifactType(str, Enum):
    """Types of submission artifacts."""
    ZIP = "zip"
    REPOSITORY = "repository"
    DOCKER_IMAGE = "docker_image"
    DOCUMENT = "document"
    VIDEO = "video"
    PRESENTATION = "presentation"

class ArtifactLocation(BaseModel):
    """Storage location for artifacts."""
    key: str
    bucket: str
    region: Optional[str] = None
    cdn_url: Optional[HttpUrl] = None

class ArtifactMetadata(BaseModel):
    """Metadata for submission artifacts."""
    type: ArtifactType
    name: str
    size_bytes: int
    mime_type: str
    checksum: str
    location: ArtifactLocation
    scan_status: str = "pending"  # pending, clean, infected
    scan_timestamp: Optional[datetime] = None

class ScoreCard(BaseModel):
    """Detailed scoring breakdown."""
    code_quality: float = Field(0, ge=0, le=10)
    design: float = Field(0, ge=0, le=10)
    testing: float = Field(0, ge=0, le=10)
    documentation: float = Field(0, ge=0, le=10)
    innovation: float = Field(0, ge=0, le=10)
    teamwork: float = Field(0, ge=0, le=10)
    presentation: float = Field(0, ge=0, le=10)

class SubmissionModel(BaseModel):
    """Submission document model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    sprint_id: ObjectId
    squad_id: ObjectId
    author_anon_ids: List[str]  # Anonymous developer IDs
    
    # Submission content
    artifacts: List[ArtifactMetadata] = []
    repository_url: Optional[HttpUrl] = None
    deployment_url: Optional[HttpUrl] = None
    documentation_url: Optional[HttpUrl] = None
    
    # Status
    status: SubmissionStatus = SubmissionStatus.DRAFT
    attempt_number: int = 1
    is_late: bool = False
    late_minutes: int = 0
    
    # Scoring
    scores: Optional[ScoreCard] = None
    aggregated_score: Optional[float] = None
    penalty_percent: float = 0
    final_score: Optional[float] = None
    
    # Review tracking
    assigned_reviewers: List[str] = []
    reviews_completed: int = 0
    reviews_required: int = 2
    ai_review_completed: bool = False
    
    # Flags
    needs_manual_review: bool = False
    has_test_failures: bool = False
    has_security_issues: bool = False
    has_plagiarism_flag: bool = False
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    submitted_at: Optional[datetime] = None
    review_started_at: Optional[datetime] = None
    review_completed_at: Optional[datetime] = None
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "sprint_id": "507f1f77bcf86cd799439011",
                "squad_id": "507f1f77bcf86cd799439012",
                "author_anon_ids": ["anon_7A", "anon_9K"],
                "status": "submitted",
                "artifacts": [{
                    "type": "zip",
                    "name": "submission.zip",
                    "size_bytes": 204800,
                    "location": {
                        "key": "submissions/sprint-123/squad-456/submission.zip",
                        "bucket": "breakin-submissions"
                    }
                }]
            }
        }
