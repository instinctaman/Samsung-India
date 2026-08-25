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

    # Comma-separated list of origins allowed to call this API from a
    # browser (CORS). Only relevant for `expo start --web` / browser
    # clients - native Expo Go / dev-client requests don't send an Origin
    # header, so this never affects phone testing. Add your machine's LAN
    # IP (e.g. "http://192.168.1.23:8081") if you test the web build from
    # another device. Set to "*" only for throwaway local debugging.
    ALLOWED_ORIGINS: str = "http://localhost:8081,http://localhost:19006,http://localhost:8082"

    class Config:
        env_file = ".env"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


settings = Settings()
