from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    items = relationship("Item", back_populates="wishlist")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    purchased = Column(Boolean, default=False)
    wishlist_id = Column(Integer, ForeignKey('wishlists.id'))
    wishlist = relationship("Wishlist", back_populates="items")
