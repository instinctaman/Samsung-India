import { USE_MOCK_DATA } from "@/config/dataSource";
import { apiRequest } from "./client";
import * as mock from "./mockService";

export type TrainerProfile = {
  name: string;
  email: string;
  mobileNumber: string;
  altPhone: string;
  gender: string;
  dob: string;

  city: string;
  district: string;
  state: string;
  pincode: string;
  landmark: string;
  permanentSameAsLocal: boolean;

  aadharNumber: string;
  aadharFile: string;
  profilePicture: string;
  about: string;
  resume: string;
  otherDocument: string;

  facebookUsername: string;
  twitterUsername: string;
  instagramUsername: string;
  linkedinUsername: string;
  youtubeUsername: string;
  github: string;

  jobStatus: string;
  joinedOn: string;
  role: string;
  designation: string;
  salary: string;
  companyEmail: string;
  visitingCard: string;
  idCard: string;
  offerLetter: string;
  letterhead: string;
  promocode: string;

  username: string;
  password: string;
  remarks: string;
  agreedToTerms: boolean;
};

export function fetchTrainerProfile(token: string) {
  if (USE_MOCK_DATA) return mock.fetchTrainerProfile(token);
  return apiRequest<TrainerProfile>("/admin/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateTrainerProfile(token: string, payload: Partial<TrainerProfile>) {
  if (USE_MOCK_DATA) return mock.updateTrainerProfile(token, payload);
  return apiRequest<TrainerProfile>("/admin/profile", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export { ApiError } from "./client";
