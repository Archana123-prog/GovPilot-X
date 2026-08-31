"""Supabase Storage service — replaces Firebase Storage for document management."""
import os
import httpx
from typing import Optional


class SupabaseStorageService:
    """
    Handles document uploads and signed URL generation via Supabase Storage.
    Used for: pilot agreements, milestone evidence, validation reports.
    """

    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
        self.service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.bucket = os.getenv("SUPABASE_STORAGE_BUCKET", "govpilot-documents")

    @property
    def _headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.service_role_key}",
            "apikey": self.service_role_key,
        }

    def get_public_url(self, storage_path: str) -> str:
        """Construct the public Supabase Storage URL for a given object path."""
        return f"{self.supabase_url}/storage/v1/object/public/{self.bucket}/{storage_path}"

    async def get_signed_url(self, storage_path: str, expires_in: int = 3600) -> str:
        """Generate a signed (temporary) URL for a private file."""
        url = f"{self.supabase_url}/storage/v1/object/sign/{self.bucket}/{storage_path}"
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                url,
                headers=self._headers,
                json={"expiresIn": expires_in},
            )
            resp.raise_for_status()
            return resp.json().get("signedURL", "")

    async def delete_file(self, storage_path: str) -> bool:
        """Delete a file from Supabase Storage."""
        url = f"{self.supabase_url}/storage/v1/object/{self.bucket}/{storage_path}"
        async with httpx.AsyncClient() as client:
            resp = await client.delete(url, headers=self._headers)
            return resp.status_code == 200

    def parse_path_from_url(self, url: str) -> Optional[str]:
        """Extract internal storage path from a Supabase Storage public URL."""
        marker = f"/object/public/{self.bucket}/"
        if marker in url:
            return url.split(marker)[1].split("?")[0]
        return None
