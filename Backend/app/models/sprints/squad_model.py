"""Squad model definitions for MongoDB."""
from datetime import datetime
from typing import Optional, Dict, List
from enum import Enum
from pydantic import BaseModel, Field
from bson import ObjectId

class SquadRole(str, Enum):
    """Squad member roles."""
    LEAD = "lead"
    DEVELOPER = "developer"
    REVIEWER = "reviewer"
    OBSERVER = "observer"

class SquadState(str, Enum):
    """Squad states."""
    FORMING = "forming"
    ACTIVE = "active"
    SUBMITTED = "submitted"
    COMPLETED = "completed"
    DISBANDED = "disbanded"

class SquadMember(BaseModel):
    """Squad member details."""
    user_id: str
    anon_id: str
    role: SquadRole
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    active: bool = True
    contributions: List[str] = []  # List of contribution types
    last_active: Optional[datetime] = None

class SquadActivity(BaseModel):
    """Squad activity record."""
    type: str  # commit, review, message, etc.
    timestamp: datetime
    member_anon_id: str
    details: Dict

class SquadModel(BaseModel):
    """Squad document model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    sprint_id: ObjectId
    name: str
    members: List[SquadMember] = []
    state: SquadState = SquadState.FORMING
    
    # Formation details
    formation_deadline: datetime
    min_size: int
    max_size: int
    current_size: int = 0
    is_full: bool = False
    
    # Squad attributes
    timezone: str = "UTC"
    preferred_hours: List[int] = []  # 0-23 hours in UTC
    primary_language: str = "en"
    stack_preferences: List[str] = []
    
    # Progress tracking
    repository_url: Optional[str] = None
    latest_submission_id: Optional[ObjectId] = None
    submission_attempts: int = 0
    last_activity: Optional[datetime] = None
    activity_log: List[SquadActivity] = []
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    activated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "sprint_id": "507f1f77bcf86cd799439011",
                "name": "Team Alpha",
                "members": [
                    {
                        "user_id": "user:123",
                        "anon_id": "anon_7A",
                        "role": "lead"
                    }
                ],
                "state": "forming",
                "timezone": "UTC",
                "stack_preferences": ["python", "react"]
            }
        }
