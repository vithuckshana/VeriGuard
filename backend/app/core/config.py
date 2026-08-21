import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VeriGuard"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey_please_change")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./veriguard.db") # Using sqlite for local dev unless Postgres is set

settings = Settings()
