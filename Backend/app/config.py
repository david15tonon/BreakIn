def close_mongodb_connection():
"""Application configuration and helpers.

This module exposes a Settings object (pydantic BaseSettings) and connection helpers
for MongoDB. Other modules import `db` or call `get_database()` to obtain the
active database instance.
"""

from __future__ import annotations

import logging
from typing import List, Optional

from pydantic import BaseSettings, Field, AnyHttpUrl
from pymongo import MongoClient
from pymongo.database import Database

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


# Configuration MongoDB
MONGO_URI = os.getenv("MONGO_URI", "MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "breakin")

class Settings(BaseSettings):
    # Database
    MONGO_URI: str = Field("mongodb://localhost:27017", env="MONGO_URI")
    DB_NAME: str = Field("breakin", env="DB_NAME")

    # Security
    SECRET_KEY: str = Field("changeme", env="SECRET_KEY")
    JWT_EXPIRY_MINUTES: int = Field(60 * 24, env="JWT_EXPIRY_MINUTES")

    # Worker/queue
    REDIS_URI: Optional[str] = Field(default=None)
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = Field(default="redis://localhost:6379/0")

    # CORS
    ALLOWED_ORIGINS: List[AnyHttpUrl] = Field(default_factory=lambda: ["http://localhost:3000"])

    # Logging
    LOG_LEVEL: str = Field(default="INFO")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

# Exposed globals for backward compatibility
client: Optional[MongoClient] = None
db: Optional[Database] = None


def connect_to_mongodb() -> bool:
    """Initialize a MongoDB client and verify connectivity.

    Sets module-level `client` and `db` variables on success so other modules can
    import `from app.config import db`.
    """
    global client, db
    try:
        logger.info("Connecting to MongoDB: %s", settings.MONGO_URI)
        client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
        # quick ping
        client.admin.command("ping")
        db = client[settings.DB_NAME]
        logger.info("Connected to MongoDB database '%s'", settings.DB_NAME)
        return True
    except Exception as exc:  # pragma: no cover - environment dependent
        logger.exception("Failed to connect to MongoDB: %s", exc)
        client = None
        db = None
        return False


def get_database() -> Database:
    MONGO_URI = os.getenv("MONGO_URI", "MONGO_URI")
    DB_NAME = os.getenv("DB_NAME", "breakin")
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]
        
    """Return the active Database instance (connects lazily if needed)."""
    global client, db
    if db is None:
        connect_to_mongodb()
    if db is None:
        raise RuntimeError("MongoDB is not available")
    return db


def close_mongodb_connection() -> None:
    global client
    if client is not None:
        try:
            client.close()
            logger.info("Closed MongoDB connection")
        except Exception:
            logger.exception("Error while closing MongoDB connection")


