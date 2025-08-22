"""MongoDB migration for skills-related indexes."""
from motor.motor_asyncio import AsyncIOMotorDatabase

async def create_skills_indexes(db: AsyncIOMotorDatabase):
    """Create indexes for skills collections."""
    
    # Skills-specific indexes
    await db.skills.create_index([
        ("name", 1),
        ("category", 1)
    ])
    await db.skills.create_index([
        ("name", "text"),
        ("category", "text")
    ])
    await db.skills.create_index("created_at")
    
    # Skill categories indexes
    await db.skill_categories.create_index("name", unique=True)
    await db.skill_categories.create_index([
        ("name", "text"),
        ("description", "text")
    ])
    
    # Skill aliases indexes (for normalization)
    await db.skill_aliases.create_index("alias", unique=True)
    await db.skill_aliases.create_index("canonical_name")
    
    print("Created skills-related indexes successfully")
