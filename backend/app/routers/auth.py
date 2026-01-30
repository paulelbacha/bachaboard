from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import User, ThemeType
from app.utils.auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserCreate(BaseModel):
    username: str
    password: str
    display_name: str
    theme: ThemeType = ThemeType.NEUTRAL

class UserResponse(BaseModel):
    id: int
    username: str
    display_name: str
    theme: ThemeType
    avatar_url: str | None

    class Config:
        from_attributes = True

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()

    access_token = create_access_token(data={"sub": user.username})
    user_data = {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "theme": user.theme.value,
        "avatar_url": user.avatar_url
    }

    return {"access_token": access_token, "token_type": "bearer", "user": user_data}

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Create new user
    new_user = User(
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        display_name=user_data.display_name,
        theme=user_data.theme
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user