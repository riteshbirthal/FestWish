from fastapi import APIRouter, Query
from typing import Optional
from uuid import UUID
from app.schemas.festivals import (
    FestivalList, FestivalDetail, Festival,
    RandomContent, FestivalQuote, FestivalImage
)
from app.services.festival_service import FestivalService

router = APIRouter()


@router.get("", response_model=FestivalList)
async def get_festivals(
    culture: Optional[str] = Query(None, description="Filter by religion/culture"),
    month: Optional[str] = Query(None, description="Filter by typical month")
):
    """Get all festivals with optional filtering"""
    service = FestivalService()
    
    if culture:
        festivals = await service.get_by_culture(culture)
    elif month:
        festivals = await service.get_by_month(month)
    else:
        festivals = await service.get_all()
    
    return {
        "festivals": festivals,
        "total": len(festivals)
    }


@router.get("/{festival_id}", response_model=FestivalDetail)
async def get_festival(festival_id: UUID):
    """
    Get complete festival details including quotes, images, and cultural content.
    This is the SEO-friendly festival page content.
    """
    service = FestivalService()
    return await service.get_festival_detail(festival_id)


@router.get("/slug/{slug}", response_model=FestivalDetail)
async def get_festival_by_slug(slug: str):
    """Get festival by URL slug (for SEO-friendly URLs)"""
    service = FestivalService()
    festival = await service.get_by_slug(slug)
    return await service.get_festival_detail(UUID(festival["id"]))


@router.get("/{festival_id}/random-content", response_model=RandomContent)
async def get_random_content(
    festival_id: UUID,
    relationship_id: Optional[UUID] = Query(None, description="Relationship ID for message")
):
    """
    Get random content for a festival.
    Returns different content on each request to ensure variety.
    """
    service = FestivalService()
    
    result = {
        "quote": None,
        "image": None,
        "message": None
    }
    
    # Get random quote
    quote = await service.get_random_quote(festival_id)
    if quote:
        result["quote"] = quote
    
    # Get random image
    image = await service.get_random_image(festival_id)
    if image:
        result["image"] = image
    
    # Get random message if relationship specified
    if relationship_id:
        message = await service.get_random_message(festival_id, relationship_id)
        if message:
            result["message"] = message
    
    return result


@router.get("/{festival_id}/quotes")
async def get_festival_quotes(festival_id: UUID):
    """Get all quotes for a festival"""
    service = FestivalService()
    quotes = await service.get_quotes(festival_id)
    return {"quotes": quotes, "total": len(quotes)}


@router.get("/{festival_id}/images")
async def get_festival_images(festival_id: UUID):
    """Get all images for a festival"""
    service = FestivalService()
    images = await service.get_images(festival_id)
    return {"images": images, "total": len(images)}
