import { apiRequest } from "./client";

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

export function loginAdmin(username: string, password: string) {
  return apiRequest<AdminAuthSession>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export { ApiError } from "./client";
