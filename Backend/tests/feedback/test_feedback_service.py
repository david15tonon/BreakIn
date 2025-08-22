"""Test cases for feedback and appeals functionality."""

import pytest
from datetime import datetime
from unittest.mock import Mock, patch
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.auth import User
from app.models.feedback.models import (
    FeedbackThread,
    Appeal,
    ReviewAudit
)
from app.services.feedback.feedback_service import FeedbackService

# Test data
SAMPLE_USER = User(
    id="user_1",
    email="test@example.com",
    is_mentor=True,
    is_admin=False
)

SAMPLE_THREAD = FeedbackThread(
    id="thread_1",
    submission_id="sub_1",
    messages=[
        {
            "author_id": "user_1",
            "content": "Initial feedback",
            "timestamp": datetime.utcnow()
        }
    ],
    status="open",
    created_at=datetime.utcnow()
)

SAMPLE_APPEAL = Appeal(
    id="appeal_1",
    submission_id="sub_1",
    review_id="rev_1",
    author_id="user_1",
    reason="Score seems incorrect",
    evidence="Previous similar submissions scored higher",
    status="pending",
    created_at=datetime.utcnow()
)

@pytest.fixture
def mock_db():
    """Create a mock database."""
    return Mock(spec=AsyncIOMotorDatabase)

@pytest.fixture
def feedback_service(mock_db):
    """Create a feedback service with mock db."""
    return FeedbackService(mock_db)

@pytest.mark.asyncio
async def test_create_thread_success(feedback_service, mock_db):
    """Test successful thread creation."""
    # Setup
    mock_db.feedback_threads.insert_one.return_value.inserted_id = "thread_1"
    
    # Execute
    result = await feedback_service.create_thread(
        submission_id="sub_1",
        author_id="user_1",
        initial_message="Initial feedback"
    )
    
    # Verify
    assert result.id == "thread_1"
    assert result.submission_id == "sub_1"
    assert len(result.messages) == 1
    assert result.messages[0]["author_id"] == "user_1"
    assert result.status == "open"
    
    # Verify DB calls
    mock_db.feedback_threads.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_add_message_success(feedback_service, mock_db):
    """Test successfully adding message to thread."""
    # Setup
    mock_db.feedback_threads.find_one.return_value = SAMPLE_THREAD.dict()
    
    # Execute
    result = await feedback_service.add_message(
        thread_id="thread_1",
        author_id="user_2",
        content="Follow-up feedback"
    )
    
    # Verify
    assert len(result.messages) == 2
    assert result.messages[-1]["author_id"] == "user_2"
    assert result.messages[-1]["content"] == "Follow-up feedback"
    
    # Verify DB calls
    mock_db.feedback_threads.find_one.assert_called_once()
    mock_db.feedback_threads.replace_one.assert_called_once()

@pytest.mark.asyncio
async def test_add_message_closed_thread(feedback_service, mock_db):
    """Test adding message to closed thread."""
    # Setup
    closed_thread = SAMPLE_THREAD.dict()
    closed_thread["status"] = "closed"
    mock_db.feedback_threads.find_one.return_value = closed_thread
    
    # Execute & Verify
    with pytest.raises(HTTPException) as exc:
        await feedback_service.add_message(
            thread_id="thread_1",
            author_id="user_2",
            content="Follow-up feedback"
        )
        
    assert exc.value.status_code == 400
    assert "closed" in str(exc.value.detail)

@pytest.mark.asyncio
async def test_close_thread_success(feedback_service, mock_db):
    """Test successfully closing thread."""
    # Setup
    mock_db.feedback_threads.find_one.return_value = SAMPLE_THREAD.dict()
    
    # Execute
    result = await feedback_service.close_thread(
        thread_id="thread_1",
        actor_id="admin_1"
    )
    
    # Verify
    assert result.status == "closed"
    assert len(result.messages) == 2  # Original + system message
    assert result.messages[-1]["author_id"] == "system"
    
    # Verify DB calls
    mock_db.feedback_threads.find_one.assert_called_once()
    mock_db.feedback_threads.replace_one.assert_called_once()

