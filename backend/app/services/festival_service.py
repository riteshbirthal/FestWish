from typing import List, Optional
from uuid import UUID
from app.core.database import get_supabase_admin
from app.core.exceptions import NotFoundException
import logging

logger = logging.getLogger(__name__)


class FestivalService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.table = "festivals"
    
    async def get_all(self, active_only: bool = True) -> List[dict]:
        """Get all festivals"""
        query = self.client.table(self.table).select("*").order("name")
        
        if active_only:
            query = query.eq("is_active", True)
        
        result = query.execute()
        return result.data
    
    async def get_by_id(self, festival_id: UUID) -> dict:
        """Get festival by ID with full details"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("id", str(festival_id))\
            .single()\
            .execute()
        
        if not result.data:
            raise NotFoundException("Festival", str(festival_id))
        
        return result.data
    
    async def get_by_slug(self, slug: str) -> dict:
        """Get festival by URL slug"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("slug", slug)\
            .single()\
            .execute()
        
        if not result.data:
            raise NotFoundException("Festival", slug)
        
        return result.data
    
    async def get_quotes(self, festival_id: UUID) -> List[dict]:
        """Get all quotes for a festival"""
        result = self.client.table("festival_quotes")\
            .select("*")\
            .eq("festival_id", str(festival_id))\
            .eq("is_active", True)\
            .execute()
        
        return result.data
    
    async def get_images(self, festival_id: UUID) -> List[dict]:
        """Get all images for a festival"""
        result = self.client.table("festival_images")\
            .select("*")\
            .eq("festival_id", str(festival_id))\
            .eq("is_active", True)\
            .execute()
        
        return result.data
    
    async def get_random_quote(self, festival_id: UUID) -> Optional[dict]:
        """Get a random quote for a festival"""
        result = self.client.rpc(
            "get_random_quote",
            {"p_festival_id": str(festival_id)}
        ).execute()
        
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None
    
    async def get_random_image(self, festival_id: UUID) -> Optional[dict]:
        """Get a random image for a festival"""
        result = self.client.rpc(
            "get_random_festival_image",
            {"p_festival_id": str(festival_id)}
        ).execute()
        
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None
    
    async def get_random_message(
        self, festival_id: UUID, relationship_id: UUID
    ) -> Optional[dict]:
        """Get a random wish message for festival-relationship combo"""
        result = self.client.rpc(
            "get_random_message",
            {
                "p_festival_id": str(festival_id),
                "p_relationship_id": str(relationship_id)
            }
        ).execute()
        
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None
    
    async def get_festival_detail(self, festival_id: UUID) -> dict:
        """Get complete festival details with quotes and images"""
        festival = await self.get_by_id(festival_id)
        quotes = await self.get_quotes(festival_id)
        images = await self.get_images(festival_id)
        
        festival["quotes"] = quotes
        festival["images"] = images
        
        return festival
    
    async def get_by_culture(self, culture: str) -> List[dict]:
        """Get festivals by religion/culture"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("religion_culture", culture)\
            .eq("is_active", True)\
            .order("name")\
            .execute()
        
        return result.data
    
    async def get_by_month(self, month: str) -> List[dict]:
        """Get festivals by typical month"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("typical_month", month)\
            .eq("is_active", True)\
            .order("name")\
            .execute()
        
        return result.data
