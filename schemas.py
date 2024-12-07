from pydantic import BaseModel

class WishlistCreate(BaseModel):
    name: str

class ItemCreate(BaseModel):
    name: str
