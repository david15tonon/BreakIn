#!/usr/bin/env python3
"""Database initialization and seeding script.

Creates required indexes and optionally seeds sample data for development.
"""

import os
import sys
from pathlib import Path
import logging
from typing import List, Dict, Any

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from app.config import get_database, connect_to_mongodb
from app.logging_config import configure_logging

logger = logging.getLogger(__name__)


def create_indexes() -> None:
    """Create all required database indexes."""
    db = get_database()

    # Users collection
    logger.info("Creating user indexes...")
    db.users.create_index("email", unique=True)
    db.users.create_index("pseudonym", unique=True)
    
    # Sprints collection
    logger.info("Creating sprint indexes...")
    db.sprints.create_index([
        ("status", 1),
        ("created_at", -1)
    ])
    db.sprints.create_index("user_id")
    
    # Submissions collection
    logger.info("Creating submission indexes...")
    db.submissions.create_index([
        ("sprint_id", 1),
        ("user_pseudonym", 1)
    ])
    
    # Feedback collection
    logger.info("Creating feedback indexes...")
    db.feedback.create_index([
        ("sprint_id", 1),
        ("reviewer_pseudonym", 1)
    ])
    
    # Scores collection
    logger.info("Creating score indexes...")
    db.scores.create_index([
        ("user_pseudonym", 1),
        ("sprint_id", 1)
    ], unique=True)


def seed_sample_data() -> None:
    """Insert sample data for development/testing."""
    if os.getenv("ENVIRONMENT") == "production":
        logger.warning("Refusing to seed sample data in production!")
        return

    db = get_database()
    
    # Sample users
    users: List[Dict[str, Any]] = [
        {
            "email": "mentor@example.com",
            "pseudonym": "senior-dragon",
            "role": "mentor",
            "reveal_eligible": True
        },
        {
            "email": "junior@example.com", 
            "pseudonym": "eager-beaver",
            "role": "developer",
            "reveal_eligible": False
        }
    ]
    
    try:
        logger.info("Inserting sample users...")
        db.users.insert_many(users)
    except Exception as e:
        logger.error("Failed to insert users: %s", e)

    # Sample sprint
    sprint = {
        "theme": "Build a REST API",
        "status": "active",
        "host_pseudonym": "senior-dragon",
        "participants": ["eager-beaver"],
        "created_at": "2025-08-22T00:00:00Z"
    }
    
    try:
        logger.info("Inserting sample sprint...")
        db.sprints.insert_one(sprint)
    except Exception as e:
        logger.error("Failed to insert sprint: %s", e)


def main():
    """Main entry point."""
    configure_logging()
    
    if not connect_to_mongodb():
        logger.error("Failed to connect to MongoDB")
        sys.exit(1)
        
    try:
        create_indexes()
        if os.getenv("SEED_DATA"):
            seed_sample_data()
        logger.info("Database initialization complete")
    except Exception as e:
        logger.exception("Database initialization failed: %s", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
