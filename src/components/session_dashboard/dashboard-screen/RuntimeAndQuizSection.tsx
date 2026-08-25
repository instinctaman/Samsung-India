import { Fragment } from "react";

import ActiveQuizModuleCard from "@/components/session_dashboard/ActiveQuizModuleCard";
import SessionRuntimeCard from "@/components/session_dashboard/SessionRuntimeCard";

type RuntimeAndQuizSectionProps = {
  activeModuleId?: string | number | null;
  onEndQuiz: () => void;
};

export default function RuntimeAndQuizSection({ activeModuleId, onEndQuiz }: RuntimeAndQuizSectionProps) {
  return (
    <Fragment>
      <SessionRuntimeCard
        actualRuntime="4h 42m 46s"
        assignedTime="00h 42m"
        consumedTime="04h 22m"
        timeUsedPercent={92}
        moduleCompletionPercent={50}
      />

      <ActiveQuizModuleCard
        moduleName={activeModuleId ? `Quiz Module (${activeModuleId})` : "Quiz Module\n(Classroom Quiz Smartphone)"}
        targetedQps="Targeted 24 QPs"
        timer="01:20:47"
        onEndQuiz={onEndQuiz}
      />
    </Fragment>
  );
}
