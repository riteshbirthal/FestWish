from fastapi import APIRouter, Depends, Query, Response
from typing import Optional
from uuid import UUID
from app.schemas.wishes import WishCreate, WishPreview, WishResponse, GeneratedWish
from app.services.wish_service import WishService
from app.services.card_service import CardService
from app.services.festival_service import FestivalService
from app.services.messaging import MessageChannelFactory
from app.api.deps import get_current_user, get_current_user_optional

router = APIRouter()


@router.post("/create", response_model=WishResponse)
async def create_wish(
    wish_data: WishCreate,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Create a new wish with auto-generated or custom content"""
    service = WishService()
    
    user_id = UUID(current_user["id"]) if current_user else None
    
    wish = await service.create_wish(
        user_id=user_id,
        festival_id=wish_data.festival_id,
        relationship_id=wish_data.relationship_id,
        recipient_name=wish_data.recipient_name,
        custom_message=wish_data.custom_message,
        user_image_id=wish_data.user_image_id,
        channel_type=wish_data.channel_type
    )
    
    return {
        "success": True,
        "wish": wish,
        "message": "Wish created successfully"
    }


@router.get("/preview", response_model=WishPreview)
async def preview_wish(
    festival_id: UUID,
    relationship_id: UUID,
    custom_message: Optional[str] = Query(None),
    recipient_name: Optional[str] = Query(None)
):
    """
    Preview wish content without saving.
    Returns random message, image, and quote.
    Multiple requests return different content.
    """
    service = WishService()
    
    return await service.generate_preview(
        festival_id=festival_id,
        relationship_id=relationship_id,
        custom_message=custom_message,
        recipient_name=recipient_name
    )


@router.post("/{wish_id}/generate-card", response_model=WishResponse)
async def generate_card(
    wish_id: UUID,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Generate greeting card image for a wish"""
    wish_service = WishService()
    card_service = CardService()
    festival_service = FestivalService()
    
    wish = await wish_service.get_wish(wish_id)
    
    # Get image URL
    if wish.get("user_image_id"):
        from app.services.image_service import ImageService
        image_service = ImageService()
        user_image = await image_service.get_image(UUID(wish["user_image_id"]))
        image_url = user_image["image_url"]
    elif wish.get("image_id"):
        images = await festival_service.get_images(UUID(wish["festival_id"]))
        image = next((i for i in images if i["id"] == wish["image_id"]), None)
        image_url = image["image_url"] if image else ""
    else:
        random_image = await festival_service.get_random_image(UUID(wish["festival_id"]))
        image_url = random_image["image_url"] if random_image else ""
    
    if not image_url:
        return {
            "success": False,
            "message": "No image available for card generation"
        }
    
    # Get quote if available
    quote_text = None
    if wish.get("quote_id"):
        quotes = await festival_service.get_quotes(UUID(wish["festival_id"]))
        quote = next((q for q in quotes if q["id"] == wish["quote_id"]), None)
        quote_text = quote["quote_text"] if quote else None
    
    # Generate card
    card_bytes = await card_service.generate_card(
        background_image_url=image_url,
        message_text=wish["final_message"],
        recipient_name=wish.get("recipient_name"),
        quote_text=quote_text
    )
    
    # Save card
    card_url = await card_service.save_card(card_bytes, wish_id)
    
    # Update wish with card URL
    await wish_service.update_card_url(wish_id, card_url)
    
    return {
        "success": True,
        "card_url": card_url,
        "message": "Card generated successfully"
    }


@router.get("/{wish_id}/download")
async def download_card(wish_id: UUID):
    """Download generated card as image file"""
    import httpx
    
    wish_service = WishService()
    wish = await wish_service.get_wish(wish_id)
    
    if not wish.get("generated_card_url"):
        return {"error": "No card generated for this wish"}
    
    # Fetch the image from storage
    async with httpx.AsyncClient() as client:
        response = await client.get(wish["generated_card_url"])
        image_bytes = response.content
    
    # Return the image with download headers
    return Response(
        content=image_bytes,
        media_type="image/jpeg",
        headers={
            "Content-Disposition": f'attachment; filename="festwish_{wish_id}.jpg"'
        }
    )


@router.get("/history")
async def get_wish_history(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(50, le=100)
):
    """Get current user's wish history"""
    service = WishService()
    wishes = await service.get_user_wishes(UUID(current_user["id"]), limit)
    return {"wishes": wishes, "total": len(wishes)}


@router.get("/{wish_id}", response_model=GeneratedWish)
async def get_wish(wish_id: UUID):
    """Get a specific wish by ID"""
    service = WishService()
    return await service.get_wish(wish_id)


@router.get("/channels/available")
async def get_available_channels():
    """Get available message channels"""
    channels = MessageChannelFactory.get_available_channels()
    return {"channels": channels}
