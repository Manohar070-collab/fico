"""
Application Configuration Settings.
Loads configuration from environment variables with sensible defaults for development.
"""
import os
from typing import List

class Settings:
    PROJECT_NAME: str = "SAP OneERP Cloud Platform"
    PROJECT_DESCRIPTION: str = "SAP OneERP Financial Accounting (FI) and Controlling (CO) REST API conforming to OpenAPI 3.0"
    VERSION: str = "1.0.0"
    
    # Primary MySQL 8.0 on localhost with user 'root' and password 'Manu'
    MYSQL_DEFAULT_URL: str = "mysql+pymysql://root:Manu@127.0.0.1:3306/saperp"
    FALLBACK_SQLITE_URL: str = "sqlite:///./saperp.db"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", MYSQL_DEFAULT_URL)
    
    # JWT Authentication settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "s@p-0neErp-f1c0-sup3r-s3cr3t-k3y-2025!")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS Allowed Origins
    CORS_ORIGINS: List[str] = ["*"]

settings = Settings()
