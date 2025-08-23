"""User model for MongoDB."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId

class UserModel(BaseModel):
    """Base user model."""
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    email: EmailStr
    full_name: str
    handle: str  # Unique username/handle
    hashed_password: str
    is_active: bool = True
    is_verified: bool = False
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    # Security
    failed_login_attempts: int = 0
    last_failed_login: Optional[datetime] = None
    account_locked_until: Optional[datetime] = None
    
    # Features flags
    allow_endorsements: bool = True
    allow_messages: bool = True
    allow_portfolio_view: bool = True
    
    # Roles and access
    roles: List[str] = ["user"]
    access_level: int = 1  # 1=basic, 2=verified, 3=trusted, 4=admin
    
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
                "email": "john@example.com",
                "full_name": "John Doe",
                "handle": "johndoe",
                "is_active": True,
                "is_verified": False,
                "created_at": "2025-08-22T00:00:00",
                "roles": ["user"]
            }
        }
