"""Skills and endorsements model for MongoDB."""
from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from bson import ObjectId

class EndorsementModel(BaseModel):
    """Endorsement model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    skill_id: ObjectId
    endorser_id: ObjectId
    endorsee_id: ObjectId
    anonymous: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    weight: float = 1.0  # For weighted endorsements based on endorser reputation

class SkillModel(BaseModel):
    """Skill model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    user_id: ObjectId
    name: str  # Normalized skill name
    original_name: str  # User input before normalization
    proficiency_level: int  # 1-5 (beginner to expert)
    years_experience: Optional[float] = None
    endorsement_count: int = 0
    is_primary: bool = False
    is_verified: bool = False  # Through assessments or work history
    
    # Visibility
    is_public: bool = True
    show_proficiency: bool = True
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_endorsed_at: Optional[datetime] = None
    
    # Taxonomies and categorization
    category: Optional[str] = None  # e.g., "Programming Language", "Framework"
    tags: List[str] = []
    
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
                "name": "python",
                "original_name": "Python",
                "proficiency_level": 4,
                "years_experience": 3.5,
                "endorsement_count": 12,
                "category": "Programming Language"
            }
        }
