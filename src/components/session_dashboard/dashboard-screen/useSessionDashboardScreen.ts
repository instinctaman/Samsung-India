import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Share } from "react-native";

import {
  SessionDashboard,
  advanceModule,
  endTraining,
  fetchSessionDashboard,
  markAttendance,
  startTraining,
} from "@/api/training";
import { DashboardTab } from "@/components/trainer/dashboard/DashboardBottomNav";
import { useAuth } from "@/hooks/useAuth";
import { formatGeneratedTimestamp } from "./formatting";
import { TrainerCheckInPhoto } from "./TrainerCheckInModal";

export function useSessionDashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ conferenceUid?: string }>();
  const conferenceUid = params.conferenceUid || "CONF25456581";
  const { adminToken } = useAuth();

  const [data, setData] = useState<SessionDashboard | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [bottomTab, setBottomTab] = useState<DashboardTab>("plan");
  const [moreOpen, setMoreOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [startedForUid, setStartedForUid] = useState(conferenceUid);

  if (startedForUid !== conferenceUid) {
    setStartedForUid(conferenceUid);
    setHasStarted(false);
  }

  const loadData = useCallback(
    async (mode: "load" | "refresh" | "silent" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);
      else if (mode === "load") setLoading(true);

      try {
        const res = await fetchSessionDashboard(adminToken, conferenceUid);
        setData(res);
        setGeneratedAt(new Date());
      } catch {
        // Fallback / gracefully keep state
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else if (mode === "load") setLoading(false);
      }
    },
    [adminToken, conferenceUid],
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
      const interval = setInterval(() => loadData("silent"), 5000);
      return () => clearInterval(interval);
    }, [loadData]),
  );

  const handleCopyLink = async () => {
    try {
      // Same deep link the QR encodes - opens the app on the join screen
      // (samsungindia:// scheme, see app.json). Tapping it in a chat app
      // on an Android device with the app installed opens it directly.
      await Share.share({ message: `Join the training session: samsungindia://join/${conferenceUid}` });
    } catch {
      // Ignored
    }
  };

  const handleStartSession = () => {
    setShowCheckInModal(true);
  };

  const handleConfirmStartSession = async (photo: TrainerCheckInPhoto) => {
    if (!adminToken) return;
    setShowCheckInModal(false);
    try {
      await startTraining(adminToken, conferenceUid, photo);
      // Only flip to the "started" view once the backend actually confirms
      // it - e.g. an unapproved session gets rejected with a 403, and the
      // dashboard shouldn't show as live when nothing actually started.
      setHasStarted(true);
      loadData("silent");
    } catch {
      // Fallback / gracefully keep state - no blocking alert on failure.
    }
  };

  const handleMarkAttendance = async (traineeUid: string, status: "Present" | "Absent") => {
    if (!adminToken) return;
    try {
      // The endpoint returns a fresh dashboard, so we can update in place
      // without waiting for the next poll.
      const fresh = await markAttendance(adminToken, conferenceUid, traineeUid, status);
      setData(fresh);
    } catch {
      // Fallback / gracefully keep state.
    }
  };

  const handleAdvanceModule = async () => {
    if (!adminToken) return;
    try {
      await advanceModule(adminToken, conferenceUid);
      loadData("silent");
    } catch {
      // Fallback / gracefully keep state.
    }
  };

  const handleEndSession = () => {
    Alert.alert("End Quiz", "Do you want to end quiz?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          if (adminToken) {
            try {
              await endTraining(adminToken, conferenceUid);
            } catch {
              // Fallback / gracefully keep state
            }
          }
          router.replace("/trainer_dashboard");
        },
      },
    ]);
  };

  const handleBottomNavSelect = (tab: DashboardTab) => {
    setBottomTab(tab);
    if (tab === "home") {
      router.replace("/trainer_dashboard");
    } else if (tab === "plan") {
      router.push("/sessions");
    } else if (tab === "profile") {
      router.push("/trainer_profile");
    } else if (tab === "more") {
      setMoreOpen(true);
    }
  };

  const isSessionClosed = data?.conferenceStatus === "Completed";
  // The backend is the source of truth for whether the session is live -
  // `hasStarted` is only an optimistic local flag so the UI flips the
  // instant the trainer taps Start (before the next poll lands). Without
  // this, navigating away and back showed "Start Session" / "Scheduled"
  // again even though the session was already Ongoing.
  const backendLive = data?.conferenceStatus === "Ongoing" || data?.conferenceStatus === "Live";
  // The join QR is only meaningful for a session that's actually running -
  // hide "Show QR" until Start Session, and again once it's closed.
  const isLive = !isSessionClosed && (hasStarted || backendLive);
  // A closed session already ran to completion, so its Audience Breakdown /
  // Assessment / Execution Flow etc. should render the same populated view as
  // an in-progress session instead of the "not started yet" empty state.
  const showSessionData = hasStarted || backendLive || isSessionClosed;
  // Gates the header's Start Session button - an unapproved session would
  // just bounce off the backend's 403 (see start_training), so hide the
  // action instead of letting the trainer hit a dead-end "not approved" alert.
  const isApproved = data ? data.approvalStatus === "Approved" : true;

  return {
    router,
    conferenceUid,
    data,
    generatedAt: generatedAt ? formatGeneratedTimestamp(generatedAt) : undefined,
    loading,
    refreshing,
    showQR,
    setShowQR,
    showCheckInModal,
    setShowCheckInModal,
    bottomTab,
    moreOpen,
    setMoreOpen,
    loadData,
    handleCopyLink,
    handleStartSession,
    handleConfirmStartSession,
    handleMarkAttendance,
    handleAdvanceModule,
    handleEndSession,
    handleBottomNavSelect,
    isSessionClosed,
    showSessionData,
    isLive,
    isApproved,
  };
}
