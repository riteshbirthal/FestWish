from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

_supabase_client: Client = None
_supabase_admin_client: Client = None


def get_supabase() -> Client:
    """Get Supabase client with anon key (for authenticated user operations)"""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase_client


def get_supabase_admin() -> Client:
    """Get Supabase client with service role key (for admin operations)"""
    global _supabase_admin_client
    if _supabase_admin_client is None:
        _supabase_admin_client = create_client(
            settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
        )
    return _supabase_admin_client


async def check_database_connection() -> bool:
    """Check if database connection is working"""
    try:
        client = get_supabase_admin()
        result = client.table("relationships").select("id").limit(1).execute()
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False
