"""MongoDB index creation for the feedback system collections."""

import logging
from typing import Dict
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

async def create_feedback_indexes(db: AsyncIOMotorDatabase) -> Dict[str, bool]:
    """Create all required indexes for the feedback system collections.
    
    Args:
        db: The database instance
        
    Returns:
        Dict mapping collection names to success status
    """
    results = {}
    
    try:
        # Reviews collection indexes
        reviews = db.reviews
        results['reviews'] = True
        await reviews.create_index([
            ("submission_id", 1),
            ("reviewer_id", 1)
        ], unique=True)
        await reviews.create_index([("status", 1), ("created_at", -1)])
        await reviews.create_index([("locked_at", 1)])
        
        # Reviewers collection indexes
        reviewers = db.reviewers
        results['reviewers'] = True
        await reviewers.create_index([("user_id", 1)], unique=True)
        await reviewers.create_index([("specialties", 1)])
        await reviewers.create_index([("reliability_score", -1)])
        await reviewers.create_index([("last_active", -1)])
        
        # Rubrics collection indexes
        rubrics = db.rubrics
        results['rubrics'] = True
        await rubrics.create_index([("name", 1), ("version", -1)])
        await rubrics.create_index([("active", 1)])
        
        # Feedback threads collection indexes
        feedback_threads = db.feedback_threads
        results['feedback_threads'] = True
        await feedback_threads.create_index([("submission_id", 1)])
        await feedback_threads.create_index([("status", 1)])
        
        # Appeals collection indexes
        appeals = db.appeals
        results['appeals'] = True
        await appeals.create_index([("submission_id", 1)])
        await appeals.create_index([("review_id", 1)])
        await appeals.create_index([("status", 1), ("created_at", -1)])
        
        # Review audit collection indexes
        review_audit = db.review_audit
        results['review_audit'] = True
        await review_audit.create_index([("review_id", 1)])
        await review_audit.create_index([("action", 1)])
        await review_audit.create_index([("timestamp", -1)])
        
        # Mentor activity collection indexes
        mentor_activity = db.mentor_activity
        results['mentor_activity'] = True
        await mentor_activity.create_index([
            ("mentor_id", 1),
            ("period", 1)
        ], unique=True)
        await mentor_activity.create_index([("quality_score", -1)])
        
        # Calibration sessions collection indexes
        calibration = db.calibration_sessions
        results['calibration_sessions'] = True
        await calibration.create_index([("mentor_id", 1)])
        await calibration.create_index([("status", 1)])
        await calibration.create_index([("created_at", -1)])
        
        # Review templates collection indexes
        templates = db.review_templates
        results['review_templates'] = True
        await templates.create_index([("category", 1)])
        await templates.create_index([("tags", 1)])
        
        logger.info("Successfully created all feedback system indexes")
        return results
        
    except Exception as e:
        logger.error(f"Error creating feedback indexes: {str(e)}")
        return results

async def create_feedback_collections(db: AsyncIOMotorDatabase) -> None:
    """Create all required collections for the feedback system."""
    collections = [
        'reviews',
        'reviewers',
        'rubrics',
        'feedback_threads',
        'appeals',
        'review_audit',
        'mentor_activity',
        'calibration_sessions',
        'review_templates'
    ]
    
    for collection in collections:
        if collection not in await db.list_collection_names():
            await db.create_collection(collection)
            logger.info(f"Created collection: {collection}")

async def run_migration(db: AsyncIOMotorDatabase) -> None:
    """Run the complete feedback system migration.
    
    This includes:
    1. Creating collections if they don't exist
    2. Creating all required indexes
    """
    logger.info("Starting feedback system migration")
    
    # Create collections
    await create_feedback_collections(db)
    
    # Create indexes
    results = await create_feedback_indexes(db)
    
    # Log results
    success = all(results.values())
    if success:
        logger.info("Feedback system migration completed successfully")
    else:
        failed = [k for k, v in results.items() if not v]
        logger.error(f"Feedback system migration failed for: {', '.join(failed)}")
