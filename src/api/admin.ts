// Types used by useAuth.tsx — must remain exported from this file.
export type AdminAccount = {
  username: string;
  name: string;
  role: string;
};

export type AdminAuthSession = {
  access_token: string;
  token_type: string;
  admin: AdminAccount;
};

// Demo implementation — no network calls.
export { loginAdmin } from "@/api/mockService";
export { ApiError } from "@/api/client";

