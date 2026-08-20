import { apiRequest, apiUpload } from "./client";
import { USE_MOCK_DATA } from "./mockConfig";
import * as mock from "./mockService";

export type AttendanceRecord = {
  status: string;
  markedOn: string | null;
  distanceMeters: number | null;
};

export function checkIn(token: string, conferenceUid: string) {
  if (USE_MOCK_DATA) return mock.checkIn(token, conferenceUid);
  return apiRequest<AttendanceRecord>("/attendance/check-in", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ conferenceUid }),
  });
}

export type VerifyLocationResult = {
  distanceMeters: number | null;
  withinRadius: boolean | null;
  venueLabel: string | null;
};

export function verifyLocation(token: string, conferenceUid: string, latitude: number, longitude: number) {
  if (USE_MOCK_DATA) return mock.verifyLocation(token, conferenceUid, latitude, longitude);
  return apiRequest<VerifyLocationResult>("/attendance/verify-location", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ conferenceUid, latitude, longitude }),
  });
}

export type SecureCheckInPayload = {
  conferenceUid: string;
  latitude: number;
  longitude: number;
  photo: { uri: string; name: string; type: string };
};

export function secureCheckIn(token: string, payload: SecureCheckInPayload) {
  if (USE_MOCK_DATA) return mock.secureCheckIn(token, payload);
  const formData = new FormData();
  formData.append("conferenceUid", payload.conferenceUid);
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));
  formData.append("photo", {
    uri: payload.photo.uri,
    name: payload.photo.name,
    type: payload.photo.type,
  } as unknown as Blob);

  return apiUpload<AttendanceRecord>("/attendance/check-in/secure", formData, token);
}

export { ApiError } from "./client";
