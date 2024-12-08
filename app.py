from fastapi import FastAPI, Depends, HTTPException, status, Request, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import models
import schemas
import auth
from database import get_db, init_db
import os
from datetime import datetime
from typing import Optional
from datetime import timedelta

app = FastAPI()

# Mount static files
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Set up templates
templates_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")
templates = Jinja2Templates(directory=templates_dir)

# Initialize database
init_db()

# Page routes
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return RedirectResponse(url="/viewer")

@app.get("/viewer", response_class=HTMLResponse)
async def viewer(request: Request, db: Session = Depends(get_db)):
    try:
        current_user = await auth.get_current_user(request, db)
    except HTTPException:
        current_user = None
    return templates.TemplateResponse("viewer.html", {"request": request, "user": current_user})

@app.get("/creator", response_class=HTMLResponse)
async def creator(request: Request, db: Session = Depends(get_db)):
    try:
        current_user = await auth.get_current_user(request, db)
        return templates.TemplateResponse("creator.html", {"request": request, "user": current_user})
    except HTTPException as e:
        if e.status_code == status.HTTP_401_UNAUTHORIZED:
            # Log the error for debugging
            print(f"Auth error in creator endpoint: {e.detail}")
            return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
        raise e

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    response = RedirectResponse(url="/creator", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        samesite="lax"
    )
    return response

@app.get("/logout")
async def logout():
    response = RedirectResponse(url="/login")
    response.delete_cookie("access_token")
    return response

@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.post("/register")
async def register(
    username: str = Form(...),
    password: str = Form(...),
    email: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.username == username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user = schemas.UserCreate(username=username, email=email, password=password)
    db_user = auth.create_user(db, user)
    return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)

# API endpoints
@app.get("/api/wishlists", response_model=list[schemas.Wishlist])
def get_wishlists(db: Session = Depends(get_db)):
    wishlists = db.query(models.Wishlist).all()
    return wishlists

@app.post("/api/wishlists", response_model=schemas.Wishlist)
def create_wishlist(
    wishlist: schemas.WishlistCreate,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_wishlist = models.Wishlist(
        name=wishlist.name,
        person=wishlist.person,
        owner_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(db_wishlist)
    db.commit()
    db.refresh(db_wishlist)
    return db_wishlist

@app.delete("/api/wishlists/{wishlist_id}")
def delete_wishlist(
    wishlist_id: int,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    wishlist = db.query(models.Wishlist).filter(models.Wishlist.id == wishlist_id).first()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    if wishlist.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this wishlist")
    
    db.delete(wishlist)
    db.commit()
    return {"message": "Wishlist deleted"}

@app.post("/api/wishlists/{wishlist_id}/items", response_model=schemas.Item)
def create_item(
    wishlist_id: int,
    item: schemas.ItemCreate,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    wishlist = db.query(models.Wishlist).filter(models.Wishlist.id == wishlist_id).first()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    if wishlist.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to add items to this wishlist")
    
    db_item = models.Item(
        name=item.name,
        link=item.link,
        wishlist_id=wishlist_id,
        purchased=False,
        created_at=datetime.utcnow()
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.post("/api/items/{item_id}/purchase")
def purchase_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.purchased = not item.purchased  # Toggle the purchased state
    item.purchase_date = datetime.utcnow() if item.purchased else None  # Set or clear purchase date
    
    db.commit()
    return {"status": "success"}

@app.delete("/api/items/{item_id}")
def delete_item(
    item_id: int,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    wishlist = db.query(models.Wishlist).filter(models.Wishlist.id == item.wishlist_id).first()
    if wishlist.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")
    
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get configuration from environment variables with defaults
    HOST = os.getenv("WISHLIST_HOST", "0.0.0.0")
    PORT = int(os.getenv("WISHLIST_PORT", "8000"))
    
    print(f"Starting Wishlist App on http://{HOST}:{PORT}")
    uvicorn.run("app:app", host=HOST, port=PORT, reload=True)
