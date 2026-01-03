from typing import Optional
from uuid import UUID
from app.core.database import get_supabase, get_supabase_admin
from app.core.exceptions import UnauthorizedException, ValidationException
import logging

logger = logging.getLogger(__name__)

# Generic error messages to prevent information leakage
GENERIC_REGISTRATION_ERROR = "Unable to create account. Please try again later."
GENERIC_LOGIN_ERROR = "Invalid email or password."
GENERIC_AUTH_ERROR = "Authentication failed. Please try again."


class AuthService:
    def __init__(self):
        self.client = get_supabase()
        self.admin_client = get_supabase_admin()
        self.table = "users"
    
    def _sanitize_error(self, error: Exception, context: str) -> str:
        """Log the actual error but return a sanitized message"""
        error_str = str(error).lower()
        
        # Check for specific known errors and return user-friendly messages
        if "already registered" in error_str or "already exists" in error_str:
            return "An account with this email already exists."
        if "invalid email" in error_str:
            return "Please enter a valid email address."
        if "password" in error_str and ("weak" in error_str or "short" in error_str):
            return "Password must be at least 6 characters long."
        if "rate limit" in error_str:
            return "Too many attempts. Please try again later."
        
        # Log the actual error for debugging (server-side only)
        logger.error(f"{context}: {error}")
        
        return None  # Return None to use generic message
    
    async def register(
        self,
        email: str,
        password: str,
        full_name: Optional[str] = None
    ) -> dict:
        """Register a new user"""
        try:
            # Create auth user in Supabase
            auth_response = self.client.auth.sign_up({
                "email": email,
                "password": password
            })
            
            if not auth_response.user:
                raise ValidationException(GENERIC_REGISTRATION_ERROR)
            
            # Check if session exists (user might need email confirmation)
            if not auth_response.session:
                # User created but needs email confirmation
                return {
                    "user": {"email": email, "full_name": full_name},
                    "session": None,
                    "message": "Please check your email to confirm your account."
                }
            
            # Create user record in our database
            user_data = {
                "email": email,
                "full_name": full_name,
                "supabase_auth_id": str(auth_response.user.id)
            }
            
            result = self.admin_client.table(self.table).insert(user_data).execute()
            
            if not result.data:
                raise ValidationException(GENERIC_REGISTRATION_ERROR)
            
            return {
                "user": result.data[0],
                "session": auth_response.session
            }
            
        except ValidationException:
            raise
        except Exception as e:
            sanitized = self._sanitize_error(e, "Registration failed")
            raise ValidationException(sanitized or GENERIC_REGISTRATION_ERROR)
    
    async def login(self, email: str, password: str) -> dict:
        """Authenticate a user"""
        try:
            auth_response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if not auth_response.user:
                raise UnauthorizedException(GENERIC_LOGIN_ERROR)
            
            # Get user profile
            user_result = self.admin_client.table(self.table)\
                .select("*")\
                .eq("supabase_auth_id", str(auth_response.user.id))\
                .single()\
                .execute()
            
            return {
                "user": user_result.data,
                "session": auth_response.session
            }
            
        except UnauthorizedException:
            raise
        except Exception as e:
            # Log the actual error for debugging
            logger.error(f"Login failed: {e}")
            # Always return generic error to prevent user enumeration
            raise UnauthorizedException(GENERIC_LOGIN_ERROR)
    
    async def logout(self, access_token: str) -> bool:
        """Log out a user"""
        try:
            self.client.auth.sign_out()
            return True
        except Exception as e:
            logger.error(f"Logout failed: {e}")
            return False
    
    async def get_current_user(self, access_token: str) -> Optional[dict]:
        """Get the current authenticated user"""
        try:
            # Verify token with Supabase
            user_response = self.client.auth.get_user(access_token)
            
            if not user_response.user:
                return None
            
            # Get user profile
            user_result = self.admin_client.table(self.table)\
                .select("*")\
                .eq("supabase_auth_id", str(user_response.user.id))\
                .single()\
                .execute()
            
            return user_result.data
            
        except Exception as e:
            logger.error(f"Failed to get current user: {e}")
            return None
    
    async def get_user_by_id(self, user_id: UUID) -> Optional[dict]:
        """Get user by internal ID"""
        result = self.admin_client.table(self.table)\
            .select("*")\
            .eq("id", str(user_id))\
            .single()\
            .execute()
        
        return result.data if result.data else None
    
    async def update_profile(
        self,
        user_id: UUID,
        full_name: Optional[str] = None,
        avatar_url: Optional[str] = None
    ) -> dict:
        """Update user profile"""
        update_data = {}
        if full_name is not None:
            update_data["full_name"] = full_name
        if avatar_url is not None:
            update_data["avatar_url"] = avatar_url
        
        if not update_data:
            raise ValidationException("No fields to update")
        
        result = self.admin_client.table(self.table)\
            .update(update_data)\
            .eq("id", str(user_id))\
            .execute()
        
        if not result.data:
            raise ValidationException("Failed to update profile")
        
        return result.data[0]
