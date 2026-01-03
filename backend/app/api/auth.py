from fastapi import APIRouter, Depends, status
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    auth_service = AuthService()
    result = await auth_service.register(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name
    )
    
    # Handle email confirmation flow
    if result.get("session") is None:
        return {
            "message": result.get("message", "Please check your email to confirm your account."),
            "user": result["user"],
            "requires_confirmation": True
        }
    
    return {
        "access_token": result["session"].access_token,
        "token_type": "bearer",
        "expires_in": result["session"].expires_in,
        "user": result["user"]
    }


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Authenticate and get access token"""
    auth_service = AuthService()
    result = await auth_service.login(
        email=credentials.email,
        password=credentials.password
    )
    
    return {
        "access_token": result["session"].access_token,
        "token_type": "bearer",
        "expires_in": result["session"].expires_in,
        "user": result["user"]
    }


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Log out current user"""
    auth_service = AuthService()
    await auth_service.logout("")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return current_user
