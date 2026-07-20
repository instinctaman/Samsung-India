import { apiRequest } from "./client";

export type AttendanceRecord = {
  status: string;
  markedOn: string | null;
};

export function checkIn(token: string, conferenceUid: string) {
  return apiRequest<AttendanceRecord>("/attendance/check-in", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ conferenceUid }),
  });
}

export { ApiError } from "./client";
