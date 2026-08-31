export type TopPerformer = {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
};

export type LiveStudioQuestion = {
  id: string;
  qNumber: string;
  timerSecs: number;
  questionText: string;
  isBroadcasted?: boolean;
};

export type ProctoringLog = {
  timestamp: string;
  strikeNumber: number;
  reason: string;
  attemptsLeft: number;
};

export type ProctoringStatus = {
  flags: number;
  maxFlags: number;
  logs: ProctoringLog[];
};

export type ParticipantStatus = "PRESENT" | "ABSENT" | "PENDING";

export type ParticipantItem = {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  attendeeType: "ASSIGNED" | "NOT ALLOCATED";
  status: ParticipantStatus;
  inTime: string;
  outTime: string;
  proctoring?: ProctoringStatus;
};
