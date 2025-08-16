from motor.motor_asyncio import AsyncIOMotorClient
from app.core.settings import settings



client: AsyncIOMotorClient = None
db = None

# Predefined collection variable
audio_transcripts_collection = None

async def connect_to_mongo():
    global client, db, audio_transcripts_collection
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]
    audio_transcripts_collection = db[settings.MONGO_COLLECTION_NAME]  
    print(f"✅ MongoDB connected to {settings.MONGO_DB_NAME}, collection: {settings.MONGO_COLLECTION_NAME}")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("❌ MongoDB connection closed")


