import { API_BASE_URL } from "@/constants/api";

export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("file://") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const cleanBase = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
