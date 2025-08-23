"""Models for company matching preferences."""
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId

class CompanyMatchProfile(BaseModel):
    """Company matching preferences and criteria."""
    id: str = Field(default_factory=lambda: f"comp_{ObjectId()}")
    
    # Core preferences
    must_have_skills: List[str] = []
    nice_to_have_skills: List[str] = []
    culture_tags: List[str] = []
    timezone_range: Optional[str] = None  # e.g., "+02:00..+05:00"
    
    # Role criteria
    seniority_level: str = "any"  # junior, mid, senior, any
    remote_only: bool = False
    required_sectors: List[str] = []  # e.g., ["fintech", "edtech"]
    min_reputation_score: float = 0.0
    
    # Trust & Privacy
    trusted_ambassadors: List[str] = []  # mentor IDs with elevated trust
    blocked_candidates: List[str] = []  # candidate IDs to exclude
    require_identity_verified: bool = False
    
    # Diversity & Fairness
    diversity_targets: Optional[Dict[str, float]] = None  # protected_attr -> target %
    fairness_constraints: List[str] = []  # e.g., ["min_underrepresented_20"]
    
    # Operational
    match_frequency: str = "daily"  # realtime, daily, weekly
    feed_size: int = 20  # candidates per batch
    auto_invite_criteria: Optional[Dict[str, float]] = None  # auto-invite rules
    
    # Metadata
    feature_version: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }
