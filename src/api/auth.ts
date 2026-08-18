// Field names mirror the `trainee` table from the legacy database dump.
// Types are used by useAuth.tsx and multiple screens — must remain exported.
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
  profilePhoto: string | null;
  status: string;
  workZone?: string | null;
  departmentSupport?: string | null;
  department?: string | null;
  sessionCode?: string | null;
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

export type UpdateProfilePayload = Partial<{
  name: string;
  phone: string;
  email: string;
  gender: string;
  designation: string;
  employee_id: string;
  supervisorName: string;
  state: string;
  district: string;
}>;

export type PickedImage = {
  uri: string;
  name: string;
  type: string;
};

// Demo implementations — no network calls.
export {
  registerTrainee,
  loginTrainee,
  updateTrainee,
  uploadTraineePhoto,
} from "@/api/mockService";
export { ApiError } from "@/api/client";

