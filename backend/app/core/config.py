from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Smart Patient Triage"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "triage_db"
    REDIS_URL: str = "redis://localhost:6379"
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-pro"
    
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]
    
    RATE_LIMIT_PER_MINUTE: int = 60
    
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
