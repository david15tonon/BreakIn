from typing import Generator

from app.config import get_database, settings


def get_db() -> Generator:
    """FastAPI dependency that yields a MongoDB database instance."""
    db = get_database()
    try:
        yield db
    finally:
        # For pymongo we don't close per-request; keep connection pooling
        pass


def get_settings():
    """Return application settings (pydantic Settings instance)."""
    return settings
