/**
 * Centralized security violation type definitions.
 * Used by ProctoringPanel, SecurityViolationModal, and post_test.tsx.
 */

export const SECURITY_VIOLATIONS = {
  SIDE_LOOK: "SIDE-LOOK DETECTED",
  MULTIPLE_PEOPLE: "MULTIPLE PEOPLE DETECTED",
  NO_FACE: "NO FACE DETECTED",
  HEAD_TILT: "EXCESSIVE HEAD TILT",
  TAB_SWITCH: "TAB SWITCH DETECTED",
} as const;

export type SecurityViolationType =
  (typeof SECURITY_VIOLATIONS)[keyof typeof SECURITY_VIOLATIONS];

export const VIOLATION_FOOTER_LABELS: Record<SecurityViolationType, string> = {
  [SECURITY_VIOLATIONS.SIDE_LOOK]: "SIDE-LOOK",
  [SECURITY_VIOLATIONS.MULTIPLE_PEOPLE]: "MULTIPLE PEOPLE\nDETECTED",
  [SECURITY_VIOLATIONS.NO_FACE]: "NO FACE\nDETECTED",
  [SECURITY_VIOLATIONS.HEAD_TILT]: "EXCESSIVE HEAD\nTILT",
  [SECURITY_VIOLATIONS.TAB_SWITCH]: "TAB SWITCH\nVIOLATION",
};

export const MAX_PROCTORING_WARNINGS = 3;

// ─── Global session violation tracker ───────────────────────────────────────
// Persists the violation count per session key so that re-renders or navigations
// do not reset the count accidentally.
const sessionViolations: Record<string, { count: number; history: SecurityViolationType[] }> = {};

export function getSessionViolationCount(sessionId: string): number {
  return sessionViolations[sessionId]?.count ?? 0;
}

export function recordSessionViolation(
  sessionId: string,
  violationType: SecurityViolationType,
): number {
  if (!sessionViolations[sessionId]) {
    sessionViolations[sessionId] = { count: 0, history: [] };
  }
  sessionViolations[sessionId].count = Math.min(
    sessionViolations[sessionId].count + 1,
    MAX_PROCTORING_WARNINGS,
  );
  sessionViolations[sessionId].history.push(violationType);
  return sessionViolations[sessionId].count;
}

export function resetSessionViolations(sessionId: string): void {
  delete sessionViolations[sessionId];
}
