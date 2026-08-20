import { USE_MOCK_DATA } from "@/config/dataSource";
import { apiRequest } from "./client";
import * as mock from "./mockService";
import { SecurityViolationType } from "@/components/proctoring/violations";

export type FaceCheckResult = {
  faceCount: number;
  violation?: SecurityViolationType | null;
  confidence?: number;
};

 function checkFrameForFaces(token: string, imageBase64: string) {
  if (USE_MOCK_DATA) return mock.checkFrameForFaces(token, imageBase64);
  return apiRequest<FaceCheckResult>("/proctoring/check-frame", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ image: imageBase64 }),
  });
}

export { ApiError } from "./client";
export { checkFrameForFaces } from "@/api/mockService";

