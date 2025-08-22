"""Schemas for company preferences and profiles."""
from typing import Dict, List, Optional
from pydantic import BaseModel

class CultureTag(BaseModel):
    """A culture/value tag with description."""
    name: str
    description: str
    category: str  # workflow, values, environment
    weight: float = 1.0

class CompanyPreferences(BaseModel):
    """Company matching preferences."""
    timezone_range: Optional[str] = None
    remote_policy: str = "remote_only"  # remote_only, hybrid, onsite
    preferred_sectors: List[str] = []
    culture_tags: List[CultureTag] = []
    min_reputation: Optional[float] = None
    diversity_targets: Optional[Dict[str, float]] = None
    auto_invite_threshold: Optional[float] = None

class CompanyMatchSettings(BaseModel):
    """Company-specific match settings."""
    preferences: CompanyPreferences
    trusted_ambassadors: List[str] = []
    blocked_candidates: List[str] = []
    fairness_rules: List[str] = []
    match_frequency: str = "daily"
    feed_size: int = 20
