from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.media import MEDIA_ROOT
from app.database.database import Base, engine

# Import all models
from app.models import *
from app.routers.admin import router as admin_router
from app.routers.assessment import router as assessment_router
from app.routers.attendance import router as attendance_router
from app.routers.proctoring import router as proctoring_router
from app.routers.session import router as session_router
from app.routers.trainee import router as trainee_router
from app.routers.training import router as training_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Samsung India API",
    version="1.0.0",
)

MEDIA_ROOT.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=MEDIA_ROOT), name="media")

# Origins allowed to call this API from a browser (native app requests are
# unaffected - see ALLOWED_ORIGINS in core/config.py). Configure via the
# ALLOWED_ORIGINS env var; defaults to common local Expo web dev ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trainee_router)
app.include_router(session_router)
app.include_router(attendance_router)
app.include_router(assessment_router)
app.include_router(proctoring_router)
app.include_router(admin_router)
app.include_router(training_router)


@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Samsung India Backend Running 🚀",
    }