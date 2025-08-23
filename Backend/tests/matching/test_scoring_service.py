"""Tests for match scoring service."""
import pytest
from datetime import datetime, timedelta
from unittest.mock import Mock, AsyncMock

from app.models.matching.candidate_model import CandidateMatchProfile
from app.models.matching.company_model import CompanyMatchProfile
from app.schemas.matching.match_request_schema import RoleRequirements
from app.services.matching.scoring_service import ScoringService

@pytest.fixture
def scoring_service():
    """Create scoring service."""
    return ScoringService()

@pytest.fixture
def sample_candidate():
    """Create sample candidate."""
    return CandidateMatchProfile(
        id="cand_1",
        orbit="core",
        reputation_score=75.0,
        skills=["python", "django", "postgres", "redis"],
        sector_counts={"fintech": 2, "edtech": 1},
        timezone="+03:00",
        leadership_score=0.7,
        soft_skill_score=0.8,
        feature_version="v1",
        availability_status="open",
        remote_preference=True,
        activity_score=0.9,
        response_rate=0.95,
        growth_slope=0.15,
        mentor_endorsements=["mentor_1"],
        identity_verified=True,
        last_active=datetime.utcnow()
    )

@pytest.fixture
def sample_company():
    """Create sample company."""
    return CompanyMatchProfile(
        id="company_1",
        must_have_skills=["python", "postgres"],
        nice_to_have_skills=["django", "kubernetes"],
        culture_tags=["async", "documentation"],
        timezone_range="+02:00..+06:00",
        remote_only=True,
        required_sectors=["fintech"],
        min_reputation_score=70.0
    )

@pytest.fixture
def sample_role():
    """Create sample role."""
    return RoleRequirements(
        title="Backend Engineer",
        seniority="junior",
        must_have=["python", "postgres"],
        nice_to_have=["django", "kubernetes"],
        culture=["async"],
        sector="fintech"
    )

@pytest.fixture
def sample_features():
    """Create sample feature values."""
    return {
        "required_skill_overlap": 1.0,
        "preferred_skill_overlap": 0.5,
        "recent_tech_usage": 0.8,
        "avg_code_quality": 0.85,
        "recent_code_quality": 0.9,
        "sector_experience": 0.7,
        "sector_performance": 0.8,
        "role_sprints": 0.6,
        "avg_sprint_score": 0.75,
        "recent_sprint_score": 0.8,
        "completion_rate": 0.9,
        "sprint_frequency": 0.7,
        "learning_rate": 0.15,
        "recent_improvement": 0.2,
        "skill_acquisition": 0.3,
        "avg_team_score": 0.85,
        "recent_team_score": 0.9,
        "communication_score": 0.8
    }

@pytest.mark.asyncio
async def test_score_candidate(
    scoring_service,
    sample_candidate,
    sample_company,
    sample_role,
    sample_features
):
    """Test scoring an individual candidate."""
    # Execute
    score = await scoring_service.score_candidate(
        candidate=sample_candidate,
        features=sample_features,
        role=sample_role,
        company=sample_company
    )
    
    # Verify score components
    assert 0 <= score.technical_fit <= 1
    assert 0 <= score.role_fit <= 1
    assert 0 <= score.soft_skills <= 1
    assert 0 <= score.growth <= 1
    assert 0 <= score.availability <= 1
    assert 0 <= score.trust <= 1
    assert 0 <= score.final_score <= 1
    
    # Verify feature values stored
    assert score.feature_values == sample_features
    
    # Verify reasons generated
    assert len(score.ranking_reasons) > 0
    assert all(isinstance(r, str) for r in score.ranking_reasons)
    
    # Verify weights sum to 1
    weights = scoring_service.get_current_weights()
    assert sum(weights.values()) == pytest.approx(1.0)

@pytest.mark.asyncio
async def test_technical_fit_scoring(
    scoring_service,
    sample_candidate,
    sample_company,
    sample_role,
    sample_features
):
    """Test technical fit component scoring."""
    # Execute
    tech_fit = await scoring_service._compute_technical_fit(
        candidate=sample_candidate,
        role=sample_role,
        features=sample_features
    )
    
    # Verify score
    assert 0 <= tech_fit <= 1
    
    # Should be high due to skill match
    assert tech_fit > 0.7
    
    # Test with insufficient skills
    sample_candidate.skills = ["python"]  # Missing postgres
    low_tech_fit = await scoring_service._compute_technical_fit(
        candidate=sample_candidate,
        role=sample_role,
        features=sample_features
    )
    
    # Should be much lower
    assert low_tech_fit < tech_fit

@pytest.mark.asyncio
async def test_availability_scoring(
    scoring_service,
    sample_candidate,
    sample_company
):
    """Test availability component scoring."""
    # Execute with good match
    avail = await scoring_service._compute_availability(
        candidate=sample_candidate,
        company=sample_company
    )
    
    # Verify score
    assert 0 <= avail <= 1
    assert avail > 0.8  # Should be high due to good match
    
    # Test timezone mismatch
    sample_company.timezone_range = "+08:00..+12:00"
    low_avail = await scoring_service._compute_availability(
        candidate=sample_candidate,
        company=sample_company
    )
    
    # Should be lower
    assert low_avail < avail
    
    # Test unavailable status
    sample_candidate.availability_status = "busy"
    unavail = await scoring_service._compute_availability(
        candidate=sample_candidate,
        company=sample_company
    )
    
    # Should be zero
    assert unavail == 0

@pytest.mark.asyncio
async def test_trust_scoring(
    scoring_service,
    sample_candidate,
    sample_features
):
    """Test trust score computation."""
    # Execute with verified profile
    trust = await scoring_service._compute_trust_score(
        candidate=sample_candidate,
        features=sample_features
    )
    
    # Verify base score
    assert trust > 0.5
    
    # Test unverified
    sample_candidate.identity_verified = False
    sample_candidate.mentor_endorsements = []
    low_trust = await scoring_service._compute_trust_score(
        candidate=sample_candidate,
        features=sample_features
    )
    
    # Should be lower
    assert low_trust < trust

@pytest.mark.asyncio
async def test_score_batch(
    scoring_service,
    sample_candidate,
    sample_company,
    sample_role,
    sample_features
):
    """Test batch scoring."""
    # Create two candidates
    candidates = [
        sample_candidate,
        CandidateMatchProfile(
            id="cand_2",
            orbit="core",
            reputation_score=82.0,
            skills=["python", "fastapi", "mongodb"],
            sector_counts={"edtech": 3},
            timezone="+05:00",
            leadership_score=0.6,
            soft_skill_score=0.9,
            feature_version="v1",
            availability_status="open",
            remote_preference=True
        )
    ]
    
    features = {
        "cand_1": sample_features,
        "cand_2": sample_features
    }
    
    # Execute
    scores = await scoring_service.score_batch(
        candidates=candidates,
        features=features,
        role=sample_role,
        company=sample_company
    )
    
    # Verify
    assert len(scores) == 2
    assert all(0 <= s.final_score <= 1 for s in scores)
    
    # First candidate should score higher (better skill match)
    assert scores[0].final_score > scores[1].final_score
