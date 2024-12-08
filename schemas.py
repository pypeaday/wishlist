from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class WishlistBase(BaseModel):
    name: str
    person: str

class WishlistCreate(WishlistBase):
    pass

class Wishlist(WishlistBase):
    id: int
    created_at: datetime
    owner_id: int
    items: List["Item"] = []
    model_config = ConfigDict(from_attributes=True)

class ItemBase(BaseModel):
    name: str
    link: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    purchased: bool
    purchase_date: Optional[datetime]
    created_at: datetime
    wishlist_id: int
    model_config = ConfigDict(from_attributes=True)

class WishlistShareBase(BaseModel):
    can_edit: bool = False

class WishlistShareCreate(WishlistShareBase):
    user_id: int
    wishlist_id: int

class WishlistShare(WishlistShareBase):
    id: int
    created_at: datetime
    user_id: int
    wishlist_id: int
    model_config = ConfigDict(from_attributes=True)

# Update forward references
Wishlist.model_rebuild()
