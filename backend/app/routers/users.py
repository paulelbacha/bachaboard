from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import User, ThemeType
from app.utils.auth import get_current_user

router = APIRouter()

class UserProfile(BaseModel):
    id: int
    username: str
    display_name: str
    theme: ThemeType
    avatar_url: str | None
    is_following: bool
    followers_count: int
    following_count: int

    class Config:
        from_attributes = True

class UpdateProfile(BaseModel):
    display_name: str | None = None
    theme: ThemeType | None = None
    avatar_url: str | None = None

@router.get("/", response_model=List[UserProfile])
async def get_all_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    response = []

    for user in users:
        is_following = user in current_user.following
        response.append({
            "id": user.id,
            "username": user.username,
            "display_name": user.display_name,
            "theme": user.theme,
            "avatar_url": user.avatar_url,
            "is_following": is_following,
            "followers_count": len(user.followers),
            "following_count": len(user.following)
        })

    return response

@router.get("/{user_id}", response_model=UserProfile)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    is_following = user in current_user.following

    return {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "theme": user.theme,
        "avatar_url": user.avatar_url,
        "is_following": is_following,
        "followers_count": len(user.followers),
        "following_count": len(user.following)
    }

@router.put("/me", response_model=dict)
async def update_profile(
    profile_data: UpdateProfile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.display_name:
        current_user.display_name = profile_data.display_name
    if profile_data.theme:
        current_user.theme = profile_data.theme
    if profile_data.avatar_url is not None:
        current_user.avatar_url = profile_data.avatar_url

    db.commit()
    return {"message": "Profile updated successfully"}

@router.post("/{user_id}/follow", response_model=dict)
async def toggle_follow(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if target_user in current_user.following:
        current_user.following.remove(target_user)
        message = f"Unfollowed {target_user.display_name}"
    else:
        current_user.following.append(target_user)
        message = f"Now following {target_user.display_name}"

    db.commit()
    return {"message": message}