"""Skills and endorsements schemas."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class SkillBase(BaseModel):
    """Base schema for skill data."""
    name: str = Field(..., min_length=1, max_length=100)
    proficiency_level: int = Field(..., ge=1, le=5)
    years_experience: Optional[float] = Field(None, ge=0, le=100)
    category: Optional[str] = None
    tags: List[str] = []
    is_public: bool = True
    show_proficiency: bool = True

class SkillCreate(SkillBase):
    """Schema for creating a skill."""
    pass

class SkillUpdate(BaseModel):
    """Schema for updating a skill."""
    proficiency_level: Optional[int] = Field(None, ge=1, le=5)
    years_experience: Optional[float] = Field(None, ge=0, le=100)
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None
    show_proficiency: Optional[bool] = None

class SkillResponse(SkillBase):
    """Schema for skill response data."""
    id: str
    user_id: str
    endorsement_count: int
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    last_endorsed_at: Optional[datetime] = None
    
    class Config:
        """Configure schema."""
        from_attributes = True

class EndorsementBase(BaseModel):
    """Base schema for endorsement data."""
    skill_id: str
    anonymous: bool = False

class EndorsementCreate(EndorsementBase):
    """Schema for creating an endorsement."""
    pass

class EndorsementResponse(EndorsementBase):
    """Schema for endorsement response data."""
    id: str
    endorser_id: str
    endorsee_id: str
    created_at: datetime
    weight: float
    
    class Config:
        """Configure schema."""
        from_attributes = True

class SkillWithEndorsements(SkillResponse):
    """Skill response with endorsement details."""
    endorsements: List[EndorsementResponse]
