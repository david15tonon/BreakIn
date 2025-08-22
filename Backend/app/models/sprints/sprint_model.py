"""Sprint model definitions for MongoDB."""
from datetime import datetime
from typing import Optional, Dict, List
from enum import Enum
from pydantic import BaseModel, Field
from bson import ObjectId

class SprintState(str, Enum):
    """Sprint states."""
    DRAFT = "draft"
    PUBLISHED = "published"
    ACTIVE = "active"
    CLOSED = "closed"
    ARCHIVED = "archived"

class SprintConfig(BaseModel):
    """Sprint configuration."""
    stack: List[str] = Field(..., description="Required tech stack")
    max_team_size: int = Field(4, ge=1, le=8)
    min_team_size: int = Field(2, ge=1, le=8)
    allow_late_submissions: bool = False
    late_penalty_percent: float = Field(0, ge=0, le=100)
    require_code_review: bool = True
    require_tests: bool = True
    require_documentation: bool = True
    max_submissions: int = Field(3, ge=1, le=10)
    submission_cooldown_minutes: int = 60
    timezone: str = "UTC"
    auto_close: bool = True
    artifact_retention_days: int = 90

class SprintModel(BaseModel):
    """Sprint document model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    template_id: ObjectId
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    owner_id: str  # Company or admin ID
    state: SprintState = SprintState.DRAFT
    start_at: datetime
    end_at: datetime
    config: SprintConfig
    
    # Metadata
    sector_tags: List[str] = []
    difficulty_level: int = Field(1, ge=1, le=5)
    estimated_hours: int = Field(..., ge=1, le=168)
    prerequisites: List[str] = []
    
    # Stats
    total_squads: int = 0
    active_submissions: int = 0
    completed_submissions: int = 0
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None
    archived_at: Optional[datetime] = None
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "FinTech Backend Sprint",
                "description": "Build a secure payment processing API",
                "owner_id": "company:123",
                "state": "published",
                "start_at": "2025-09-01T08:00:00Z",
                "end_at": "2025-09-08T08:00:00Z",
                "config": {
                    "stack": ["python", "postgres"],
                    "max_team_size": 4
                }
            }
        }
