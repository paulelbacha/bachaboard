import json
import base64
from io import BytesIO
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from PIL import Image

from app.database import get_db
from app.models import User
from app.utils.auth import get_current_user
from app.utils.cloudinary import upload_drawing

router = APIRouter()

class DrawingSave(BaseModel):
    drawing_data: str  # Canvas state as JSON
    image_data: str  # Base64 encoded image

class DrawingResponse(BaseModel):
    drawing_data: str
    image_url: str

@router.post("/save", response_model=dict)
async def save_drawing(
    drawing: DrawingSave,
    current_user: User = Depends(get_current_user)
):
    try:
        # Convert base64 to image
        image_data = drawing.image_data.split(',')[1] if ',' in drawing.image_data else drawing.image_data
        image = Image.open(BytesIO(base64.b64decode(image_data)))

        # Save to temporary file
        temp_buffer = BytesIO()
        image.save(temp_buffer, format='PNG')
        temp_buffer.seek(0)

        # Upload to Cloudinary
        image_url = await upload_drawing(temp_buffer, f"drawing_{current_user.id}")

        return {
            "image_url": image_url,
            "drawing_data": drawing.drawing_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to save drawing: {str(e)}")

@router.post("/auto-save", response_model=dict)
async def auto_save_drawing(
    drawing_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Store drawing data temporarily (could use Redis in production)
    # For now, we'll just return success
    return {"message": "Drawing auto-saved"}