"""Profile-related schemas."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, HttpUrl

class SocialLinkBase(BaseModel):
    """Base schema for social media links."""
    platform: str
    url: HttpUrl

class SocialLinkCreate(SocialLinkBase):
    """Schema for creating a social media link."""
    pass

class SocialLinkResponse(SocialLinkBase):
    """Schema for social media link response."""
    verified: bool = False

class ProfileBase(BaseModel):
    """Base schema for profile data."""
    bio: Optional[str] = Field(None, max_length=1000)
    tagline: Optional[str] = Field(None, max_length=160)
    location: Optional[str] = Field(None, max_length=100)
    timezone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[HttpUrl] = None
    company: Optional[str] = Field(None, max_length=100)
    title: Optional[str] = Field(None, max_length=100)
    years_of_experience: Optional[int] = Field(None, ge=0, le=100)

class ProfileCreate(ProfileBase):
    """Schema for creating a profile."""
    visibility: str = "public"
    display_email: bool = False
    display_location: bool = True

class ProfileUpdate(ProfileBase):
    """Schema for updating a profile."""
    visibility: Optional[str] = None
    display_email: Optional[bool] = None
    display_location: Optional[bool] = None
    social_links: Optional[List[SocialLinkCreate]] = None

class ProfileResponse(ProfileBase):
    """Schema for profile response data."""
    id: str
    user_id: str
    visibility: str
    display_email: bool
    display_location: bool
    social_links: List[SocialLinkResponse]
    completion_score: int
    completed_sections: List[str]
    created_at: datetime
    updated_at: datetime
    avatar_url: Optional[HttpUrl] = None
    
    class Config:
        """Configure schema."""
        from_attributes = True

class ProfileWithStats(ProfileResponse):
    """Profile response with additional stats."""
    total_endorsements: int
    total_projects: int
    skills_count: int
