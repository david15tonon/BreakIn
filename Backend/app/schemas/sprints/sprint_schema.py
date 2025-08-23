"""Sprint-related Pydantic schemas."""
from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, validator

from app.models.sprints.sprint_model import SprintState, SprintConfig

class SprintBase(BaseModel):
    """Base schema for sprint data."""
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    start_at: datetime
    end_at: datetime
    config: SprintConfig
    sector_tags: List[str] = []
    difficulty_level: int = Field(1, ge=1, le=5)
    estimated_hours: int = Field(..., ge=1, le=168)
    prerequisites: List[str] = []

class SprintCreate(SprintBase):
    """Schema for creating a new sprint."""
    template_id: str
    
    @validator("end_at")
    def validate_end_date(cls, v, values):
        """Validate end date is after start date."""
        if "start_at" in values and v <= values["start_at"]:
            raise ValueError("End date must be after start date")
        return v

class SprintUpdate(BaseModel):
    """Schema for updating sprint data."""
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    config: Optional[SprintConfig] = None
    sector_tags: Optional[List[str]] = None
    difficulty_level: Optional[int] = Field(None, ge=1, le=5)
    estimated_hours: Optional[int] = Field(None, ge=1, le=168)
    prerequisites: Optional[List[str]] = None
    
    @validator("end_at")
    def validate_end_date(cls, v, values):
        """Validate end date is after start date if both are provided."""
        if v and "start_at" in values and values["start_at"] and v <= values["start_at"]:
            raise ValueError("End date must be after start date")
        return v

class SprintResponse(SprintBase):
    """Schema for sprint response data."""
    id: str
    template_id: str
    owner_id: str
    state: SprintState
    total_squads: int
    active_submissions: int
    completed_submissions: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    archived_at: Optional[datetime] = None
    
    class Config:
        """Configure schema."""
        from_attributes = True

class SprintStats(BaseModel):
    """Schema for sprint statistics."""
    total_participants: int
    active_squads: int
    completed_submissions: int
    average_score: Optional[float] = None
    completion_rate: float
    review_completion_rate: float
    average_review_time_hours: Optional[float] = None

class SprintSearchParams(BaseModel):
    """Schema for sprint search parameters."""
    status: Optional[List[SprintState]] = None
    sector_tags: Optional[List[str]] = None
    difficulty_range: Optional[tuple[int, int]] = None
    start_after: Optional[datetime] = None
    end_before: Optional[datetime] = None
    owner_id: Optional[str] = None

class SprintPublishRequest(BaseModel):
    """Schema for publishing a sprint."""
    announcement: Optional[str] = None
    notify_followers: bool = True

class SprintDeadlineExtension(BaseModel):
    """Schema for sprint deadline extension."""
    hours: int = Field(..., ge=1, le=168)
    reason: str
    notify_participants: bool = True

class SprintTemplate(BaseModel):
    """Schema for sprint template."""
    id: str
    title: str
    description: str
    sector_tags: List[str]
    difficulty_level: int
    estimated_hours: int
    config: SprintConfig
    prerequisites: List[str]
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        """Configure schema."""
        from_attributes = True
