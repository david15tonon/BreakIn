"""Squad-related Pydantic schemas."""
from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, validator

from app.models.sprints.squad_model import SquadRole, SquadState, SquadActivity

class SquadMemberBase(BaseModel):
    """Base schema for squad member data."""
    role: SquadRole
    timezone: Optional[str] = None
    preferred_hours: List[int] = []
    stack_preferences: List[str] = []

class SquadMemberCreate(SquadMemberBase):
    """Schema for adding a member to squad."""
    pass

class SquadMemberUpdate(BaseModel):
    """Schema for updating squad member data."""
    role: Optional[SquadRole] = None
    timezone: Optional[str] = None
    preferred_hours: Optional[List[int]] = None
    stack_preferences: Optional[List[str]] = None
    active: Optional[bool] = None

class SquadMemberResponse(SquadMemberBase):
    """Schema for squad member response data."""
    anon_id: str
    joined_at: datetime
    active: bool
    contributions: List[str]
    last_active: Optional[datetime] = None
    
    class Config:
        """Configure schema."""
        from_attributes = True

class SquadBase(BaseModel):
    """Base schema for squad data."""
    name: str = Field(..., min_length=3, max_length=100)
    timezone: str = "UTC"
    preferred_hours: List[int] = []
    primary_language: str = "en"
    stack_preferences: List[str] = []

class SquadCreate(SquadBase):
    """Schema for creating a new squad."""
    sprint_id: str

class SquadUpdate(BaseModel):
    """Schema for updating squad data."""
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    timezone: Optional[str] = None
    preferred_hours: Optional[List[int]] = None
    primary_language: Optional[str] = None
    stack_preferences: Optional[List[str]] = None

class SquadResponse(SquadBase):
    """Schema for squad response data."""
    id: str
    sprint_id: str
    members: List[SquadMemberResponse]
    state: SquadState
    formation_deadline: datetime
    min_size: int
    max_size: int
    current_size: int
    is_full: bool
    repository_url: Optional[str] = None
    submission_attempts: int
    last_activity: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    activated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        """Configure schema."""
        from_attributes = True

class SquadJoinRequest(BaseModel):
    """Schema for requesting to join a squad."""
    timezone: str
    preferred_hours: List[int] = []
    stack_preferences: List[str] = []
    introduction: Optional[str] = None

class SquadInvite(BaseModel):
    """Schema for inviting a user to a squad."""
    user_id: str
    role: SquadRole = SquadRole.DEVELOPER
    message: Optional[str] = None

class SquadActivityLog(BaseModel):
    """Schema for squad activity log."""
    activities: List[SquadActivity]
    total_count: int
    has_more: bool
    
    class Config:
        """Configure schema."""
        from_attributes = True

class SquadStats(BaseModel):
    """Schema for squad statistics."""
    total_contributions: int
    contribution_breakdown: Dict[str, int]
    active_days: int
    average_daily_contributions: float
    member_stats: Dict[str, Dict]
    
    class Config:
        """Configure schema."""
        from_attributes = True
