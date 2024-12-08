import uvicorn
from app import app
from database import init_db

if __name__ == "__main__":
    # Initialize the database
    init_db()
    
    # Run the application
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
