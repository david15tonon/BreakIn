"""User profile model for MongoDB."""
from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, HttpUrl
from bson import ObjectId

class SocialLink(BaseModel):
    """Model for social media links."""
    platform: str
    url: HttpUrl
    verified: bool = False

class ProfileModel(BaseModel):
    """User profile model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    user_id: ObjectId  # Reference to UserModel
    
    # Basic Info
    bio: Optional[str] = None
    tagline: Optional[str] = None
    avatar_url: Optional[HttpUrl] = None
    location: Optional[str] = None
    timezone: Optional[str] = None
    
    # Contact & Social
    contact_email: Optional[str] = None  # Public email if different from login
    social_links: List[SocialLink] = []
    website: Optional[HttpUrl] = None
    
    # Professional
    company: Optional[str] = None
    title: Optional[str] = None
    years_of_experience: Optional[int] = None
    
    # Preferences
    visibility: str = "public"  # public, private, connections
    display_email: bool = False
    display_location: bool = True
    
    # Profile Completion
    completion_score: int = 0
    completed_sections: List[str] = []
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: Optional[datetime] = None
    
    # Custom Fields
    custom_fields: Dict = Field(default_factory=dict)
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }
        schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "bio": "Full-stack developer with passion for AI",
                "tagline": "Building the future of tech",
                "location": "San Francisco, CA",
                "visibility": "public"
            }
        }
