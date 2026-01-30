from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models import User, Feedback
from app.utils.auth import get_current_user

router = APIRouter()

class FeedbackCreate(BaseModel):
    subject: str
    message: str
    category: str = "general"

class FeedbackResponse(BaseModel):
    id: int
    subject: str
    message: str
    category: str
    created_at: datetime
    user_name: str

    class Config:
        from_attributes = True

@router.post("/", response_model=dict)
async def submit_feedback(
    feedback_data: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_feedback = Feedback(
        user_id=current_user.id,
        subject=feedback_data.subject,
        message=feedback_data.message,
        category=feedback_data.category
    )

    db.add(new_feedback)
    db.commit()

    return {"message": "Thank you for your feedback!"}

@router.get("/", response_model=List[FeedbackResponse])
async def get_all_feedback(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only admin users can see all feedback
    # For now, we'll let everyone see their own feedback
    feedbacks = db.query(Feedback).filter(Feedback.user_id == current_user.id).all()

    return [
        {
            "id": f.id,
            "subject": f.subject,
            "message": f.message,
            "category": f.category,
            "created_at": f.created_at,
            "user_name": f.user.display_name
        } for f in feedbacks
    ]