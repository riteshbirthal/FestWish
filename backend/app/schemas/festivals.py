from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class FestivalQuote(BaseModel):
    id: UUID
    quote_text: str
    author: Optional[str] = None
    source: Optional[str] = None
    
    class Config:
        from_attributes = True


class FestivalImage(BaseModel):
    id: UUID
    image_url: str
    alt_text: Optional[str] = None
    is_card_template: bool = False
    
    class Config:
        from_attributes = True


class FestivalBase(BaseModel):
    name: str
    slug: str
    religion_culture: Optional[str] = None
    typical_month: Optional[str] = None
    description: Optional[str] = None


class Festival(FestivalBase):
    id: UUID
    is_active: bool = True
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class FestivalDetail(Festival):
    story_history: Optional[str] = None
    cultural_significance: Optional[str] = None
    traditions: Optional[str] = None
    quotes: List[FestivalQuote] = []
    images: List[FestivalImage] = []


class FestivalList(BaseModel):
    festivals: List[Festival]
    total: int


class RandomContent(BaseModel):
    message: Optional[dict] = None
    quote: Optional[FestivalQuote] = None
    image: Optional[FestivalImage] = None
