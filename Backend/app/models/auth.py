# auth.py
from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    """User model."""
    id: str
    email: EmailStr
    is_mentor: bool = False
    is_admin: bool = False
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
