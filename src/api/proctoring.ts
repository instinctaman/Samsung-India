import { apiRequest } from "./client";

export type FaceCheckResult = {
  faceCount: number;
};

export function checkFrameForFaces(token: string, imageBase64: string) {
  return apiRequest<FaceCheckResult>("/proctoring/check-frame", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ image: imageBase64 }),
  });
}

export { ApiError } from "./client";
