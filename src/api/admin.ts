import { apiRequest } from "./client";
import { USE_MOCK_DATA } from "./mockConfig";
import * as mock from "./mockService";

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
  if (USE_MOCK_DATA) return mock.loginAdmin(username, password);
  return apiRequest<AdminAuthSession>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export { ApiError } from "./client";
