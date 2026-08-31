"""Firebase Storage integration boundary for document evidence and report URLs."""
import os
from typing import Optional


class FirebaseStorageService:
    def __init__(self):
        self.bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET", "govpilot-x.appspot.com")

    def get_public_url(self, storage_path: str) -> str:
        """Construct the Firebase Storage download URL for a given object path."""
        encoded_path = storage_path.replace("/", "%2F")
        return f"https://firebasestorage.googleapis.com/v0/b/{self.bucket_name}/o/{encoded_path}?alt=media"

    def parse_path_from_url(self, url: str) -> Optional[str]:
        """Extract internal storage path from a Firebase Storage URL."""
        marker = f"/b/{self.bucket_name}/o/"
        if marker in url:
            path_part = url.split(marker)[1].split("?")[0]
            return path_part.replace("%2F", "/")
        return None
