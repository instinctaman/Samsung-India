from pydantic import BaseModel


class FaceCheckRequest(BaseModel):
    image: str  # base64-encoded JPEG, no data URI prefix


class FaceCheckResult(BaseModel):
    faceCount: int
