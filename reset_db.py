import os
from database import Base, engine
import models

def reset_database():
    # Get the database file path from the environment variable or use default
    db_path = os.getenv('WISHLIST_DB_PATH', 'data/wishlist.db')
    
    # Ensure the data directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    # Remove existing database if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database at {db_path}")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print(f"Created new database at {db_path}")

if __name__ == "__main__":
    reset_database()
