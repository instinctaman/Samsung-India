from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class TraineeRegister(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: int
    email: EmailStr
    gender: Optional[str] = None
    designation: Optional[str] = None
    employee_id: Optional[str] = None
    supervisorName: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None


class TraineeLogin(BaseModel):
    phone: int


class TraineeOut(BaseModel):
    id: int
    traineeUid: str
    name: str
    phone: int
    email: str
    gender: Optional[str] = None
    designation: Optional[str] = None
    employee_id: Optional[str] = None
    supervisorName: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    trainee: TraineeOut
