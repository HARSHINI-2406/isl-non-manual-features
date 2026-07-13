from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
import logging

Base = declarative_base()

logger = logging.getLogger("app.database")
logging.basicConfig(level=logging.INFO)

DATABASE_URL = settings.DATABASE_URL
engine = None

# Attempt to connect to PostgreSQL, fallback to SQLite if enabled
try:
    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        # Set a short timeout for the connection test so it doesn't hang long
        engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args={"connect_timeout": 3})
        # Test connection
        conn = engine.connect()
        conn.close()
        logger.info("Successfully connected to PostgreSQL database.")
    else:
        # If it is SQLite already
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
        logger.info(f"Connected to database: {DATABASE_URL}")
except Exception as e:
    if settings.SQLITE_FALLBACK:
        logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to SQLite local database.")
        sqlite_path = "sqlite:///../isl_features.db"
        engine = create_engine(sqlite_path, connect_args={"check_same_thread": False})
    else:
        logger.error(f"Failed to connect to PostgreSQL and SQLite fallback is disabled: {e}")
        raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
