"""Tests for matching service."""
import pytest
from datetime import datetime, timedelta
from unittest.mock import Mock, AsyncMock, patch
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.matching.candidate_model import CandidateMatchProfile
from app.models.matching.company_model import CompanyMatchProfile
from app.models.matching.recommendation_model import MatchScore
from app.schemas.matching.match_request_schema import (
    MatchRequest,
    RoleRequirements,
    MatchFilters
)
from app.services.matching.matching_service import MatchingService
from app.services.matching.feature_service import FeatureService
from app.services.matching.scoring_service import ScoringService
from app.services.matching.fairness_service import FairnessService
from app.services.matching.privacy_service import PrivacyService

@pytest.fixture
def mock_db():
    """Create mock database."""
    return Mock(spec=AsyncIOMotorDatabase)

@pytest.fixture
def mock_feature_service():
    """Create mock feature service."""
    service = Mock(spec=FeatureService)
    service.compute_batch = AsyncMock()
    return service

@pytest.fixture
def mock_scoring_service():
    """Create mock scoring service."""
    service = Mock(spec=ScoringService)
    service.score_batch = AsyncMock()
    service.get_current_weights = Mock(return_value={
        "technical_fit": 0.4,
        "role_fit": 0.15,
        "soft_skills": 0.15,
        "growth": 0.1,
        "availability": 0.1,
        "trust": 0.1
    })
    return service

@pytest.fixture
def mock_fairness_service():
    """Create mock fairness service."""
    service = Mock(spec=FairnessService)
    service.apply_constraints = AsyncMock()
    return service

@pytest.fixture
def mock_privacy_service():
    """Create mock privacy service."""
    service = Mock(spec=PrivacyService)
    service.get_anonymous_handle = AsyncMock(return_value="anon_X9")
    service.can_reveal_details = AsyncMock(return_value=False)
    return service

@pytest.fixture
def matching_service(
    mock_db,
    mock_feature_service,
    mock_scoring_service,
    mock_fairness_service,
    mock_privacy_service
):
    """Create matching service with mocks."""
    return MatchingService(
        db=mock_db,
        feature_service=mock_feature_service,
        scoring_service=mock_scoring_service,
        fairness_service=mock_fairness_service,
        privacy_service=mock_privacy_service
    )

@pytest.fixture
def sample_candidates():
    """Create sample candidate data."""
    return [
        CandidateMatchProfile(
            id="cand_1",
            orbit="core",
            reputation_score=75.0,
            skills=["python", "django", "postgres"],
            sector_counts={"fintech": 2},
            timezone="+03:00",
            leadership_score=0.7,
            soft_skill_score=0.8,
            feature_version="v1"
        ),
        CandidateMatchProfile(
            id="cand_2",
            orbit="core",
            reputation_score=82.0,
            skills=["python", "fastapi", "mongodb"],
            sector_counts={"edtech": 3},
            timezone="+05:00",
            leadership_score=0.6,
            soft_skill_score=0.9,
            feature_version="v1"
        )
    ]

@pytest.fixture
def sample_match_request():
    """Create sample match request."""
    return MatchRequest(
        company_id="company_1",
        role=RoleRequirements(
            title="Backend Engineer",
            seniority="junior",
            must_have=["python", "postgres"],
            nice_to_have=["django", "fastapi"],
            culture=["async"],
            sector="fintech"
        ),
        filters=MatchFilters(
            timezone_overlap="+02:00..+06:00",
            remote=True,
            min_reputation=70.0,
            max_candidates=10
        ),
        request_id="req_1",
        created_at=datetime.utcnow()
    )

