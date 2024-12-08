from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, nullable=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    wishlists = relationship("Wishlist", back_populates="owner", cascade="all, delete-orphan")
    shared_wishlists = relationship("WishlistShare", back_populates="user")

class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    person = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    items = relationship("Item", back_populates="wishlist", cascade="all, delete-orphan")
    owner = relationship("User", back_populates="wishlists")
    shared_with = relationship("WishlistShare", back_populates="wishlist", cascade="all, delete-orphan")

class WishlistShare(Base):
    __tablename__ = "wishlist_shares"
    id = Column(Integer, primary_key=True, index=True)
    wishlist_id = Column(Integer, ForeignKey("wishlists.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    can_edit = Column(Boolean, default=False)
    
    # Relationships
    wishlist = relationship("Wishlist", back_populates="shared_with")
    user = relationship("User", back_populates="shared_wishlists")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    link = Column(String, nullable=True)
    purchased = Column(Boolean, default=False)
    purchase_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    wishlist_id = Column(Integer, ForeignKey("wishlists.id"))
    
    # Relationships
    wishlist = relationship("Wishlist", back_populates="items")
