from fastapi import APIRouter
from app.api import auth, festivals, relationships, wishes, images

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(festivals.router, prefix="/festivals", tags=["Festivals"])
api_router.include_router(relationships.router, prefix="/relationships", tags=["Relationships"])
api_router.include_router(wishes.router, prefix="/wishes", tags=["Wishes"])
api_router.include_router(images.router, prefix="/images", tags=["Images"])
