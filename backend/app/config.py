import os
from pydantic import BaseModel

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DB_PATH = os.path.join(BACKEND_DIR, "prithvinet.db").replace("\\", "/")

class Settings(BaseModel):
    APP_NAME: str = "PrithviNet API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{DEFAULT_DB_PATH}"
    )
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
        "*"
    ]

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

