"""Test cases for review functionality."""

import pytest
from datetime import datetime, timedelta
from unittest.mock import Mock, patch
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.auth import User
from app.models.feedback.models import Review, Reviewer, Rubric
from app.services.feedback.review_service import ReviewService
from app.utils.feedback import scoring_utils

# Test data
SAMPLE_USER = User(
    id="user_1",
    email="test@example.com",
    is_mentor=True,
    is_admin=False
)

SAMPLE_RUBRIC = Rubric(
    id="rub_1",
    name="Test Rubric",
    version=1,
    description="Test rubric",
    components=[
        {
            "key": "code_quality",
            "label": "Code Quality",
            "max_score": 10,
            "weight": 0.4
        },
        {
            "key": "design",
            "label": "Design",
            "max_score": 10,
            "weight": 0.3
        },
        {
            "key": "testing",
            "label": "Testing",
            "max_score": 10,
            "weight": 0.3
        }
    ],
    active=True,
    created_by="admin_1",
    created_at=datetime.utcnow()
)

SAMPLE_REVIEW = Review(
    id="rev_1",
    submission_id="sub_1",
    reviewer_id="user_1",
    scores={
        "code_quality": 8.5,
        "design": 9.0,
        "testing": 7.5
    },
    weights_used={
        "code_quality": 0.4,
        "design": 0.3,
        "testing": 0.3
    },
    normalized_score=85.0,
    comments="Good work overall",
    status="draft",
    created_at=datetime.utcnow()
)

@pytest.fixture
def mock_db():
    """Create a mock database."""
    return Mock(spec=AsyncIOMotorDatabase)

@pytest.fixture
def review_service(mock_db):
    """Create a review service with mock db."""
    return ReviewService(mock_db)

@pytest.mark.asyncio
async def test_create_review_success(review_service, mock_db):
    """Test successful review creation."""
    # Setup
    mock_db.reviews.find_one.return_value = None
    mock_db.rubrics.find_one.return_value = SAMPLE_RUBRIC.dict()
    mock_db.reviews.insert_one.return_value.inserted_id = "rev_1"
    
    # Execute
    result = await review_service.create_review(
        submission_id="sub_1",
        reviewer_id="user_1",
        scores={
            "code_quality": 8.5,
            "design": 9.0,
            "testing": 7.5
        },
        comments="Good work overall",
        draft=True
    )
    
    # Verify
    assert result.id == "rev_1"
    assert result.submission_id == "sub_1"
    assert result.reviewer_id == "user_1"
    assert result.status == "draft"
    assert not result.locked_at
    
    # Verify DB calls
    mock_db.reviews.find_one.assert_called_once()
    mock_db.rubrics.find_one.assert_called_once()
    mock_db.reviews.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_create_review_duplicate(review_service, mock_db):
    """Test review creation with existing review."""
    # Setup
    mock_db.reviews.find_one.return_value = SAMPLE_REVIEW.dict()
    
    # Execute & Verify
    with pytest.raises(HTTPException) as exc:
        await review_service.create_review(
            submission_id="sub_1",
            reviewer_id="user_1",
            scores={
                "code_quality": 8.5,
                "design": 9.0,
                "testing": 7.5
            },
            comments="Good work overall",
            draft=True
        )
        
    assert exc.value.status_code == 400
    assert "already exists" in str(exc.value.detail)

@pytest.mark.asyncio
async def test_create_review_invalid_scores(review_service, mock_db):
    """Test review creation with invalid scores."""
    # Setup
    mock_db.reviews.find_one.return_value = None
    mock_db.rubrics.find_one.return_value = SAMPLE_RUBRIC.dict()
    
    # Execute & Verify - Missing component
    with pytest.raises(HTTPException) as exc:
        await review_service.create_review(
            submission_id="sub_1",
            reviewer_id="user_1",
            scores={
                "code_quality": 8.5,
                "design": 9.0
                # Missing testing
            },
            comments="Good work overall",
            draft=True
        )
        
    assert exc.value.status_code == 400
    assert "Missing required" in str(exc.value.detail)
    
    # Execute & Verify - Invalid score range
    with pytest.raises(HTTPException) as exc:
        await review_service.create_review(
            submission_id="sub_1",
            reviewer_id="user_1",
            scores={
                "code_quality": 11.0,  # Over max
                "design": 9.0,
                "testing": 7.5
            },
            comments="Good work overall",
            draft=True
        )
        
    assert exc.value.status_code == 400
    assert "Invalid score" in str(exc.value.detail)

@pytest.mark.asyncio
async def test_update_review_success(review_service, mock_db):
    """Test successful review update."""
    # Setup
    mock_db.reviews.find_one.return_value = SAMPLE_REVIEW.dict()
    mock_db.rubrics.find_one.return_value = SAMPLE_RUBRIC.dict()
    
    updates = {
        "scores": {
            "code_quality": 9.0,
            "design": 9.5,
            "testing": 8.0
        },
        "comments": "Updated comments"
    }
    
    # Execute
    result = await review_service.update_review(
        review_id="rev_1",
        reviewer_id="user_1",
        updates=updates
    )
    
    # Verify
    assert result.scores == updates["scores"]
    assert result.comments == updates["comments"]
    assert result.status == "draft"
    
    # Verify DB calls
    mock_db.reviews.find_one.assert_called_once()
    mock_db.reviews.replace_one.assert_called_once()

@pytest.mark.asyncio
async def test_update_review_locked(review_service, mock_db):
    """Test updating a locked review."""
    # Setup
    locked_review = SAMPLE_REVIEW.dict()
    locked_review["locked_at"] = datetime.utcnow()
    mock_db.reviews.find_one.return_value = locked_review
    
    # Execute & Verify
    with pytest.raises(HTTPException) as exc:
        await review_service.update_review(
            review_id="rev_1",
            reviewer_id="user_1",
            updates={"comments": "New comment"}
        )
        
    assert exc.value.status_code == 400
    assert "locked" in str(exc.value.detail)

@pytest.mark.asyncio
async def test_finalize_review_success(review_service, mock_db):
    """Test successful review finalization."""
    # Setup
    mock_db.reviews.find_one.return_value = SAMPLE_REVIEW.dict()
    
    # Execute
    result = await review_service.finalize_review(
        review_id="rev_1",
        reviewer_id="user_1"
    )
    
    # Verify
    assert result.status == "finalized"
    assert result.locked_at is not None
    
    # Verify DB calls
    mock_db.reviews.find_one.assert_called_once()
    mock_db.reviews.replace_one.assert_called_once()
    mock_db.review_audit.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_get_review_with_audit(review_service, mock_db):
    """Test getting review with audit history."""
    # Setup
    mock_db.reviews.find_one.return_value = SAMPLE_REVIEW.dict()
    mock_db.review_audit.find.return_value.to_list.return_value = [
        {
            "review_id": "rev_1",
            "action": "create",
            "actor_id": "user_1",
            "timestamp": datetime.utcnow()
        }
    ]
    
    # Execute
    result = await review_service.get_review(
        review_id="rev_1",
        include_audit=True
    )
    
    # Verify
    assert "review" in result
    assert "audit" in result
    assert len(result["audit"]) == 1
    
    # Verify DB calls
    mock_db.reviews.find_one.assert_called_once()
    mock_db.review_audit.find.assert_called_once()
