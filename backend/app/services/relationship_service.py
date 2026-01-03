from typing import List, Optional
from uuid import UUID
from app.core.database import get_supabase_admin
from app.core.exceptions import NotFoundException
import logging

logger = logging.getLogger(__name__)


class RelationshipService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.table = "relationships"
    
    async def get_all(self, active_only: bool = True) -> List[dict]:
        """Get all relationships ordered by sort_order"""
        query = self.client.table(self.table).select("*").order("sort_order")
        
        if active_only:
            query = query.eq("is_active", True)
        
        result = query.execute()
        return result.data
    
    async def get_by_id(self, relationship_id: UUID) -> dict:
        """Get a single relationship by ID"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("id", str(relationship_id))\
            .single()\
            .execute()
        
        if not result.data:
            raise NotFoundException("Relationship", str(relationship_id))
        
        return result.data
    
    async def get_by_category(self, category: str) -> List[dict]:
        """Get relationships by category"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("category", category)\
            .eq("is_active", True)\
            .order("sort_order")\
            .execute()
        
        return result.data
