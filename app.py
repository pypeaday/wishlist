from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os

# Database configuration
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.getenv("WISHLIST_DB_PATH", os.path.join(DATA_DIR, "wishlists.db"))

print(f"Using database at: {DB_PATH}")

engine = create_engine(
    f"sqlite:///{DB_PATH}", 
    connect_args={"check_same_thread": False},
    echo=True  # This will log all SQL statements
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    person = Column(String, index=True)
    items = relationship("Item", back_populates="wishlist", cascade="all, delete-orphan")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    link = Column(String)
    purchased = Column(Boolean, default=False)
    purchase_date = Column(DateTime, nullable=True)
    wishlist_id = Column(Integer, ForeignKey('wishlists.id'))
    wishlist = relationship("Wishlist", back_populates="items")

# Check if the database file exists
if not os.path.exists(DB_PATH):
    print("Creating new database...")
    Base.metadata.create_all(bind=engine)
else:
    print("Using existing database...")
    # Verify table existence without recreating
    from sqlalchemy import inspect
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    if not all(table in existing_tables for table in ['wishlists', 'items']):
        print("Missing tables, creating them...")
        Base.metadata.create_all(bind=engine)
    else:
        print("All tables exist")

class WishlistCreate(BaseModel):
    name: str
    person: str

class ItemCreate(BaseModel):
    name: str
    link: Optional[str] = None

@app.post("/wishlists/")
def create_wishlist(wishlist: WishlistCreate):
    db = SessionLocal()
    db_wishlist = Wishlist(name=wishlist.name, person=wishlist.person)
    db.add(db_wishlist)
    db.commit()
    db.refresh(db_wishlist)
    db.close()
    return db_wishlist

@app.get("/wishlists/")
def read_wishlists():
    db = SessionLocal()
    wishlists = db.query(Wishlist).all()
    # Convert to dict to include items
    result = []
    for wishlist in wishlists:
        result.append({
            "id": wishlist.id,
            "name": wishlist.name,
            "person": wishlist.person,
            "items": [{"id": item.id, "name": item.name, "link": item.link, "purchased": item.purchased, "purchase_date": item.purchase_date} 
                     for item in wishlist.items]
        })
    db.close()
    return result

@app.post("/wishlists/{wishlist_id}/items/")
def create_item(wishlist_id: int, item: ItemCreate):
    db = SessionLocal()
    db_item = Item(name=item.name, link=item.link, wishlist_id=wishlist_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    db.close()
    return db_item

@app.delete("/items/{item_id}/")
def delete_item(item_id: int):
    db = SessionLocal()
    item = db.query(Item).filter(Item.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
        db.close()
        return {"message": "Item deleted successfully"}
    db.close()
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/items/{item_id}/purchase")
def purchase_item(item_id: int):
    db = SessionLocal()
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        db.close()
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.purchased = not item.purchased
    if item.purchased:
        item.purchase_date = datetime.now()
    else:
        item.purchase_date = None
    
    db.commit()
    
    # Create response with the updated item
    response = {
        "id": item.id,
        "name": item.name,
        "link": item.link,
        "purchased": item.purchased,
        "purchase_date": item.purchase_date.isoformat() if item.purchase_date else None
    }
    
    db.close()
    return response

@app.delete("/wishlists/{wishlist_id}")
def delete_wishlist(wishlist_id: int):
    db = SessionLocal()
    wishlist = db.query(Wishlist).filter(Wishlist.id == wishlist_id).first()
    if not wishlist:
        db.close()
        raise HTTPException(status_code=404, detail="Wishlist not found")
    
    # Get the count of items for the response
    item_count = len(wishlist.items)
    
    # Delete the wishlist (items will be cascade deleted due to relationship setting)
    db.delete(wishlist)
    db.commit()
    db.close()
    
    return {"message": f"Wishlist and {item_count} items deleted successfully"}

@app.get("/")
async def read_root():
    return FileResponse('index.html')

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get configuration from environment variables with defaults
    HOST = os.getenv("WISHLIST_HOST", "0.0.0.0")
    PORT = int(os.getenv("WISHLIST_PORT", "8000"))
    
    print(f"Starting Wishlist App on http://{HOST}:{PORT}")
    uvicorn.run("app:app", host=HOST, port=PORT, reload=True)
