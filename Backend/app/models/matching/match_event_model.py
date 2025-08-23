"""Models for match events and audit logs."""
from typing import Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId

class MatchEvent(BaseModel):
    """Event tracking for match interactions."""
    id: str = Field(default_factory=lambda: f"evt_{ObjectId()}")
    recommendation_id: str
    company_id: str
    candidate_id: str
    
    # Event details
    event_type: str  # view, invite, accept, reject, hire
    event_data: Dict = {}  # additional context
    source: str  # ui, api, auto
    
    # Timestamps for funnel analysis
    viewed_at: Optional[datetime] = None
    invited_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None
    interview_at: Optional[datetime] = None
    hired_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

class MatchAudit(BaseModel):
    """Immutable audit log for match decisions."""
    id: str = Field(default_factory=lambda: f"audit_{ObjectId()}")
    recommendation_id: str
    company_id: str
    candidate_id: str
    request_id: str
    
    # Decision context
    scores: Dict[str, float]  # raw scores
    rank: int
    model_version: str
    feature_version: str
    weights_snapshot: Dict[str, float]
    fairness_adjustments: Dict[str, float]
    
    # Privacy
    encrypted_details: Optional[str] = None  # encrypted PII if needed
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    actor_id: str  # user/system making decision
    
    class Config:
        json_encoders = {
            ObjectId: str
        }
