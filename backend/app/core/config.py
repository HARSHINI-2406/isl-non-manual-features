import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    SECRET_KEY: str = "94e7bd016f4d2f0907d72138a0a86071efc5625bf9c9d5e3ef544b802a4d3ff5"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/isl_features"
    SQLITE_FALLBACK: bool = True

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
