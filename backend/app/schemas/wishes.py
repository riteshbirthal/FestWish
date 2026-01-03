from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class WishCreate(BaseModel):
    festival_id: UUID
    relationship_id: UUID
    recipient_name: Optional[str] = None
    custom_message: Optional[str] = None
    user_image_id: Optional[UUID] = None
    channel_type: str = "download"


class WishPreview(BaseModel):
    message_text: str
    image_url: str
    quote_text: Optional[str] = None
    quote_author: Optional[str] = None
    festival_name: str
    relationship_name: str
    recipient_name: Optional[str] = None


class GeneratedWish(BaseModel):
    id: UUID
    festival_id: UUID
    relationship_id: UUID
    recipient_name: Optional[str] = None
    final_message: str
    generated_card_url: Optional[str] = None
    channel_type: Optional[str] = None
    sent_status: str = "pending"
    created_at: datetime
    
    class Config:
        from_attributes = True


class WishResponse(BaseModel):
    success: bool
    wish: Optional[GeneratedWish] = None
    card_url: Optional[str] = None
    message: str
