from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # Network settings used by the local Uvicorn development server. Binding
    # to all interfaces lets phones on the same Wi-Fi reach this machine.
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000

    ALLOW_ATTENDANCE_RETEST: bool = False

    # Google Cloud Vision API key used for proctoring face-count checks
    # during assessments. Leave blank to disable server-side face checks.
    FACE_DETECTION_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