@pytest.mark.asyncio
async def test_get_candidate_pool(
    matching_service,
    mock_db,
    sample_candidates,
    sample_match_request
):
    """Test getting initial candidate pool."""
    # Setup
    mock_db.candidates.find.return_value.to_list = AsyncMock(
        return_value=[c.dict() for c in sample_candidates]
    )
    
    # Execute
    candidates = await matching_service.get_candidate_pool(sample_match_request)
    
    # Verify
    assert len(candidates) == 2
    assert all(isinstance(c, CandidateMatchProfile) for c in candidates)
    assert candidates[0].id == "cand_1"
    assert candidates[1].id == "cand_2"
    
    # Verify query
    mock_db.candidates.find.assert_called_once()
    args = mock_db.candidates.find.call_args[0][0]
    assert args["availability_status"] == "open"
    assert args["anonymized_view"] == True
    assert "python" in args["skills"]["$all"]
    assert "postgres" in args["skills"]["$all"]
    assert args["reputation_score"]["$gte"] == 70.0

@pytest.mark.asyncio
async def test_match_candidates(
    matching_service,
    mock_db,
    mock_feature_service,
    mock_scoring_service,
    mock_fairness_service,
    sample_candidates,
    sample_match_request
):
    """Test end-to-end matching process."""
    # Setup
    mock_db.candidates.find.return_value.to_list = AsyncMock(
        return_value=[c.dict() for c in sample_candidates]
    )
    
    mock_db.companies.find_one = AsyncMock(return_value={
        "_id": "company_1",
        "name": "Test Company",
        "culture_tags": ["async"],
        "trusted_ambassadors": []
    })
    
    features = {
        "cand_1": {
            "technical_fit": 0.85,
            "role_fit": 0.75,
            "soft_skills": 0.8,
            "growth": 0.7,
            "availability": 0.9,
            "trust": 0.8
        },
        "cand_2": {
            "technical_fit": 0.8,
            "role_fit": 0.7,
            "soft_skills": 0.9,
            "growth": 0.8,
            "availability": 0.85,
            "trust": 0.75
        }
    }
    mock_feature_service.compute_batch.return_value = features
    
    scores = [
        MatchScore(
            technical_fit=0.85,
            role_fit=0.75,
            soft_skills=0.8,
            growth=0.7,
            availability=0.9,
            trust=0.8,
            final_score=0.82,
            ranking_reasons=["Strong technical match", "Good availability"]
        ),
        MatchScore(
            technical_fit=0.8,
            role_fit=0.7,
            soft_skills=0.9,
            growth=0.8,
            availability=0.85,
            trust=0.75,
            final_score=0.80,
            ranking_reasons=["Strong soft skills", "Growth potential"]
        )
    ]
    mock_scoring_service.score_batch.return_value = scores
    mock_fairness_service.apply_constraints.return_value = scores
    
    # Execute
    results = await matching_service.match_candidates(sample_match_request)
    
    # Verify
    assert len(results) == 2
    assert results[0].score == 0.82
    assert results[1].score == 0.80
    
    # Verify service calls
    mock_feature_service.compute_batch.assert_called_once()
    mock_scoring_service.score_batch.assert_called_once()
    mock_fairness_service.apply_constraints.assert_called_once()
    
    # Verify recommendations saved
    assert mock_db.recommendations.insert_one.call_count == 2
    
    # Verify audit logs created
    assert mock_db.match_audit.insert_one.call_count == 2

@pytest.mark.asyncio
async def test_process_match_event(
    matching_service,
    mock_db
):
    """Test processing match events."""
    # Setup
    rec_id = "rec_1"
    mock_db.recommendations.find_one.return_value = {
        "_id": rec_id,
        "company_id": "company_1",
        "candidate_id": "cand_1",
        "status": "pending"
    }
    
    # Execute
    await matching_service.process_match_event(
        recommendation_id=rec_id,
        event_type="invite",
        event_data={"feedback": "Good fit"}
    )
    
    # Verify event created
    mock_db.match_events.insert_one.assert_called_once()
    event = mock_db.match_events.insert_one.call_args[0][0]
    assert event["recommendation_id"] == rec_id
    assert event["event_type"] == "invite"
    assert event["invited_at"] is not None
    
    # Verify recommendation updated
    mock_db.recommendations.update_one.assert_called_once()
    update = mock_db.recommendations.update_one.call_args[0][1]
    assert update["$set"]["status"] == "invite"
    assert update["$set"]["company_feedback"] == "Good fit"
