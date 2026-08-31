"""Document service for managing pilot agreements, evidence uploads, and validation reports."""
from typing import Dict, Any, Optional


class DocumentService:
    @staticmethod
    def generate_storage_path(doc_type: str, entity_id: str, filename: str) -> str:
        """
        Generate standard Firebase Storage path for documents.
        Supported doc_types: pilot_agreements, milestone_evidence, validation_reports, evaluations, startup_documents
        """
        clean_filename = filename.replace(" ", "_")
        return f"{doc_type}/{entity_id}/{clean_filename}"

    @staticmethod
    def validate_file_metadata(content_type: str, size_bytes: int) -> Dict[str, Any]:
        """Validate uploaded file content type and size limit."""
        allowed_types = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "image/png",
            "image/jpeg",
        ]
        max_size = 25 * 1024 * 1024  # 25 MB

        if content_type not in allowed_types:
            return {"valid": False, "error": f"Invalid file type {content_type}. Allowed: PDF, DOCX, PNG, JPG"}
        if size_bytes > max_size:
            return {"valid": False, "error": "File size exceeds 25MB limit"}

        return {"valid": True, "error": None}
