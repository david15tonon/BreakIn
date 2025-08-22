"""Schemas for role and match requests."""
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class RoleRequirements(BaseModel):
    """Requirements for a role to match against."""
    title: str
    seniority: str = "any"  # junior, mid, senior, any
    must_have: List[str]  # required skills
    nice_to_have: List[str] = []  # preferred skills
    culture: List[str] = []  # culture tags
    sector: Optional[str] = None  # target sector
    description: Optional[str] = None  # role description
    team_size: Optional[int] = None
    remote: bool = True

class MatchFilters(BaseModel):
    """Filters for matching candidates."""
    timezone_overlap: Optional[str] = None  # e.g., "+03:00..+09:00"
    remote: bool = True
    min_reputation: Optional[float] = None
    required_sectors: List[str] = []
    max_candidates: int = 20
    include_busy: bool = False
    require_verified: bool = False

class MatchRequest(BaseModel):
    """Request for matching candidates."""
    company_id: str
    role: RoleRequirements
    filters: Optional[MatchFilters] = None
    count: int = 20
    request_id: Optional[str] = None  # for idempotency
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CandidateScore(BaseModel):
    """Score and explanation for a candidate match."""
    anon_id: str
    score: float
    reasons: List[str]
    feature_scores: Optional[Dict[str, float]] = None
    rank: int
    reveal_allowed: bool = False

class MatchResponse(BaseModel):
    """Response containing match recommendations."""
    request_id: str
    results: List[CandidateScore]
    model_version: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    next_token: Optional[str] = None  # for pagination
