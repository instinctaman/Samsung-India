import { apiRequest } from "./client";

// Field names mirror the `trainee` table from the legacy database dump.
export type Trainee = {
  id: number;
  traineeUid: string;
  name: string;
  phone: number;
  email: string;
  gender: string | null;
  designation: string | null;
  employee_id: string | null;
  supervisorName: string | null;
  state: string | null;
  district: string | null;
  status: string;
};

export type AuthSession = {
  access_token: string;
  token_type: string;
  trainee: Trainee;
};

export type RegisterPayload = {
  name: string;
  phone: string;
  email: string;
  gender?: string;
  designation?: string;
  employee_id?: string;
  supervisorName?: string;
  state?: string;
  district?: string;
};

export function registerTrainee(payload: RegisterPayload) {
  return apiRequest<Trainee>("/trainees/register", {
    method: "POST",
    body: JSON.stringify({ ...payload, phone: Number(payload.phone) }),
  });
}

export function loginTrainee(phone: string) {
  return apiRequest<AuthSession>("/trainees/login", {
    method: "POST",
    body: JSON.stringify({ phone: Number(phone) }),
  });
}

export { ApiError } from "./client";
