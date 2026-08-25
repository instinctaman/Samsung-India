from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel

ApprovalStatus = Literal["Approved", "Pending", "Rejected"]


class TraineeAdminIn(BaseModel):
    """Payload for POST /admin/trainees - the trainer/admin-side "register a
    new trainee" form. Mirrors NewTraineeInput on the frontend."""

    traineeUid: str
    profilePhoto: Optional[str] = None
    agencyId: Optional[str] = None
    fullName: str
    designation: str
    gender: str
    dob: Optional[date] = None
    primaryEmail: str
    primaryPhone: str
    altEmail: Optional[str] = None
    altPhone: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    zone: str
    region: str
    company: str
    requestedBy: str
    trainerId: str
    trainerName: str
    supervisorId: str
    supervisorName: str
    supervisorDesignation: Optional[str] = None
    joinedOn: Optional[date] = None
    jobStatus: str
    jobCity: Optional[str] = None
    jobPincode: Optional[str] = None
    resignedOn: Optional[date] = None
    username: str
    password: str


class TraineeAdminOut(BaseModel):
    traineeUid: str
    registeredAt: str
    approvalStatus: ApprovalStatus
    profilePhoto: Optional[str] = None
    agencyId: Optional[str] = None
    fullName: str
    designation: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    primaryEmail: str
    primaryPhone: str
    altEmail: Optional[str] = None
    altPhone: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    zone: Optional[str] = None
    region: Optional[str] = None
    company: Optional[str] = None
    requestedBy: Optional[str] = None
    trainerId: Optional[str] = None
    trainerName: Optional[str] = None
    supervisorId: Optional[str] = None
    supervisorName: Optional[str] = None
    supervisorDesignation: Optional[str] = None
    joinedOn: Optional[str] = None
    jobStatus: Optional[str] = None
    jobCity: Optional[str] = None
    jobPincode: Optional[str] = None
    resignedOn: Optional[str] = None
    username: Optional[str] = None
    updatedBy: Optional[str] = None
    updationOn: Optional[str] = None
    timestamp: Optional[str] = None
