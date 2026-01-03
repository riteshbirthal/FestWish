from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class ImageUploadResponse(BaseModel):
    id: UUID
    image_url: str
    storage_path: str
    original_filename: Optional[str] = None
    created_at: datetime


class ImageList(BaseModel):
    images: List[ImageUploadResponse]
    total: int
