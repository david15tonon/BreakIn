"""Models for match recommendations and results."""
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
from bson import ObjectId

class MatchScore(BaseModel):
    """Individual component scores for a match."""
    technical_fit: float  # 0-1 score for technical alignment
    role_fit: float  # role-specific score
    soft_skills: float  # collaboration & communication
    growth: float  # trajectory & potential
    availability: float  # logistics & timing
    trust: float  # reliability & verification
    final_score: float  # weighted combination
    
    # Raw feature values (for debugging/audit)
    feature_values: Dict[str, float] = {}
    
    # Explanations
    ranking_reasons: List[str] = []  # human-readable reasons
    adjustment_factors: Dict[str, float] = {}  # fairness adjustments

class Recommendation(BaseModel):
    """A match recommendation result."""
    id: str = Field(default_factory=lambda: f"rec_{ObjectId()}")
    request_id: str  # reference to original request
    company_id: str
    candidate_id: str
    role_id: Optional[str] = None
    
    # Scoring
    scores: MatchScore
    rank: int  # position in result set
    confidence: float  # model confidence
    
    # Status
    status: str = "pending"  # pending, viewed, invited, accepted, rejected
    company_feedback: Optional[str] = None
    candidate_feedback: Optional[str] = None
    
    # Privacy
    anonymized_handle: str  # e.g., "anon_X9"
    reveal_allowed: bool = False
    
    # Metadata
    model_version: str
    feature_version: str
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(days=7))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            ObjectId: str
        }
