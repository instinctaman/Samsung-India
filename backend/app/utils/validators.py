from app.core.exceptions import bad_request
from app.core.media import ALLOWED_IMAGE_CONTENT_TYPES, MAX_UPLOAD_BYTES


def validate_image_upload(content_type: str | None, contents: bytes, *, size_error_detail: str) -> str:
    """Shared JPEG/PNG/WEBP content-type + 5MB size check used by every
    photo-upload endpoint (trainee profile photo, secure check-in photo).
    Returns the file extension to save with. `size_error_detail` lets each
    call site keep its own wording (e.g. "Photo" vs "Image")."""
    extension = ALLOWED_IMAGE_CONTENT_TYPES.get(content_type or "")
    if not extension:
        raise bad_request("Only JPEG, PNG or WEBP images are allowed")

    if len(contents) > MAX_UPLOAD_BYTES:
        raise bad_request(size_error_detail)

    return extension
