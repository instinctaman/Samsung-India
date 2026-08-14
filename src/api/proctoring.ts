export type FaceCheckResult = {
  faceCount: number;
};

// Demo implementation — always returns faceCount: 1 (no warnings in demo mode).
export { checkFrameForFaces } from "@/api/mockService";
export { ApiError } from "@/api/client";

