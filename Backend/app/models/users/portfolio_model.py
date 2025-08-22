"""Portfolio and projects model for MongoDB."""
from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, HttpUrl
from bson import ObjectId

class MediaModel(BaseModel):
    """Media item model for portfolio artifacts."""
    url: HttpUrl
    type: str  # image, video, document
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[HttpUrl] = None
    size_bytes: Optional[int] = None
    mime_type: Optional[str] = None

class ProjectModel(BaseModel):
    """Portfolio project model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    user_id: ObjectId
    
    # Basic Info
    title: str
    description: str
    short_description: Optional[str] = None
    status: str = "completed"  # in-progress, completed, archived
    visibility: str = "public"  # public, private, connections
    
    # Dates
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Links
    repository_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    demo_url: Optional[HttpUrl] = None
    
    # Content
    technologies: List[str] = []
    highlights: List[str] = []
    media: List[MediaModel] = []
    
    # Metadata
    featured: bool = False
    order: int = 0
    views: int = 0
    likes: int = 0
    
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
                "title": "AI-Powered Code Review Tool",
                "description": "Built an automated code review system using GPT-4",
                "status": "completed",
                "technologies": ["Python", "FastAPI", "OpenAI"],
                "repository_url": "https://github.com/user/project"
            }
        }
