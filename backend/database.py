import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Default to SQLite for seamless zero-setup execution, with support for MySQL
# To use MySQL: set DATABASE_URL="mysql+pymysql://root:password@localhost/saperp"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./saperp.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

