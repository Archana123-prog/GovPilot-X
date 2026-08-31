"""Supabase Authentication Service."""
from typing import Optional
from supabase.client import Client, ClientOptions
from .supabase import get_supabase_client


class SupabaseAuthService:
    """Handle user authentication via Supabase Auth."""

    def __init__(self):
        self.client: Client = get_supabase_client()

    async def signup(self, email: str, password: str, user_data: dict = None) -> dict:
        """
        Register a new user with Supabase Auth.
        
        Args:
            email: User email
            password: User password
            user_data: Additional user metadata (name, role, etc.)
        
        Returns:
            User object with session info
        """
        try:
            response = self.client.auth.sign_up(
                {
                    "email": email,
                    "password": password,
                    "options": {
                        "data": user_data or {}
                    }
                }
            )
            return {
                "success": True,
                "user": response.user,
                "session": response.session,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    async def login(self, email: str, password: str) -> dict:
        """
        Authenticate user with Supabase Auth.
        
        Args:
            email: User email
            password: User password
        
        Returns:
            Session with access token
        """
        try:
            response = self.client.auth.sign_in_with_password(
                {
                    "email": email,
                    "password": password,
                }
            )
            return {
                "success": True,
                "user": response.user,
                "session": response.session,
                "access_token": response.session.access_token,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    async def verify_token(self, token: str) -> Optional[dict]:
        """
        Verify JWT token from Supabase.
        
        Args:
            token: JWT access token
        
        Returns:
            User data if token is valid, None otherwise
        """
        try:
            response = self.client.auth.get_user(token)
            return {
                "id": response.user.id,
                "email": response.user.email,
                "user_metadata": response.user.user_metadata,
            }
        except Exception:
            return None

    async def refresh_session(self, refresh_token: str) -> dict:
        """
        Refresh an expired session.
        
        Args:
            refresh_token: Refresh token from previous session
        
        Returns:
            New session with fresh access token
        """
        try:
            response = self.client.auth.refresh_session(
                {"refresh_token": refresh_token}
            )
            return {
                "success": True,
                "session": response.session,
                "access_token": response.session.access_token,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    async def logout(self, session_token: str = None) -> bool:
        """
        Logout user from Supabase.
        
        Args:
            session_token: Optional current session token
        
        Returns:
            True if logout successful
        """
        try:
            self.client.auth.sign_out()
            return True
        except Exception:
            return False

    async def update_user(self, token: str, updates: dict) -> dict:
        """
        Update user metadata/profile.
        
        Args:
            token: JWT access token
            updates: Dict with user data to update
        
        Returns:
            Updated user object
        """
        try:
            response = self.client.auth.update_user(
                token,
                {"user_metadata": updates}
            )
            return {
                "success": True,
                "user": response.user,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    async def send_reset_email(self, email: str) -> dict:
        """Send password reset email."""
        try:
            self.client.auth.reset_password_for_email(email)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}


# Global instance
supabase_auth = SupabaseAuthService()
