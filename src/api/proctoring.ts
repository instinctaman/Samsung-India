import { SecurityViolationType } from "@/components/proctoring/violations";

export type FaceCheckResult = {
  faceCount: number;
  violation?: SecurityViolationType | null;
  confidence?: number;
};

export { checkFrameForFaces } from "@/api/mockService";
export { ApiError } from "@/api/client";
