from typing import Optional

from pydantic import BaseModel


class TrainerProfileOut(BaseModel):
    """Matches the frontend's TrainerProfile type
    (src/api/trainerProfile.ts) field-for-field. Backed by the real
    `admin` table for an Admin-model login (nearly every field has a
    matching column there) and by the much smaller real `agencyteam`
    table for an AgencyTeam-model login (see `_agency_to_profile` in
    routers/trainer.py for which fields are actually real there vs
    blank placeholders)."""

    name: str
    email: str
    mobileNumber: str
    altPhone: str
    gender: str
    dob: str

    city: str
    district: str
    state: str
    pincode: str
    landmark: str
    # No backing column on either table (see below) - always true, PATCH
    # accepts but doesn't persist it.
    permanentSameAsLocal: bool

    aadharNumber: str
    aadharFile: str
    profilePicture: str
    about: str
    resume: str
    otherDocument: str

    facebookUsername: str
    twitterUsername: str
    instagramUsername: str
    linkedinUsername: str
    youtubeUsername: str
    github: str

    jobStatus: str
    joinedOn: str
    role: str
    designation: str
    salary: str
    companyEmail: str
    visitingCard: str
    idCard: str
    offerLetter: str
    letterhead: str
    promocode: str

    username: str
    # Never populated from the real hashed value - write-only on PATCH.
    password: str
    remarks: str
    agreedToTerms: bool


class TrainerProfileUpdate(BaseModel):
    """Same fields as TrainerProfileOut, all optional - a PATCH only ever
    sends one section's worth (see PROFILE_SECTION_FIELDS on the
    frontend), and `model_dump(exclude_unset=True)` is used to apply only
    what was actually sent."""

    name: Optional[str] = None
    email: Optional[str] = None
    mobileNumber: Optional[str] = None
    altPhone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None

    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    landmark: Optional[str] = None
    permanentSameAsLocal: Optional[bool] = None

    aadharNumber: Optional[str] = None
    aadharFile: Optional[str] = None
    profilePicture: Optional[str] = None
    about: Optional[str] = None
    resume: Optional[str] = None
    otherDocument: Optional[str] = None

    facebookUsername: Optional[str] = None
    twitterUsername: Optional[str] = None
    instagramUsername: Optional[str] = None
    linkedinUsername: Optional[str] = None
    youtubeUsername: Optional[str] = None
    github: Optional[str] = None

    jobStatus: Optional[str] = None
    joinedOn: Optional[str] = None
    role: Optional[str] = None
    designation: Optional[str] = None
    salary: Optional[str] = None
    companyEmail: Optional[str] = None
    visitingCard: Optional[str] = None
    idCard: Optional[str] = None
    offerLetter: Optional[str] = None
    letterhead: Optional[str] = None
    promocode: Optional[str] = None

    username: Optional[str] = None
    password: Optional[str] = None
    remarks: Optional[str] = None
    agreedToTerms: Optional[bool] = None
