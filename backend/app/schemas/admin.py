from pydantic import BaseModel


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminOut(BaseModel):
    username: str
    name: str
    role: str


class AdminAuthSession(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminOut
