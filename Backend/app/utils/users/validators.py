"""Validators for user data."""
import re
from typing import Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, validator
from fastapi import HTTPException

class UserDataValidator(BaseModel):
    """Validator for user data."""
    
    @validator("handle")
    def validate_handle(cls, v: str) -> str:
        """Validate handle format."""
        if not v:
            raise ValueError("Handle is required")
            
        if not re.match(r"^[a-zA-Z0-9][a-zA-Z0-9_-]{2,29}$", v):
            raise ValueError(
                "Handle must be 3-30 characters long and contain only "
                "letters, numbers, underscores, and hyphens"
            )
            
        return v
    
    @validator("full_name")
    def validate_name(cls, v: str) -> str:
        """Validate full name."""
        if not v:
            raise ValueError("Full name is required")
            
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
            
        if len(v) > 100:
            raise ValueError("Full name must be less than 100 characters")
            
        if not re.match(r"^[a-zA-Z0-9\s\-'\.]+$", v):
            raise ValueError("Full name contains invalid characters")
            
        return v
    
    @validator("password")
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if not v:
            raise ValueError("Password is required")
            
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
            
        if len(v) > 100:
            raise ValueError("Password must be less than 100 characters")
            
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
            
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
            
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
            
        if not re.search(r"[^A-Za-z0-9]", v):
            raise ValueError("Password must contain at least one special character")
            
        return v

def validate_url(url: Optional[str]) -> Optional[str]:
    """Validate URL format."""
    if not url:
        return None
        
    if not re.match(
        r"^https?:\/\/"
        r"(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\."
        r"[a-zA-Z0-9()]{1,6}\b"
        r"(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$",
        url
    ):
        raise ValueError("Invalid URL format")
        
    return url

def validate_social_links(links: list) -> list:
    """Validate social media links."""
    valid_platforms = {
        "github",
        "linkedin",
        "twitter",
        "stackoverflow",
        "medium",
        "dev.to",
        "gitlab",
        "behance",
        "dribbble",
        "youtube"
    }
    
    for link in links:
        if not isinstance(link, dict):
            raise ValueError("Invalid link format")
            
        if "platform" not in link or "url" not in link:
            raise ValueError("Link must contain platform and url")
            
        if link["platform"].lower() not in valid_platforms:
            raise ValueError(f"Invalid platform: {link['platform']}")
            
        validate_url(link["url"])
        
    return links

def validate_media_item(item: Dict[str, Any]) -> Dict[str, Any]:
    """Validate media item data."""
    required_fields = {"url", "type"}
    if not all(field in item for field in required_fields):
        raise ValueError("Media item must contain url and type")
        
    valid_types = {"image", "video", "document"}
    if item["type"] not in valid_types:
        raise ValueError(f"Invalid media type: {item['type']}")
        
    item["url"] = validate_url(item["url"])
    
    if "thumbnail_url" in item:
        item["thumbnail_url"] = validate_url(item["thumbnail_url"])
        
    return item
