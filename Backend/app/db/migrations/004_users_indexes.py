"""MongoDB migration for user-related indexes."""
from motor.motor_asyncio import AsyncIOMotorDatabase

async def create_users_indexes(db: AsyncIOMotorDatabase):
    """Create indexes for user collections."""
    
    # Users collection indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("handle", unique=True)
    await db.users.create_index([
        ("full_name", "text"),
        ("handle", "text")
    ])
    await db.users.create_index("created_at")
    await db.users.create_index("is_active")
    await db.users.create_index("roles")
    
    # Profiles collection indexes
    await db.profiles.create_index("user_id", unique=True)
    await db.profiles.create_index([
        ("bio", "text"),
        ("tagline", "text"),
        ("location", "text")
    ])
    await db.profiles.create_index("visibility")
    await db.profiles.create_index("completion_score")
    
    # Skills collection indexes
    await db.skills.create_index([("user_id", 1), ("name", 1)], unique=True)
    await db.skills.create_index("name")
    await db.skills.create_index([
        ("name", "text"),
        ("category", "text"),
        ("tags", "text")
    ])
    await db.skills.create_index("endorsement_count")
    await db.skills.create_index("proficiency_level")
    
    # Endorsements collection indexes
    await db.endorsements.create_index([
        ("skill_id", 1),
        ("endorser_id", 1),
        ("endorsee_id", 1)
    ], unique=True)
    await db.endorsements.create_index("created_at")
    
    print("Created user-related indexes successfully")
