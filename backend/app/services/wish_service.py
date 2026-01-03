from typing import Optional
from uuid import UUID
from app.core.database import get_supabase_admin
from app.core.exceptions import NotFoundException, ValidationException
from app.services.festival_service import FestivalService
from app.services.relationship_service import RelationshipService
from app.services.card_service import CardService
import logging

logger = logging.getLogger(__name__)


class WishService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.table = "generated_wishes"
        self.festival_service = FestivalService()
        self.relationship_service = RelationshipService()
        self.card_service = CardService()
    
    async def create_wish(
        self,
        user_id: Optional[UUID],
        festival_id: UUID,
        relationship_id: UUID,
        recipient_name: Optional[str] = None,
        custom_message: Optional[str] = None,
        user_image_id: Optional[UUID] = None,
        channel_type: str = "download"
    ) -> dict:
        """Create a new wish with random or custom content"""
        
        # Verify festival and relationship exist
        festival = await self.festival_service.get_by_id(festival_id)
        relationship = await self.relationship_service.get_by_id(relationship_id)
        
        # Get message (custom or random)
        message_id = None
        if custom_message:
            final_message = custom_message
        else:
            random_message = await self.festival_service.get_random_message(
                festival_id, relationship_id
            )
            if random_message:
                final_message = random_message.get("message_text", "")
                message_id = random_message.get("id")
            else:
                raise ValidationException(
                    f"No messages available for {festival['name']} - {relationship['display_name']}"
                )
        
        # Get random image (if user didn't provide one)
        image_id = None
        if not user_image_id:
            random_image = await self.festival_service.get_random_image(festival_id)
            if random_image:
                image_id = random_image.get("id")
        
        # Get random quote
        quote_id = None
        random_quote = await self.festival_service.get_random_quote(festival_id)
        if random_quote:
            quote_id = random_quote.get("id")
        
        # Create wish record
        wish_data = {
            "festival_id": str(festival_id),
            "relationship_id": str(relationship_id),
            "recipient_name": recipient_name,
            "custom_message": custom_message,
            "final_message": final_message,
            "channel_type": channel_type,
            "sent_status": "pending"
        }
        
        if user_id:
            wish_data["user_id"] = str(user_id)
        if message_id:
            wish_data["message_id"] = str(message_id)
        if image_id:
            wish_data["image_id"] = str(image_id)
        if user_image_id:
            wish_data["user_image_id"] = str(user_image_id)
        if quote_id:
            wish_data["quote_id"] = str(quote_id)
        
        result = self.client.table(self.table).insert(wish_data).execute()
        
        if not result.data:
            raise ValidationException("Failed to create wish")
        
        return result.data[0]
    
    async def get_wish(self, wish_id: UUID) -> dict:
        """Get a specific wish by ID"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("id", str(wish_id))\
            .single()\
            .execute()
        
        if not result.data:
            raise NotFoundException("Wish", str(wish_id))
        
        return result.data
    
    async def get_user_wishes(self, user_id: UUID, limit: int = 50) -> list:
        """Get all wishes for a user"""
        result = self.client.table(self.table)\
            .select("*")\
            .eq("user_id", str(user_id))\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        
        return result.data
    
    async def generate_preview(
        self,
        festival_id: UUID,
        relationship_id: UUID,
        custom_message: Optional[str] = None,
        recipient_name: Optional[str] = None
    ) -> dict:
        """Generate a preview of the wish without saving"""
        
        festival = await self.festival_service.get_by_id(festival_id)
        relationship = await self.relationship_service.get_by_id(relationship_id)
        
        # Get message
        if custom_message:
            message_text = custom_message
        else:
            random_message = await self.festival_service.get_random_message(
                festival_id, relationship_id
            )
            message_text = random_message.get("message_text", "") if random_message else ""
        
        # Get random image
        random_image = await self.festival_service.get_random_image(festival_id)
        image_url = random_image.get("image_url", "") if random_image else ""
        
        # Get random quote
        random_quote = await self.festival_service.get_random_quote(festival_id)
        
        return {
            "message_text": message_text,
            "image_url": image_url,
            "quote_text": random_quote.get("quote_text") if random_quote else None,
            "quote_author": random_quote.get("author") if random_quote else None,
            "festival_name": festival["name"],
            "relationship_name": relationship["display_name"],
            "recipient_name": recipient_name
        }
    
    async def update_card_url(self, wish_id: UUID, card_url: str) -> dict:
        """Update the generated card URL for a wish"""
        result = self.client.table(self.table)\
            .update({"generated_card_url": card_url})\
            .eq("id", str(wish_id))\
            .execute()
        
        if not result.data:
            raise NotFoundException("Wish", str(wish_id))
        
        return result.data[0]
    
    async def mark_as_sent(
        self, wish_id: UUID, channel_type: str
    ) -> dict:
        """Mark a wish as sent"""
        from datetime import datetime
        
        result = self.client.table(self.table)\
            .update({
                "sent_status": "sent",
                "sent_at": datetime.utcnow().isoformat(),
                "channel_type": channel_type
            })\
            .eq("id", str(wish_id))\
            .execute()
        
        if not result.data:
            raise NotFoundException("Wish", str(wish_id))
        
        return result.data[0]
