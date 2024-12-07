from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel
from typing import Optional
import os

# Get absolute path for database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "wishlists.db")
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

print(f"Using database at: {DATABASE_PATH}")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False},
    echo=True  # This will log all SQL statements
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="."), name="static")

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
    wishlist_id = Column(Integer, ForeignKey('wishlists.id'))
    wishlist = relationship("Wishlist", back_populates="items")

# Check if the database file exists
if not os.path.exists(DATABASE_PATH):
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
            "items": [{"id": item.id, "name": item.name, "link": item.link, "purchased": item.purchased} 
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

@app.put("/items/{item_id}/purchase/")
def purchase_item(item_id: int):
    db = SessionLocal()
    item = db.query(Item).filter(Item.id == item_id).first()
    if item:
        item.purchased = not item.purchased  # Toggle the purchased status
        db.commit()
        db.close()
        return item
    db.close()
    raise HTTPException(status_code=404, detail="Item not found")

@app.get("/")
async def read_root():
    return FileResponse('index.html')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)