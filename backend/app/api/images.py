from fastapi import APIRouter, Depends, UploadFile, File
from typing import List
from uuid import UUID
from app.schemas.images import ImageUploadResponse, ImageList
from app.services.image_service import ImageService
from app.api.deps import get_current_user

router = APIRouter()

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a user image for greeting card"""
    # Validate file type
    if file.content_type not in ALLOWED_MIME_TYPES:
        return {"error": f"File type {file.content_type} not allowed"}
    
    # Read file content
    content = await file.read()
    
    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        return {"error": "File size exceeds 10MB limit"}
    
    service = ImageService()
    result = await service.upload_user_image(
        user_id=UUID(current_user["id"]),
        file_content=content,
        filename=file.filename,
        mime_type=file.content_type
    )
    
    return result


@router.get("/my-images", response_model=ImageList)
async def get_my_images(
    current_user: dict = Depends(get_current_user)
):
    """Get all images uploaded by current user"""
    service = ImageService()
    images = await service.get_user_images(UUID(current_user["id"]))
    
    return {
        "images": images,
        "total": len(images)
    }


@router.delete("/{image_id}")
async def delete_image(
    image_id: UUID,
    current_user: dict = Depends(get_current_user)
):
    """Delete a user's uploaded image"""
    service = ImageService()
    await service.delete_user_image(
        user_id=UUID(current_user["id"]),
        image_id=image_id
    )
    return {"message": "Image deleted successfully"}


@router.get("/festival/{festival_id}")
async def get_festival_images(festival_id: UUID):
    """Get all images for a specific festival"""
    service = ImageService()
    images = await service.get_festival_images(festival_id)
    return {"images": images, "total": len(images)}
