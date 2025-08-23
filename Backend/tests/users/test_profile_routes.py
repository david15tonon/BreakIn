"""Test cases for profile routes."""
import pytest
from fastapi import FastAPI
from httpx import AsyncClient

from app.services.users.profile_service import ProfileService
from app.schemas.users.profile_schema import ProfileCreate, ProfileUpdate

@pytest.mark.asyncio
async def test_create_profile():
    """Test profile creation."""
    app = FastAPI()
    profile_data = {
        "bio": "Test bio",
        "tagline": "Test tagline",
        "location": "Test City",
        "company": "Test Company",
        "title": "Test Title",
        "years_of_experience": 5
    }
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/profiles/", json=profile_data)
        
    assert response.status_code == 201
    data = response.json()
    assert data["bio"] == profile_data["bio"]
    assert data["completion_score"] > 0

@pytest.mark.asyncio
async def test_get_profile():
    """Test getting profile details."""
    app = FastAPI()
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/profiles/testuser")
        
    assert response.status_code == 200
    data = response.json()
    assert "bio" in data
    assert "completion_score" in data

@pytest.mark.asyncio
async def test_update_profile():
    """Test updating profile details."""
    app = FastAPI()
    update_data = {
        "bio": "Updated bio",
        "tagline": "Updated tagline"
    }
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.patch("/profiles/testuser", json=update_data)
        
    assert response.status_code == 200
    data = response.json()
    assert data["bio"] == update_data["bio"]
    assert data["tagline"] == update_data["tagline"]

@pytest.mark.asyncio
async def test_add_social_link():
    """Test adding social media link."""
    app = FastAPI()
    link_data = {
        "platform": "github",
        "url": "https://github.com/testuser"
    }
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/profiles/testuser/social", json=link_data)
        
    assert response.status_code == 200
    data = response.json()
    assert any(
        link["platform"] == link_data["platform"]
        for link in data["social_links"]
    )

@pytest.mark.asyncio
async def test_update_avatar():
    """Test updating profile avatar."""
    app = FastAPI()
    files = {
        "avatar": ("test.jpg", open("tests/fixtures/test.jpg", "rb"))
    }
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.put("/profiles/testuser/avatar", files=files)
        
    assert response.status_code == 200
    data = response.json()
    assert "avatar_url" in data
