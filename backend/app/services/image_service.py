from typing import Optional, BinaryIO
from uuid import UUID, uuid4
from app.core.database import get_supabase_admin
from app.core.config import settings
from app.core.exceptions import StorageException, NotFoundException
import logging

logger = logging.getLogger(__name__)


class ImageService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.bucket = settings.STORAGE_BUCKET
        self.table = "user_uploaded_images"
    
    async def upload_user_image(
        self,
        user_id: UUID,
        file_content: bytes,
        filename: str,
        mime_type: str
    ) -> dict:
        """Upload a user image to storage"""
        try:
            # Generate unique storage path
            file_ext = filename.split(".")[-1] if "." in filename else "jpg"
            storage_path = f"user_uploads/{user_id}/{uuid4()}.{file_ext}"
            
            # Upload to Supabase storage
            self.client.storage.from_(self.bucket).upload(
                storage_path,
                file_content,
                {"content-type": mime_type}
            )
            
            # Get public URL
            image_url = self.client.storage.from_(self.bucket).get_public_url(storage_path)
            
            # Save record to database
            image_data = {
                "user_id": str(user_id),
                "image_url": image_url,
                "storage_path": storage_path,
                "original_filename": filename,
                "file_size": len(file_content),
                "mime_type": mime_type
            }
            
            result = self.client.table(self.table).insert(image_data).execute()
            
            if not result.data:
                raise StorageException("Failed to save image record")
            
            return result.data[0]
            
        except Exception as e:
            logger.error(f"Failed to upload image: {e}")
            raise StorageException(f"Failed to upload image: {str(e)}")
    
    async def get_user_images(self, user_id: UUID) -> list:
        """Get all images uploaded by a user"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("user_id", str(user_id))\
            .order("created_at", desc=True)\
            .execute()
        
        return result.data
    
    async def get_image(self, image_id: UUID) -> dict:
        """Get a specific image by ID"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("id", str(image_id))\
            .single()\
            .execute()
        
        if not result.data:
            raise NotFoundException("Image", str(image_id))
        
        return result.data
    
    async def delete_user_image(self, user_id: UUID, image_id: UUID) -> bool:
        """Delete a user's image"""
        try:
            # Get image first to verify ownership
            image = await self.get_image(image_id)
            
            if image["user_id"] != str(user_id):
                raise StorageException("Not authorized to delete this image")
            
            # Delete from storage
            self.client.storage.from_(self.bucket).remove([image["storage_path"]])
            
            # Delete from database
            self.client.table(self.table)\
                .delete()\
                .eq("id", str(image_id))\
                .execute()
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete image: {e}")
            raise StorageException(f"Failed to delete image: {str(e)}")
    
    async def get_festival_images(self, festival_id: UUID) -> list:
        """Get all images for a festival"""
        result = self.client.table("festival_images")\
            .select("*")\
            .eq("festival_id", str(festival_id))\
            .eq("is_active", True)\
            .execute()
        
        return result.data
