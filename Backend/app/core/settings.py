from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # MongoDB
    MONGO_URI: str
    MONGO_DB_NAME: str
    MONGO_COLLECTION_NAME: str

    # OpenAI (only required if USE_OPENAI_MOCK=True)
    OPENAI_API_KEY: str | None = None
    USE_OPENAI_MOCK: bool = False


    # Auth / JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"  

settings = Settings()

class Config:
        env_file = Path(__file__).resolve().parent.parent.parent / ".env"
        env_file_encoding = "utf-8"

settings = Settings()
print("✅ Loaded settings from:", settings.model_dump())