import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Linking, Pressable, RefreshControl, ScrollView, Share, StyleSheet, TextInput, View } from "react-native";
import type { LayoutChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import QRCode from "react-native-qrcode-svg";

import AppText from "@/components/ui/AppText";
import AppFooter from "@/components/ui/AppFooter";
import AppModal from "@/components/ui/AppModal";
import { DonutChart, GaugeChart } from "@/components/trainer/charts";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/constants/api";
import {
  ApiError,
  AuditLogEntry,
  ExecutionFlowItem,
  SessionDashboard,
  TraineeRow,
  advanceModule,
  endTraining,
  fetchSessionDashboard,
  markAttendance,
  resetAttendance,
  startTraining,
} from "@/api/training";

const STATUS_PRESENTATION: Record<string, { label: string; color: string }> = {
  Scheduled: { label: "Scheduled", color: Colors.mainColour1 },
  Ongoing: { label: "Live", color: Colors.success },
  Completed: { label: "Completed", color: Colors.gray600 },
};

const FLOW_PRESENTATION: Record<ExecutionFlowItem["status"], { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  Completed: { icon: "checkmark-circle", color: Colors.success },
  Running: { icon: "radio-button-on", color: Colors.danger },
  Pending: { icon: "ellipse-outline", color: Colors.gray400 },
};

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(Math.floor(totalSeconds), 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function formatRuntime(totalSeconds: number) {
  const seconds = Math.max(Math.floor(totalSeconds), 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
}

function timeOnly(value: string | null) {
  if (!value) return "--";
  const parts = value.split(" ");
  return parts[parts.length - 1]?.slice(0, 5) ?? value;
}

const AVATAR_COLORS = [Colors.mainColour1, Colors.success, "#F59E0B", "#8B5CF6", "#EC4899", "#0EA5E9"];

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

function avatarColorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Floating live attendance bubble - bobs gently up and down to draw the eye
// while the session is live, instead of sitting still like the rest of the
// header chrome.
function LiveAttendanceBadge({ present, total, onPress }: { present: number; total: number; onPress: () => void }) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Pressable style={styles.liveBadge} onPress={onPress} hitSlop={6}>
        <Ionicons name="people" size={14} color={Colors.white} />
        <AppText style={styles.liveBadgeText} color={Colors.white} weight={FontWeight.semiBold}>
          {present}/{total}
        </AppText>
        <View style={styles.liveBadgeTail} />
      </Pressable>
    </Animated.View>
  );
}

export default function SessionDashboardScreen() {
  const router = useRouter();
  const { adminToken } = useAuth();
  const { conferenceUid } = useLocalSearchParams<{ conferenceUid: string }>();

  const [dashboard, setDashboard] = useState<SessionDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTab, setSheetTab] = useState<"flow" | "audit">("flow");
  const [rowActionUid, setRowActionUid] = useState<string | null>(null);
  const [liveRuntime, setLiveRuntime] = useState<number | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const traineeListY = useRef(0);
  const scrollToTraineeList = () => {
    scrollRef.current?.scrollTo({ y: Math.max(traineeListY.current - 12, 0), animated: true });
  };

  const loadDashboard = useCallback(
    async (mode: "load" | "refresh" | "silent" = "load") => {
      if (!adminToken || !conferenceUid) return;
      if (mode === "refresh") setRefreshing(true);
      else if (mode === "load") setLoading(true);
      if (mode !== "silent") setError(null);
      try {
        const data = await fetchSessionDashboard(adminToken, conferenceUid);
        setDashboard(data);
        setGeneratedAt(new Date());
      } catch (err) {
        // A silent background poll shouldn't flash an error over a working
        // dashboard just because of a transient network hiccup.
        if (mode !== "silent") {
          setError(err instanceof ApiError ? err.message : "Couldn't load this session.");
        }
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else if (mode === "load") setLoading(false);
      }
    },
    [adminToken, conferenceUid]
  );

  // Poll quietly while this screen is focused so attendance marks, test
  // submissions and module progress from trainees show up live - the
  // trainer never has to pull-to-refresh mid-session. Stops on blur.
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
      const interval = setInterval(() => loadDashboard("silent"), 10000);
      return () => clearInterval(interval);
    }, [loadDashboard])
  );

  // Runtime is server-authoritative (`actualStartedAt`/`actualEndedAt`), but
  // while the session is live we tick a local copy every second between
  // fetches so it doesn't sit frozen at whatever value the last fetch had.
  useEffect(() => {
    if (dashboard?.conferenceStatus !== "Ongoing" || dashboard.runtimeSeconds == null) {
      setLiveRuntime(dashboard?.runtimeSeconds ?? null);
      return;
    }
    const base = dashboard.runtimeSeconds;
    const capturedAt = Date.now();
    const tick = () => setLiveRuntime(base + Math.floor((Date.now() - capturedAt) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [dashboard?.runtimeSeconds, dashboard?.conferenceStatus]);

  const handleStart = async () => {
    if (!adminToken || !conferenceUid || actionLoading) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await startTraining(adminToken, conferenceUid);
      await loadDashboard();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Couldn't start the session.");
    } finally {
      setActionLoading(false);
    }
  };

  const openSheet = (tab: "flow" | "audit") => {
    setSheetTab(tab);
    setSheetVisible(true);
  };

  const handleAdvance = async () => {
    if (!adminToken || !conferenceUid || actionLoading) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await advanceModule(adminToken, conferenceUid);
      await loadDashboard();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Couldn't advance to the next module.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnd = async () => {
    if (!adminToken || !conferenceUid || actionLoading) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await endTraining(adminToken, conferenceUid);
      await loadDashboard();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Couldn't end the session.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMark = async (traineeUid: string, status: "Present" | "Absent") => {
    if (!adminToken || !conferenceUid || rowActionUid) return;
    setRowActionUid(traineeUid);
    setActionError(null);
    try {
      const data = await markAttendance(adminToken, conferenceUid, traineeUid, status);
      setDashboard(data);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Couldn't update attendance.");
    } finally {
      setRowActionUid(null);
    }
  };

  const handleReset = async (traineeUid: string) => {
    if (!adminToken || !conferenceUid || rowActionUid) return;
    setRowActionUid(traineeUid);
    setActionError(null);
    try {
      const data = await resetAttendance(adminToken, conferenceUid, traineeUid);
      setDashboard(data);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Couldn't reset attendance.");
    } finally {
      setRowActionUid(null);
    }
  };

  const handleShareReport = async () => {
    if (!dashboard) return;
    const lines = [
      `Session Report - ${dashboard.title}`,
      `Conference ID: ${dashboard.conferenceUid}`,
      `Date: ${dashboard.conferenceDate ?? "--"}`,
      `Trainer: ${dashboard.trainerName ?? "--"}`,
      `Status: ${dashboard.conferenceStatus}`,
      `Audience: ${dashboard.audience.present}/${dashboard.audience.total} present`,
      `Assessment: ${dashboard.assessment.pass} pass / ${dashboard.assessment.fail} fail`,
    ];
    try {
      await Share.share({ message: lines.join("\n") });
    } catch {
      // user dismissed the share sheet - nothing to do
    }
  };

  const handleShareQr = async () => {
    if (!dashboard || !conferenceUid) return;
    const message = `Join "${dashboard.title}" on TrainerPro.\nConference ID: ${conferenceUid.toUpperCase()}`;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    try {
      // Goes straight to WhatsApp's own compose screen instead of the
      // generic OS share sheet, since that's what trainers overwhelmingly
      // use to send session codes to trainees. canOpenURL isn't used here -
      // it needs extra native config (iOS LSApplicationQueriesSchemes /
      // Android package-visibility queries) this project doesn't have yet,
      // so it would just report "not installed" even when it is.
      await Linking.openURL(whatsappUrl);
      return;
    } catch {
      // WhatsApp isn't installed (or the deep link failed) - fall back to
      // the normal share sheet below.
    }
    try {
      await Share.share({ message });
    } catch {
      // user dismissed the share sheet - nothing to do
    }
  };

  if (loading && !dashboard) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.mainColour1} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !dashboard) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.centered}>
          <AppText style={styles.errorText} color={Colors.gray600}>{error}</AppText>
          <Pressable style={styles.retryButton} onPress={() => loadDashboard()}>
            <AppText color={Colors.white}>Retry</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!dashboard) return null;

  const presentation = STATUS_PRESENTATION[dashboard.conferenceStatus] ?? { label: dashboard.conferenceStatus, color: Colors.gray600 };
  const passRate = dashboard.assessment.totalAttempts
    ? Math.round((dashboard.assessment.pass / dashboard.assessment.totalAttempts) * 100)
    : 0;
  const filteredTrainees = dashboard.trainees.filter((row) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return row.name.toLowerCase().includes(query) || String(row.phone ?? "").includes(query);
  });

  const runningIndex = dashboard.executionFlow.findIndex((item) => item.status === "Running");
  const hasNextModule = runningIndex !== -1 && runningIndex + 1 < dashboard.executionFlow.length;

  const totalModules = dashboard.executionFlow.length;
  const startedModuleCount = dashboard.executionFlow.filter((item) => item.status !== "Pending").length;
  const completedModuleCount = dashboard.executionFlow.filter((item) => item.status === "Completed").length;
  const executionRatio = totalModules ? Math.round((startedModuleCount / totalModules) * 100) : 0;
  const moduleCompletion = totalModules ? Math.round((completedModuleCount / totalModules) * 100) : 0;

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={Colors.mainColour1} />
          </Pressable>
          <View style={styles.headerCenter}>
            <AppText style={styles.headerTitle} weight={FontWeight.semiBold}>Session Dashboard</AppText>
            <View style={styles.headerMetaRow}>
              <View style={styles.headerCodeChip}>
                <AppText style={styles.headerCode} color={Colors.mainColour1}>
                  {conferenceUid?.slice(0, 14).toUpperCase()}
                </AppText>
              </View>
              <Pressable style={styles.qrButton} onPress={() => setQrVisible(true)} hitSlop={6}>
                <Ionicons name="qr-code-outline" size={13} color={Colors.mainColour1} />
                <AppText style={styles.qrButtonText} color={Colors.mainColour1}>Show QR</AppText>
              </Pressable>
            </View>
            {generatedAt && (
              <AppText style={styles.generatedAt} color={Colors.gray600}>
                Generated: {generatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}, {generatedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </AppText>
            )}
          </View>
          <Pressable style={styles.iconButton} onPress={() => loadDashboard()} hitSlop={8}>
            <Ionicons name="refresh" size={20} color={Colors.mainColour1} />
          </Pressable>
        </View>

        {(refreshing || rowActionUid != null || actionLoading) && (
          <View style={styles.loadingToast} pointerEvents="none">
            <ActivityIndicator size="small" color={Colors.mainColour1} />
            <AppText style={styles.loadingToastText}>Loading...</AppText>
          </View>
        )}

        {dashboard.conferenceStatus === "Ongoing" && (
          <View style={styles.liveBadgeWrap} pointerEvents="box-none">
            <LiveAttendanceBadge present={dashboard.audience.present} total={dashboard.audience.total} onPress={scrollToTraineeList} />
          </View>
        )}

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadDashboard("refresh")} colors={[Colors.mainColour1]} tintColor={Colors.mainColour1} />}
        >
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.mainColour1} />
              <AppText style={styles.cardTitle} weight={FontWeight.medium}>Session Details</AppText>
            </View>
            <DetailRow label="Topic" value={dashboard.title} />
            <DetailRow label="Date" value={dashboard.conferenceDate ?? "--"} />
            <DetailRow label="Trainer" value={dashboard.trainerName ?? "--"} valueColor={Colors.mainColour1} />
            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel} color={Colors.gray600}>Status</AppText>
              <View style={[styles.statusBadge, { backgroundColor: presentation.color }]}>
                <AppText style={styles.statusBadgeText} color={Colors.white} weight={FontWeight.semiBold}>{presentation.label}</AppText>
              </View>
            </View>
          </View>

          {liveRuntime != null && (
            <View style={styles.card}>
              <AppText style={styles.runtimeCardLabel} color={Colors.gray600}>Overall Session Runtime</AppText>
              <AppText style={styles.runtimeCardValue} weight={FontWeight.bold}>{formatRuntime(liveRuntime)}</AppText>
              <View style={styles.runtimeMetricsRow}>
                <View style={styles.runtimeMetric}>
                  <AppText style={styles.runtimeMetricLabel} color={Colors.gray600}>Execution Ratio</AppText>
                  <AppText style={styles.runtimeMetricValue} weight={FontWeight.bold}>{executionRatio}%</AppText>
                  <ProgressBar value={executionRatio} color={Colors.mainColour1} />
                </View>
                <View style={styles.runtimeMetric}>
                  <AppText style={styles.runtimeMetricLabel} color={Colors.gray600}>Module Completion</AppText>
                  <AppText style={styles.runtimeMetricValue} weight={FontWeight.bold}>{moduleCompletion}%</AppText>
                  <ProgressBar value={moduleCompletion} color={Colors.success} />
                </View>
              </View>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="people-outline" size={18} color={Colors.mainColour1} />
              <AppText style={styles.cardTitle} weight={FontWeight.medium}>Audience Breakdown</AppText>
            </View>
            <View style={styles.donutRow}>
              <DonutChart
                size={110}
                centerValue={String(dashboard.audience.total)}
                centerLabel="TOTAL"
                segments={[
                  { label: "Present", value: dashboard.audience.present, color: Colors.success },
                  { label: "Not Marked", value: Math.max(dashboard.audience.total - dashboard.audience.present, 0), color: Colors.gray200 },
                ]}
              />
              <View style={styles.statRow}>
                <StatTile label="Total" value={dashboard.audience.total} color={Colors.mainColour1} />
                <StatTile label="Present" value={dashboard.audience.present} color={Colors.success} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="pie-chart-outline" size={18} color={Colors.mainColour1} />
              <AppText style={styles.cardTitle} weight={FontWeight.medium}>Assessment Result</AppText>
            </View>
            <View style={styles.donutRow}>
              <GaugeChart
                size={150}
                centerValue={`${passRate}%`}
                centerLabel="PASS RATE"
                segments={[
                  { label: "Pass", value: dashboard.assessment.pass, color: Colors.success },
                  { label: "Fail", value: dashboard.assessment.fail, color: Colors.danger },
                ]}
              />
              <View style={styles.statRow}>
                <StatTile label="Pass" value={dashboard.assessment.pass} color={Colors.success} />
                <StatTile label="Fail" value={dashboard.assessment.fail} color={Colors.danger} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="trophy-outline" size={18} color="#F59E0B" />
              <AppText style={styles.cardTitle} weight={FontWeight.medium}>Top Performers</AppText>
            </View>
            {dashboard.topPerformers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={32} color={Colors.gray400} />
                <AppText style={styles.emptyTitle} weight={FontWeight.medium}>Leaderboard Empty</AppText>
                <AppText style={styles.emptySubtitle} color={Colors.gray600}>Scores will appear here automatically.</AppText>
              </View>
            ) : (
              <View style={styles.performerList}>
                {dashboard.topPerformers.map((performer, index) => (
                  <View key={performer.traineeUid} style={styles.performerRow}>
                    <AppText style={styles.performerRank} color={Colors.gray600}>#{index + 1}</AppText>
                    <AppText style={styles.performerName} weight={FontWeight.medium}>{performer.name}</AppText>
                    <AppText style={styles.performerScore} color={Colors.success} weight={FontWeight.semiBold}>
                      {performer.percentage.toFixed(0)}%
                    </AppText>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.card} onLayout={(event: LayoutChangeEvent) => { traineeListY.current = event.nativeEvent.layout.y; }}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="list-outline" size={18} color={Colors.mainColour1} />
              <AppText style={styles.cardTitle} weight={FontWeight.medium}>Trainee Master List</AppText>
            </View>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={15} color={Colors.gray400} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or phone"
                placeholderTextColor={Colors.gray400}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            {filteredTrainees.length === 0 ? (
              <AppText style={styles.emptySubtitle} color={Colors.gray600}>No data available.</AppText>
            ) : (
              <>
                <View style={styles.traineeHeaderRow}>
                  <AppText style={styles.traineeHeaderText} color={Colors.gray600}>TRAINEE</AppText>
                  <AppText style={styles.traineeHeaderText} color={Colors.gray600}>IN / OUT</AppText>
                  <AppText style={[styles.traineeHeaderText, styles.traineeHeaderControls]} color={Colors.gray600}>CONTROLS</AppText>
                </View>
                {filteredTrainees.map((row) => (
                  <TraineeListRow
                    key={row.traineeUid}
                    row={row}
                    busy={rowActionUid === row.traineeUid}
                    onMark={(status) => handleMark(row.traineeUid, status)}
                    onReset={() => handleReset(row.traineeUid)}
                  />
                ))}
              </>
            )}
          </View>

          {actionError && <AppText style={styles.actionError}>{actionError}</AppText>}

          {(dashboard.conferenceStatus === "Ongoing" || dashboard.conferenceStatus === "Completed") && (
            <Pressable style={styles.reportButton} onPress={handleShareReport}>
              <Ionicons name="document-text-outline" size={16} color={Colors.mainColour1} />
              <AppText color={Colors.mainColour1} weight={FontWeight.semiBold}>Report</AppText>
            </Pressable>
          )}
        </ScrollView>

        {dashboard.conferenceStatus === "Scheduled" && dashboard.approvalStatus === "Approved" && (
          <AppFooter
            items={[
              {
                key: "start-session",
                label: "Start Session",
                center: true,
                icon: ({ size, color }) => <Ionicons name="play" size={size} color={color} />,
                onPress: handleStart,
              },
            ]}
          />
        )}
        {dashboard.conferenceStatus === "Scheduled" && dashboard.approvalStatus !== "Approved" && (
          <AppFooter
            items={[
              {
                key: "pending-approval",
                label: dashboard.approvalStatus === "Rejected" ? "Rejected by Admin" : "Pending Approval",
                center: true,
                disabled: true,
                icon: ({ size, color }) => (
                  <Ionicons name={dashboard.approvalStatus === "Rejected" ? "close-circle-outline" : "hourglass-outline"} size={size} color={color} />
                ),
                onPress: () => {},
              },
            ]}
          />
        )}
        {dashboard.conferenceStatus === "Ongoing" && (
          <AppFooter
            items={[
              {
                key: "execution-flow",
                label: "Execution Flow",
                icon: ({ size, color }) => <Ionicons name="list-outline" size={size} color={color} />,
                onPress: () => openSheet("flow"),
              },
              {
                key: "end-session",
                label: "End Session",
                center: true,
                icon: ({ size, color }) => <Ionicons name="stop-circle-outline" size={size} color={color} />,
                onPress: handleEnd,
              },
              {
                key: "audit-logs",
                label: "Audit Logs",
                icon: ({ size, color }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />,
                onPress: () => openSheet("audit"),
              },
            ]}
          />
        )}
        {dashboard.conferenceStatus === "Completed" && (
          <AppFooter
            items={[
              {
                key: "execution-flow",
                label: "Execution Flow",
                icon: ({ size, color }) => <Ionicons name="list-outline" size={size} color={color} />,
                onPress: () => openSheet("flow"),
              },
              {
                key: "ended-session",
                label: "Ended Session",
                center: true,
                disabled: true,
                icon: ({ size, color }) => <Ionicons name="checkmark-circle" size={size} color={color} />,
                onPress: () => {},
              },
              {
                key: "audit-logs",
                label: "Audit Logs",
                icon: ({ size, color }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />,
                onPress: () => openSheet("audit"),
              },
            ]}
          />
        )}
      </SafeAreaView>

      <AppModal
        visible={qrVisible}
        onClose={() => setQrVisible(false)}
        position="center"
        title="Session QR"
        showCloseButton
        contentStyle={styles.qrModal}
      >
        <View style={styles.qrWrap}>
          {conferenceUid && <QRCode value={conferenceUid} size={200} />}
          <AppText style={styles.qrCode} color={Colors.gray600}>{conferenceUid?.toUpperCase()}</AppText>
          <Pressable style={styles.qrShareButton} onPress={handleShareQr}>
            <Ionicons name="logo-whatsapp" size={18} color={Colors.white} />
            <AppText color={Colors.white} weight={FontWeight.semiBold}>Share</AppText>
          </Pressable>
        </View>
      </AppModal>

      <AppModal
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        position="bottom"
        showCloseButton
        contentStyle={styles.sheet}
      >
        <View style={styles.sheetTabs}>
          <Pressable style={styles.sheetTab} onPress={() => setSheetTab("flow")}>
            <Ionicons name="list-outline" size={16} color={sheetTab === "flow" ? Colors.mainColour1 : Colors.gray600} />
            <AppText
              weight={sheetTab === "flow" ? FontWeight.semiBold : FontWeight.medium}
              color={sheetTab === "flow" ? Colors.mainColour1 : Colors.gray600}
            >
              Execution Flow
            </AppText>
            {sheetTab === "flow" && <View style={styles.sheetTabIndicator} />}
          </Pressable>
          <Pressable style={styles.sheetTab} onPress={() => setSheetTab("audit")}>
            <Ionicons name="shield-checkmark-outline" size={16} color={sheetTab === "audit" ? Colors.mainColour1 : Colors.gray600} />
            <AppText
              weight={sheetTab === "audit" ? FontWeight.semiBold : FontWeight.medium}
              color={sheetTab === "audit" ? Colors.mainColour1 : Colors.gray600}
            >
              Audit Logs
            </AppText>
            {sheetTab === "audit" && <View style={styles.sheetTabIndicator} />}
          </Pressable>
        </View>

        <ScrollView style={styles.sheetContent} keyboardShouldPersistTaps="handled">
          {sheetTab === "flow" ? (
            <>
              {dashboard.executionFlow.map((item) => (
                <ExecutionFlowRow key={item.moduleKey} item={item} />
              ))}
              {hasNextModule && dashboard.conferenceStatus === "Ongoing" && (
                <Pressable style={styles.nextModuleButton} onPress={handleAdvance} disabled={actionLoading}>
                  {actionLoading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <>
                      <Ionicons name="play-skip-forward-outline" size={15} color={Colors.white} />
                      <AppText color={Colors.white} weight={FontWeight.semiBold} style={styles.nextModuleText}>
                        Next Module
                      </AppText>
                    </>
                  )}
                </Pressable>
              )}
            </>
          ) : dashboard.auditLog.length === 0 ? (
            <AppText style={styles.emptySubtitle} color={Colors.gray600}>No activity logged yet.</AppText>
          ) : (
            dashboard.auditLog.map((entry) => (
              <AuditLogRow key={`${entry.moduleKey}-${entry.runNumber}`} entry={entry} />
            ))
          )}
        </ScrollView>
      </AppModal>
    </>
  );
}

function DetailRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText style={styles.detailLabel} color={Colors.gray600}>{label}</AppText>
      <AppText style={styles.detailValue} color={valueColor} weight={FontWeight.medium}>{value}</AppText>
    </View>
  );
}

function StatTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.statTile, { borderColor: color }]}>
      <AppText style={[styles.statValue, { color }]} weight={FontWeight.bold}>{value}</AppText>
      <AppText style={styles.statLabel} color={Colors.gray600}>{label}</AppText>
    </View>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const width = Math.min(Math.max(value, 0), 100);
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${width}%`, backgroundColor: color }]} />
    </View>
  );
}

function ExecutionFlowRow({ item }: { item: ExecutionFlowItem }) {
  const presentation = FLOW_PRESENTATION[item.status];
  return (
    <View style={styles.flowRow}>
      <Ionicons name={presentation.icon} size={20} color={presentation.color} />
      <View style={styles.flowInfo}>
        <AppText style={styles.flowLabel} weight={FontWeight.medium}>{item.label}</AppText>
        <AppText style={styles.flowMeta} color={Colors.gray600}>
          {item.status}
          {item.elapsedSeconds != null ? `: ${formatDuration(item.elapsedSeconds)}` : ""}
        </AppText>
      </View>
    </View>
  );
}

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  return (
    <View style={styles.auditRow}>
      <View style={styles.auditHeaderRow}>
        <AppText style={styles.auditLabel} weight={FontWeight.medium}>{entry.label}</AppText>
        <View style={styles.auditRunBadge}>
          <AppText style={styles.auditRunBadgeText} color={Colors.gray600}>Run #{entry.runNumber}</AppText>
        </View>
      </View>

      <View style={styles.auditTimeRow}>
        <View style={styles.auditTimeItem}>
          <Ionicons name="enter-outline" size={14} color={Colors.success} />
          <AppText style={styles.auditTimeText} color={Colors.gray600}>{timeOnly(entry.startedAt)}</AppText>
        </View>
        <View style={styles.auditTimeItem}>
          <Ionicons name="exit-outline" size={14} color={Colors.danger} />
          <AppText style={styles.auditTimeText} color={Colors.gray600}>
            {entry.isRunning ? "--:--:--" : timeOnly(entry.endedAt)}
          </AppText>
        </View>
      </View>

      <View style={styles.auditFooterRow}>
        {entry.isRunning ? (
          <View style={[styles.auditDurationPill, styles.auditDurationPillRunning]}>
            <AppText style={styles.auditDurationTextRunning}>Running...</AppText>
          </View>
        ) : (
          <View style={styles.auditDurationPill}>
            <AppText style={styles.auditDurationText}>{formatRuntime(entry.elapsedSeconds ?? 0)}</AppText>
          </View>
        )}
        {entry.startedBy && (
          <View style={styles.auditStartedBy}>
            <Ionicons name="person-circle-outline" size={16} color={Colors.gray600} />
            <AppText style={styles.auditStartedByText} color={Colors.gray600}>{entry.startedBy}</AppText>
          </View>
        )}
      </View>
    </View>
  );
}

function TraineeListRow({
  row,
  busy,
  onMark,
  onReset,
}: {
  row: TraineeRow;
  busy: boolean;
  onMark: (status: "Present" | "Absent") => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.traineeRow}>
      {row.profilePhoto ? (
        <Image source={{ uri: `${API_BASE_URL}/media/${row.profilePhoto}` }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, { backgroundColor: avatarColorFor(row.name) }]}>
          <AppText style={styles.avatarText} color={Colors.white} weight={FontWeight.semiBold}>
            {initialsFor(row.name)}
          </AppText>
        </View>
      )}
      <View style={styles.traineeInfo}>
        <AppText style={styles.traineeName} weight={FontWeight.medium}>{row.name}</AppText>
        <AppText style={styles.traineeMeta} color={Colors.gray600}>{row.phone ?? "--"}</AppText>
        <AppText style={[styles.traineeStatus, { color: row.status === "Present" ? Colors.success : Colors.mainColour1 }]}>
          {row.status}
        </AppText>
        {row.score && <AppText style={styles.traineeScore} color={Colors.gray600}>{row.score}</AppText>}
      </View>
      <View style={styles.traineeInOutCol}>
        <AppText style={styles.traineeInOutText} color={Colors.gray600}>IN: {timeOnly(row.markedOn)}</AppText>
        <AppText style={styles.traineeInOutText} color={Colors.gray600}>OUT: {timeOnly(row.checkOutTime)}</AppText>
      </View>
      <View style={styles.traineeControls}>
        {busy ? (
          <ActivityIndicator size="small" color={Colors.mainColour1} />
        ) : (
          <>
            <Pressable style={styles.controlButton} onPress={() => onMark("Present")} hitSlop={6}>
              <Ionicons name="checkmark" size={16} color={Colors.success} />
            </Pressable>
            <Pressable style={styles.controlButton} onPress={() => onMark("Absent")} hitSlop={6}>
              <Ionicons name="close" size={16} color={Colors.danger} />
            </Pressable>
            <Pressable style={styles.controlButton} onPress={onReset} hitSlop={6}>
              <Ionicons name="ellipsis-horizontal" size={16} color={Colors.gray600} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24 },
  errorText: { fontSize: Fonts.body, textAlign: "center" },
  retryButton: { backgroundColor: Colors.mainColour1, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: Fonts.h3 },
  headerMetaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  headerCodeChip: { backgroundColor: "#DDEEFF", borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  headerCode: { fontSize: Fonts.overline, letterSpacing: 0.5 },
  qrButton: { flexDirection: "row", alignItems: "center", gap: 3 },
  qrButtonText: { fontSize: Fonts.overline, textDecorationLine: "underline" },
  generatedAt: { fontSize: Fonts.overline, marginTop: 3 },
  content: { padding: 16, paddingTop: 4, gap: 14 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xxl, padding: 16, ...Shadows.card },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: Fonts.body },
  detailRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 },
  detailLabel: { fontSize: Fonts.bodySm },
  detailValue: { fontSize: Fonts.bodySm },
  statusBadge: { borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  statusBadgeText: { fontSize: Fonts.overline },
  runtimeCardLabel: { fontSize: Fonts.bodySm },
  runtimeCardValue: { fontSize: Fonts.h1, marginTop: 4 },
  runtimeMetricsRow: { flexDirection: "row", gap: 20, marginTop: 16 },
  runtimeMetric: { flex: 1, gap: 4 },
  runtimeMetricLabel: { fontSize: Fonts.overline },
  runtimeMetricValue: { fontSize: Fonts.body },
  progressTrack: { height: 6, borderRadius: Radius.pill, backgroundColor: Colors.gray100, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: Radius.pill },
  statRow: { flexDirection: "row", gap: 12, flex: 1 },
  statTile: { flex: 1, borderWidth: 1, borderRadius: Radius.xl, alignItems: "center", paddingVertical: 14, gap: 4 },
  statValue: { fontSize: Fonts.h2 },
  statLabel: { fontSize: Fonts.overline, letterSpacing: 0.5 },
  donutRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  emptyState: { alignItems: "center", gap: 6, paddingVertical: 20 },
  emptyTitle: { fontSize: Fonts.body, marginTop: 4 },
  emptySubtitle: { fontSize: Fonts.bodySm, textAlign: "center" },
  performerList: { gap: 10 },
  performerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  performerRank: { fontSize: Fonts.bodySm, width: 24 },
  performerName: { fontSize: Fonts.bodySm, flex: 1 },
  performerScore: { fontSize: Fonts.bodySm },
  flowRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  flowInfo: { flex: 1 },
  flowLabel: { fontSize: Fonts.bodySm },
  flowMeta: { fontSize: Fonts.overline, marginTop: 1 },
  nextModuleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.mainColour1,
    borderRadius: Radius.lg,
    paddingVertical: 10,
    marginTop: 8,
  },
  nextModuleText: { fontSize: Fonts.bodySm },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: Fonts.bodySm, color: Colors.black },
  traineeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  traineeHeaderText: { fontSize: Fonts.caption, letterSpacing: 0.5 },
  traineeHeaderControls: { width: 78, textAlign: "right" },
  traineeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: Fonts.overline },
  traineeInfo: { flex: 1 },
  traineeName: { fontSize: Fonts.bodySm },
  traineeMeta: { fontSize: Fonts.overline },
  traineeInOutCol: { alignItems: "flex-end" },
  traineeInOutText: { fontSize: Fonts.overline },
  traineeStatus: { fontSize: Fonts.overline, fontWeight: "600", marginTop: 2 },
  traineeScore: { fontSize: Fonts.overline, marginTop: 2 },
  traineeControls: { flexDirection: "row", alignItems: "center", gap: 6, width: 78, justifyContent: "flex-end" },
  controlButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.mainColour1,
    borderRadius: Radius.xl,
    paddingHorizontal: 16,
    height: 48,
  },
  actionError: { color: Colors.danger, fontSize: Fonts.bodySm, textAlign: "center" },
  qrModal: { alignItems: "center", paddingHorizontal: 24, paddingBottom: 24 },
  qrWrap: { alignItems: "center", gap: 12, paddingVertical: 8 },
  qrCode: { fontSize: Fonts.overline, letterSpacing: 1 },
  qrShareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    backgroundColor: "#25D366",
    borderRadius: Radius.xl,
    paddingHorizontal: 24,
    paddingVertical: 10,
    ...Shadows.raised,
  },
  loadingToast: {
    position: "absolute",
    top: 60,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...Shadows.raised,
  },
  loadingToastText: { fontSize: Fonts.bodySm },
  liveBadgeWrap: {
    position: "absolute",
    top: 66,
    right: 16,
    zIndex: 10,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.success,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Shadows.raised,
  },
  liveBadgeText: { fontSize: Fonts.overline },
  liveBadgeTail: {
    position: "absolute",
    bottom: -4,
    left: "50%",
    marginLeft: -5,
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: Colors.success,
    transform: [{ rotate: "45deg" }],
  },
  sheet: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24, maxHeight: "80%" },
  sheetTabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Colors.gray100, marginBottom: 12 },
  sheetTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginRight: 20,
  },
  sheetTabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.mainColour1,
  },
  sheetContent: { maxHeight: 420 },
  auditRow: {
    backgroundColor: Colors.gray100,
    borderRadius: Radius.xl,
    padding: 12,
    marginBottom: 10,
  },
  auditHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  auditLabel: { fontSize: Fonts.bodySm, flex: 1 },
  auditRunBadge: { backgroundColor: Colors.white, borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  auditRunBadgeText: { fontSize: Fonts.overline },
  auditTimeRow: { flexDirection: "row", gap: 16, marginTop: 8 },
  auditTimeItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  auditTimeText: { fontSize: Fonts.overline },
  auditFooterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  auditDurationPill: { backgroundColor: "#DCFCE7", borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  auditDurationPillRunning: { backgroundColor: "#FEE2E2" },
  auditDurationText: { fontSize: Fonts.overline, color: Colors.success },
  auditDurationTextRunning: { fontSize: Fonts.overline, color: Colors.danger },
  auditStartedBy: { flexDirection: "row", alignItems: "center", gap: 4 },
  auditStartedByText: { fontSize: Fonts.overline },
});
