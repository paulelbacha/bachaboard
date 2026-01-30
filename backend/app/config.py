import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bachaboard.db")

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    # App settings
    APP_NAME: str = "BachaBoard"
    APP_VERSION: str = "1.0.0"
    CORS_ORIGINS: list = ["http://localhost:3000"]

    # Railway/Production
    PORT: int = int(os.getenv("PORT", 8000))
    RAILWAY_ENVIRONMENT: str = os.getenv("RAILWAY_ENVIRONMENT", "development")

    class Config:
        env_file = ".env"

settings = Settings()