@pytest.mark.asyncio
async def test_create_appeal_success(feedback_service, mock_db):
    """Test successful appeal creation."""
    # Setup
    mock_db.appeals.find_one.return_value = None
    mock_db.appeals.insert_one.return_value.inserted_id = "appeal_1"
    
    # Execute
    result = await feedback_service.create_appeal(
        submission_id="sub_1",
        review_id="rev_1",
        author_id="user_1",
        reason="Score seems incorrect",
        evidence="Previous similar submissions scored higher"
    )
    
    # Verify
    assert result.id == "appeal_1"
    assert result.submission_id == "sub_1"
    assert result.review_id == "rev_1"
    assert result.status == "pending"
    
    # Verify DB calls
    mock_db.appeals.find_one.assert_called_once()
    mock_db.appeals.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_create_appeal_duplicate(feedback_service, mock_db):
    """Test creating duplicate appeal."""
    # Setup
    mock_db.appeals.find_one.return_value = SAMPLE_APPEAL.dict()
    
    # Execute & Verify
    with pytest.raises(HTTPException) as exc:
        await feedback_service.create_appeal(
            submission_id="sub_1",
            review_id="rev_1",
            author_id="user_1",
            reason="Another appeal",
            evidence="More evidence"
        )
        
    assert exc.value.status_code == 400
    assert "already exists" in str(exc.value.detail)

@pytest.mark.asyncio
async def test_process_appeal_success(feedback_service, mock_db):
    """Test successful appeal processing."""
    # Setup
    mock_db.appeals.find_one.return_value = SAMPLE_APPEAL.dict()
    
    # Execute
    result = await feedback_service.process_appeal(
        appeal_id="appeal_1",
        admin_id="admin_1",
        decision="accepted",
        notes="Valid concerns raised"
    )
    
    # Verify
    assert result.status == "accepted"
    assert result.admin_notes == "Valid concerns raised"
    
    # Verify DB calls
    mock_db.appeals.find_one.assert_called_once()
    mock_db.appeals.replace_one.assert_called_once()
    mock_db.review_audit.insert_one.assert_called_once()
    
    # If accepted, should mark review for re-evaluation
    mock_db.reviews.update_one.assert_called_once_with(
        {"_id": "rev_1"},
        {
            "$set": {
                "status": "under_review",
                "updated_at": pytest.approx(datetime.utcnow(), rel=1)
            }
        }
    )

@pytest.mark.asyncio
async def test_process_appeal_already_processed(feedback_service, mock_db):
    """Test processing already processed appeal."""
    # Setup
    processed_appeal = SAMPLE_APPEAL.dict()
    processed_appeal["status"] = "accepted"
    mock_db.appeals.find_one.return_value = processed_appeal
    
    # Execute & Verify
    with pytest.raises(HTTPException) as exc:
        await feedback_service.process_appeal(
            appeal_id="appeal_1",
            admin_id="admin_1",
            decision="rejected",
            notes="Changed mind"
        )
        
    assert exc.value.status_code == 400
    assert "already processed" in str(exc.value.detail)

@pytest.mark.asyncio
async def test_list_threads_with_filters(feedback_service, mock_db):
    """Test listing threads with filters."""
    # Setup
    mock_db.feedback_threads.find.return_value.sort.return_value.skip.return_value.limit.return_value.to_list.return_value = [
        SAMPLE_THREAD.dict()
    ]
    
    # Execute
    results = await feedback_service.list_threads(
        submission_id="sub_1",
        status="open",
        limit=10,
        skip=0
    )
    
    # Verify
    assert len(results) == 1
    assert results[0].id == "thread_1"
    
    # Verify DB query
    mock_db.feedback_threads.find.assert_called_once_with({
        "submission_id": "sub_1",
        "status": "open"
    })

@pytest.mark.asyncio
async def test_list_appeals_with_filters(feedback_service, mock_db):
    """Test listing appeals with filters."""
    # Setup
    mock_db.appeals.find.return_value.sort.return_value.skip.return_value.limit.return_value.to_list.return_value = [
        SAMPLE_APPEAL.dict()
    ]
    
    # Execute
    results = await feedback_service.list_appeals(
        submission_id="sub_1",
        status="pending",
        limit=10,
        skip=0
    )
    
    # Verify
    assert len(results) == 1
    assert results[0].id == "appeal_1"
    
    # Verify DB query
    mock_db.appeals.find.assert_called_once_with({
        "submission_id": "sub_1",
        "status": "pending"
    })
