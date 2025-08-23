"""Test cases for user routes."""
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from datetime import datetime

from app.services.users.user_service import UserService
from app.schemas.users.user_schema import UserCreate, UserUpdate

@pytest.mark.asyncio
async def test_create_user():
    """Test user creation."""
    app = FastAPI()
    user_data = {
        "email": "test@example.com",
        "password": "Test123!@#",
        "full_name": "Test User",
        "handle": "testuser"
    }
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/users/", json=user_data)
        
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]
    assert "password" not in data

@pytest.mark.asyncio
async def test_get_user():
    """Test getting user details."""
    app = FastAPI()
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/users/testuser")
        
    assert response.status_code == 200
    data = response.json()
    assert data["handle"] == "testuser"

@pytest.mark.asyncio
async def test_update_user():
    """Test updating user details."""
    app = FastAPI()
    update_data = {
        "full_name": "Updated Name"
    }
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.patch("/users/testuser", json=update_data)
        
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == update_data["full_name"]

@pytest.mark.asyncio
async def test_delete_user():
    """Test user deletion."""
    app = FastAPI()
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.delete("/users/testuser")
        
    assert response.status_code == 204

@pytest.mark.asyncio
async def test_user_search():
    """Test user search."""
    app = FastAPI()
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/users/search?q=test")
        
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

@pytest.mark.asyncio
async def test_user_validation():
    """Test user data validation."""
    app = FastAPI()
    invalid_user = {
        "email": "invalid-email",
        "password": "short",
        "full_name": "",
        "handle": "a"
    }
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/users/", json=invalid_user)
        
    assert response.status_code == 422
