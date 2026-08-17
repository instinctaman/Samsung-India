export type TopPerformer = {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
};

export type ExecutionFlowRow = {
  id: string;
  moduleName: string;
  startTime: string;
  endTime: string;
  duration: string;
};

export type LiveStudioQuestion = {
  id: string;
  qNumber: string;
  timerSecs: number;
  questionText: string;
  isBroadcasted?: boolean;
};

export type ParticipantItem = {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  attendeeType: "REGISTERED" | "GUEST (UNREGISTERED)";
  status: "PRESENT" | "ABSENT";
  inTime: string;
  outTime: string;
};
