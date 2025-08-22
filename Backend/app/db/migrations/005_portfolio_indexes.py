"""MongoDB migration for portfolio-related indexes."""
from motor.motor_asyncio import AsyncIOMotorDatabase

async def create_portfolio_indexes(db: AsyncIOMotorDatabase):
    """Create indexes for portfolio collections."""
    
    # Projects collection indexes
    await db.projects.create_index("user_id")
    await db.projects.create_index([
        ("title", "text"),
        ("description", "text"),
        ("technologies", "text")
    ])
    await db.projects.create_index([("user_id", 1), ("featured", 1)])
    await db.projects.create_index([("user_id", 1), ("order", 1)])
    await db.projects.create_index("created_at")
    await db.projects.create_index("visibility")
    await db.projects.create_index("technologies")
    
    # Media collection indexes
    await db.media.create_index("user_id")
    await db.media.create_index([("user_id", 1), ("type", 1)])
    await db.media.create_index("created_at")
    await db.media.create_index("mime_type")
    
    print("Created portfolio-related indexes successfully")
