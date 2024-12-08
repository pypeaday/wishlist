import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status, Cookie, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db
import logging

# Set up logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-keep-it-secret")  # Use environment variable in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # Extended to 24 hours for better user experience

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Password verification error: {str(e)}")
        return False

def get_password_hash(password: str) -> str:
    try:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    except Exception as e:
        logger.error(f"Password hashing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing password"
        )

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        logger.info(f"Created access token for user: {data.get('sub')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Token creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating access token"
        )

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    try:
        hashed_password = get_password_hash(user.password)
        db_user = models.User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            created_at=datetime.utcnow(),
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"Created new user: {user.username}")
        return db_user
    except Exception as e:
        logger.error(f"User creation error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )

def authenticate_user(db: Session, username: str, password: str) -> Optional[models.User]:
    try:
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            logger.warning(f"Login attempt failed: User not found - {username}")
            return None
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Login attempt failed: Invalid password for user - {username}")
            return None
        logger.info(f"User authenticated successfully: {username}")
        return user
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return None

async def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Get token from cookie
        auth_cookie = request.cookies.get("access_token")
        if not auth_cookie:
            logger.error("No auth cookie found in request")
            raise credentials_exception
        
        # Remove 'Bearer ' prefix if present
        token = auth_cookie.replace("Bearer ", "") if auth_cookie.startswith("Bearer ") else auth_cookie
        logger.debug("Processing token from cookie")
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                logger.error("Token payload does not contain username")
                raise credentials_exception
            
            # Check token expiration
            exp = payload.get("exp")
            if not exp or datetime.fromtimestamp(exp) < datetime.utcnow():
                logger.error("Token has expired")
                raise credentials_exception
                
        except JWTError as e:
            logger.error(f"JWT decode error: {str(e)}")
            raise credentials_exception
            
        user = db.query(models.User).filter(models.User.username == username).first()
        if user is None:
            logger.error(f"No user found in database for username: {username}")
            raise credentials_exception
            
        if not user.is_active:
            logger.error(f"User is not active: {username}")
            raise credentials_exception
            
        logger.info(f"Successfully authenticated user: {username}")
        return user
        
    except Exception as e:
        logger.error(f"Unexpected error in get_current_user: {str(e)}")
        raise credentials_exception

async def get_current_active_user(current_user = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
