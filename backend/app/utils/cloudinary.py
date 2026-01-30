import cloudinary
import cloudinary.uploader
from io import BytesIO
from fastapi import UploadFile
from app.config import settings

# Configure Cloudinary
if settings.CLOUDINARY_CLOUD_NAME:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET
    )

async def upload_image(file: UploadFile, folder: str = "bachaboard") -> str:
    """Upload image to Cloudinary and return URL"""
    if not settings.CLOUDINARY_CLOUD_NAME:
        # Return placeholder if Cloudinary not configured
        return f"https://via.placeholder.com/400x300?text={folder}"

    contents = await file.read()

    result = cloudinary.uploader.upload(
        contents,
        folder=f"bachaboard/{folder}",
        resource_type="image"
    )

    return result["secure_url"]

async def upload_drawing(image_buffer: BytesIO, filename: str) -> str:
    """Upload drawing from buffer to Cloudinary"""
    if not settings.CLOUDINARY_CLOUD_NAME:
        return "https://via.placeholder.com/400x300?text=Drawing"

    result = cloudinary.uploader.upload(
        image_buffer,
        folder="bachaboard/drawings",
        public_id=filename,
        resource_type="image"
    )

    return result["secure_url"]