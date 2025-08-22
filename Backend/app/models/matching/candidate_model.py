"""Models for candidate matching data."""
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId

class CandidateMatchProfile(BaseModel):
    """Candidate profile data used for matching."""
    id: str = Field(default_factory=lambda: f"cand_{ObjectId()}")
    orbit: str  # core, experienced, etc.
    reputation_score: float
    skills: List[str] = []
    sector_counts: Dict[str, int] = {}  # sector -> sprint count
    last_active: datetime = Field(default_factory=datetime.utcnow)
    readiness_eta: Optional[datetime] = None
    timezone: str  # e.g., "+03:00"
    leadership_score: float = 0.0
    soft_skill_score: float = 0.0
    feature_version: str
    
    # Optional fields that affect matching
    availability_status: str = "open"  # open, busy, unavailable
    remote_preference: bool = True
    relocation_possible: bool = False
    visa_status: Optional[str] = None
    mentor_endorsements: List[str] = []  # mentor IDs
    ambassador_flags: List[str] = []  # company ambassador IDs
    culture_tags: List[str] = []
    identity_verified: bool = False
    
    # Derived signals (computed periodically)
    response_rate: float = 1.0  # messaging response rate
    avg_sprint_score: float = 0.0
    growth_slope: float = 0.0  # reputation growth rate
    activity_score: float = 1.0  # recent activity level
    
    # Privacy & Governance
    apply_as_junior: bool = False  # senior opting into junior pool
    anonymized_view: bool = True  # default to anonymous in matches
    blocked_companies: List[str] = []  # company IDs to exclude
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }
