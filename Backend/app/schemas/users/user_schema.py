"""User-related schemas."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, HttpUrl, constr

class UserBase(BaseModel):
    """Base schema for user data."""
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    handle: constr(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_-]+$")

class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: constr(min_length=8, max_length=100)
    is_developer: bool = False
    company_name: Optional[str] = None

class UserUpdate(BaseModel):
    """Schema for updating user data."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    handle: Optional[constr(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_-]+$")] = None
    is_active: Optional[bool] = None

class UserPasswordUpdate(BaseModel):
    """Schema for updating user password."""
    current_password: str
    new_password: constr(min_length=8, max_length=100)

class UserResponse(UserBase):
    """Schema for user response data."""
    id: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    roles: List[str]
    
    class Config:
        """Configure schema."""
        from_attributes = True

class UserAuth(BaseModel):
    """Schema for user authentication."""
    email: EmailStr
    password: str

class UserWithToken(UserResponse):
    """Schema for user response with auth token."""
    access_token: str
    token_type: str = "bearer"
