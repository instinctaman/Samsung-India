import { API_BASE_URL } from "@/constants/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Couldn't reach the server. Check your connection and try again.",
      0
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : "Something went wrong. Please try again.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}
