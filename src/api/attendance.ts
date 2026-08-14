export type AttendanceRecord = {
  status: string;
  markedOn: string | null;
  distanceMeters: number | null;
};

export type VerifyLocationResult = {
  distanceMeters: number | null;
  withinRadius: boolean | null;
  venueLabel: string | null;
};

export type SecureCheckInPayload = {
  conferenceUid: string;
  latitude: number;
  longitude: number;
  photo: { uri: string; name: string; type: string };
};

// Demo implementations — no network calls.
export { checkIn, verifyLocation, secureCheckIn } from "@/api/mockService";
export { ApiError } from "@/api/client";

