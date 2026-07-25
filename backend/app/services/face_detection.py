import httpx

from app.core.config import settings

VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate"


async def count_faces(image_base64: str) -> int:
    if not settings.FACE_DETECTION_API_KEY:
        raise RuntimeError("FACE_DETECTION_API_KEY is not configured")

    payload = {
        "requests": [
            {
                "image": {"content": image_base64},
                "features": [{"type": "FACE_DETECTION", "maxResults": 10}],
            }
        ]
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            VISION_API_URL,
            params={"key": settings.FACE_DETECTION_API_KEY},
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    result = data["responses"][0]
    if "error" in result:
        raise httpx.HTTPError(result["error"].get("message", "Vision API error"))

    return len(result.get("faceAnnotations", []))
