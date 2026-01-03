from typing import Optional
from fastapi import Depends, Header
from app.services.auth_service import AuthService
from app.core.exceptions import UnauthorizedException


async def get_current_user_optional(
    authorization: Optional[str] = Header(None)
) -> Optional[dict]:
    """Get current user if authenticated (optional)"""
    if not authorization:
        return None
    
    if not authorization.startswith("Bearer "):
        return None
    
    token = authorization.replace("Bearer ", "")
    auth_service = AuthService()
    return await auth_service.get_current_user(token)


async def get_current_user(
    authorization: str = Header(...)
) -> dict:
    """Get current user (required)"""
    if not authorization.startswith("Bearer "):
        raise UnauthorizedException("Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    auth_service = AuthService()
    user = await auth_service.get_current_user(token)
    
    if not user:
        raise UnauthorizedException("Invalid or expired token")
    
    return user
