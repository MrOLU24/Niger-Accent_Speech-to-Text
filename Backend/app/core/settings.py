
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MongoDB
    MONGO_URI: str
    MONGO_DB_NAME: str
    MONGO_COLLECTION_NAME: str

    # OpenAI
    OPENAI_API_KEY: str
    USE_OPENAI_MOCK: bool = True


    # Auth / JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"  

settings = Settings()
