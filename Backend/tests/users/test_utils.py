"""Test cases for user utility functions."""
import pytest
from app.utils.users.normalizers import (
    normalize_skill_name,
    normalize_url,
    generate_handle,
    validate_handle,
    normalize_location
)
from app.utils.users.privacy import (
    redact_sensitive_fields,
    apply_privacy_settings,
    filter_by_visibility
)
from app.utils.users.validators import (
    validate_url,
    validate_social_links,
    validate_media_item
)

def test_normalize_skill_name():
    """Test skill name normalization."""
    assert normalize_skill_name("javascript") == "JavaScript"
    assert normalize_skill_name("nodejs") == "Node.js"
    assert normalize_skill_name("Python") == "Python"
    assert normalize_skill_name(" java ") == "java"

def test_normalize_url():
    """Test URL normalization."""
    assert normalize_url("github.com") == "https://github.com"
    assert normalize_url("https://github.com") == "https://github.com"
    assert normalize_url("invalid-url") is None

def test_generate_handle():
    """Test handle generation."""
    existing = {"johndoe", "janedoe"}
    assert generate_handle("John Doe", existing) == "johndoe1"
    assert generate_handle("New User", existing) == "new-user"
    assert generate_handle("Test User", set()) == "test-user"

def test_validate_handle():
    """Test handle validation."""
    assert validate_handle("valid-handle") is True
    assert validate_handle("valid_handle") is True
    assert validate_handle("inv@lid") is False
    assert validate_handle("a") is False  # Too short
    assert validate_handle("a" * 31) is False  # Too long

def test_normalize_location():
    """Test location normalization."""
    assert normalize_location("nyc") == "New York City"
    assert normalize_location("SF") == "San Francisco"
    assert normalize_location(" London, UK ") == "London, UK"

def test_redact_sensitive_fields():
    """Test sensitive field redaction."""
    data = {
        "id": "123",
        "name": "Test",
        "hashed_password": "secret",
        "failed_login_attempts": 0
    }
    clean = redact_sensitive_fields(data)
    assert "hashed_password" not in clean
    assert "failed_login_attempts" not in clean
    assert clean["name"] == "Test"

def test_apply_privacy_settings():
    """Test privacy settings application."""
    data = {
        "name": "Test",
        "email": "test@example.com",
        "location": "Test City"
    }
    settings = {
        "display_email": False,
        "display_location": True
    }
    filtered = apply_privacy_settings(data, settings)
    assert "email" not in filtered
    assert "location" in filtered

def test_filter_by_visibility():
    """Test visibility filtering."""
    data = {
        "id": "123",
        "name": "Test",
        "bio": "Test bio",
        "user_id": "456"
    }
    
    # Public visibility
    assert filter_by_visibility(data, "public") == data
    
    # Private visibility
    private = filter_by_visibility(data, "private", viewer_id="789")
    assert len(private) == 2
    assert "bio" not in private
    
    # Owner viewing
    owner = filter_by_visibility(data, "private", viewer_id="456")
    assert owner == data

def test_validate_url():
    """Test URL validation."""
    assert validate_url("https://example.com") == "https://example.com"
    with pytest.raises(ValueError):
        validate_url("invalid-url")
    assert validate_url(None) is None

def test_validate_social_links():
    """Test social links validation."""
    valid_links = [{
        "platform": "github",
        "url": "https://github.com/testuser"
    }]
    assert validate_social_links(valid_links) == valid_links
    
    invalid_links = [{
        "platform": "invalid",
        "url": "https://example.com"
    }]
    with pytest.raises(ValueError):
        validate_social_links(invalid_links)

def test_validate_media_item():
    """Test media item validation."""
    valid_item = {
        "url": "https://example.com/image.jpg",
        "type": "image"
    }
    assert validate_media_item(valid_item) == valid_item
    
    invalid_item = {
        "url": "https://example.com/image.jpg",
        "type": "invalid"
    }
    with pytest.raises(ValueError):
        validate_media_item(invalid_item)
