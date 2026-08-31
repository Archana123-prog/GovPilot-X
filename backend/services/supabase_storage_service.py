"""Supabase Storage Service for file uploads."""
from typing import Optional
from .supabase import get_supabase_client


class SupabaseStorageService:
    """Handle file uploads and management via Supabase Storage."""

    def __init__(self):
        self.client = get_supabase_client()
        self.bucket_name = "govpilot-files"  # Create this bucket in Supabase

    async def upload_file(
        self,
        file_path: str,
        file_content: bytes,
        folder: str = "documents",
    ) -> dict:
        """
        Upload a file to Supabase Storage.
        
        Args:
            file_path: Path/name for the file
            file_content: File bytes
            folder: Folder in bucket (documents, avatars, etc)
        
        Returns:
            Upload result with public URL
        """
        try:
            # Create full path: folder/file_path
            full_path = f"{folder}/{file_path}"
            
            # Upload file
            response = self.client.storage.from_(self.bucket_name).upload(
                full_path,
                file_content,
            )
            
            # Get public URL
            public_url = self.client.storage.from_(self.bucket_name).get_public_url(
                full_path
            )
            
            return {
                "success": True,
                "path": full_path,
                "public_url": public_url,
                "size": len(file_content),
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    async def delete_file(self, file_path: str) -> bool:
        """Delete a file from Supabase Storage."""
        try:
            self.client.storage.from_(self.bucket_name).remove([file_path])
            return True
        except Exception:
            return False

    async def get_public_url(self, file_path: str) -> str:
        """Get public URL for a file."""
        try:
            url = self.client.storage.from_(self.bucket_name).get_public_url(file_path)
            return url
        except Exception:
            return ""


# Global instance
supabase_storage = SupabaseStorageService()
