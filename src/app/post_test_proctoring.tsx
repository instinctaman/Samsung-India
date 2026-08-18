import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCameraPermissions } from "expo-camera";

import { ProctoringScreen } from "@/components/proctoring";
import { isSessionLocked } from "@/components/proctoring/violations";

export default function PostTestProctoringScreen() {
  const router = useRouter();
  const { conferenceUid, suiteUid } = useLocalSearchParams<{
    conferenceUid: string;
    suiteUid: string;
  }>();

  useEffect(() => {
    const sessionKey = `${conferenceUid}_${suiteUid}`;
    if (
      isSessionLocked(sessionKey) ||
      isSessionLocked(conferenceUid ?? "")
    ) {
      router.replace({
        pathname: "/session_detail",
        params: {
          flow: "ATTENDANCE_RECORDED",
          postTest: "security_locked",
          violation: "locked",
        },
      });
    }
  }, [conferenceUid, suiteUid, router]);

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTest = async () => {
    if (loading) return;
    if (typeof document !== "undefined") {
      (document.activeElement as HTMLElement)?.blur?.();
    }
    setLoading(true);
    setError(null);


    try {
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          setError(
            "Camera permission is required for proctoring during the Post Test."
          );
          setLoading(false);
          return;
        }
      }

      // Transition to the timed Post Test
      router.replace({
        pathname: "/post_test",
        params: {
          conferenceUid: conferenceUid ?? "",
          suiteUid: suiteUid ?? "",
          proctored: "true",
        },
      });
    } catch {
      setError("Unable to initialize camera proctoring. Please try again.");
      setLoading(false);
    }
  };

  const handlePolicyPress = () => {
    Alert.alert(
      "Proctoring Policy",
      "During this assessment, automated proctoring monitors camera feed, face presence, multiple persons, and tab switching to ensure academic integrity. All data is encrypted and processed securely.",
      [{ text: "Understood" }]
    );
  };

  return (
    <ProctoringScreen
      onStartTest={handleStartTest}
      onPolicyPress={handlePolicyPress}
      loading={loading}
      error={error}
    />
  );
}
