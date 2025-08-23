"""MongoDB indexes for sprints module."""
from motor.motor_asyncio import AsyncIOMotorDatabase

async def create_sprints_indexes(db: AsyncIOMotorDatabase):
    """Create indexes for sprints collections."""
    
    # Sprints collection indexes
    await db.sprints.create_index([
        ("state", 1),
        ("start_at", 1)
    ])
    await db.sprints.create_index("owner_id")
    await db.sprints.create_index([
        ("sector_tags", 1),
        ("difficulty_level", 1)
    ])
    await db.sprints.create_index("template_id")
    
    # Submissions collection indexes
    await db.submissions.create_index([
        ("sprint_id", 1),
        ("squad_id", 1),
        ("status", 1)
    ])
    await db.submissions.create_index([
        ("sprint_id", 1),
        ("created_at", -1)
    ])
    await db.submissions.create_index("author_anon_ids")
    
    # Submission reviews collection indexes
    await db.submission_reviews.create_index([
        ("submission_id", 1),
        ("reviewer_id", 1)
    ], unique=True)
    await db.submission_reviews.create_index([
        ("reviewer_id", 1),
        ("status", 1)
    ])
    await db.submission_reviews.create_index("completed_at")
    
    # Squads collection indexes
    await db.squads.create_index([
        ("sprint_id", 1),
        ("state", 1)
    ])
    await db.squads.create_index([
        ("members.user_id", 1),
        ("sprint_id", 1)
    ])
    await db.squads.create_index([
        ("members.anon_id", 1),
        ("sprint_id", 1)
    ], unique=True)
    
    # Sprint templates collection indexes
    await db.sprint_templates.create_index("sector_tags")
    await db.sprint_templates.create_index([
        ("difficulty_level", 1),
        ("sector_tags", 1)
    ])
    
    # Sprint events collection indexes
    await db.sprint_events.create_index([
        ("sprint_id", 1),
        ("timestamp", -1)
    ])
    await db.sprint_events.create_index([
        ("squad_id", 1),
        ("timestamp", -1)
    ])
    
    # Leaderboards collection indexes
    await db.leaderboards.create_index([
        ("sprint_id", 1),
        ("score", -1)
    ])
    await db.leaderboards.create_index([
        ("user_id", 1),
        ("sprint_id", 1)
    ], unique=True)
    
    print("Created sprint-related indexes successfully")
