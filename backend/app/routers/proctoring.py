import httpx
from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import get_current_trainee
from app.models.trainee import Trainee
from app.schemas.proctoring import FaceCheckRequest, FaceCheckResult
from app.services.face_detection import count_faces

router = APIRouter(prefix="/proctoring", tags=["proctoring"])


@router.post("/check-frame", response_model=FaceCheckResult)
async def check_frame(
    payload: FaceCheckRequest,
    trainee: Trainee = Depends(get_current_trainee),
):
    try:
        face_count = await count_faces(payload.image)
    except RuntimeError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Face detection is not configured on the server",
        )
    except httpx.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Couldn't reach the face detection service",
        )

    return FaceCheckResult(faceCount=face_count)
