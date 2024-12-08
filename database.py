from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging

# Database configuration
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.getenv("WISHLIST_DB_PATH", os.path.join(DATA_DIR, "wishlists.db"))

print(f"Using database at: {DB_PATH}")

# Configure logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

# Create engine
engine = create_engine(
    f"sqlite:///{DB_PATH}", 
    connect_args={"check_same_thread": False},
    echo=False  # Disable SQL statement logging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for declarative models
Base = declarative_base()

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create database tables
def init_db():
    import models  # Import models here to avoid circular imports
    print("Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized.")
