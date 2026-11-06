import os
from pydantic import BaseModel
from dotenv import load_dotenv

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BACKEND_DIR)

# Load environment variables from backend/.env or root .env
load_dotenv(os.path.join(ROOT_DIR, ".env"))
load_dotenv(os.path.join(BACKEND_DIR, ".env"))

DEFAULT_DB_PATH = os.path.join(BACKEND_DIR, "prithvinet.db").replace("\\", "/")

def get_normalized_database_url() -> str:
    url = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")
    # Normalize postgres:// to postgresql:// for SQLAlchemy 2.0+ compatibility
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url

class Settings(BaseModel):
    APP_NAME: str = "PrithviNet API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1")
    DATABASE_URL: str = get_normalized_database_url()
    JWT_SECRET: str = os.getenv("JWT_SECRET", "prithvinet-pune-green-secret-key-2026")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_DAYS: int = 14
    MAPBOX_ACCESS_TOKEN: str = os.getenv("MAPBOX_ACCESS_TOKEN", "")
    UPLOAD_DIR: str = os.getenv(
        "UPLOAD_DIR", 
        os.path.join(BACKEND_DIR, "uploads")
    )
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://prithvinet-three.vercel.app",
        "*"
    ]

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

