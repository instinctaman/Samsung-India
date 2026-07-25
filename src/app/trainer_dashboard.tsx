import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import AppText from "@/components/ui/AppText";
import AppModal from "@/components/ui/AppModal";
import ScreenBanner from "@/components/ui/ScreenBanner";
import TrainerFooter from "@/components/trainer/TrainerFooter";
import SidebarMenu from "@/components/trainer/SidebarMenu";
import TrainingsQuickPanel from "@/components/trainer/TrainingsQuickPanel";
import AccountPanel from "@/components/trainer/AccountPanel";
import DateDrop, { DatePreset, DateRange, formatDMY, rangeForPreset } from "@/components/trainer/DateDrop";
import { DonutChart } from "@/components/trainer/charts";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { useAuth } from "@/hooks/useAuth";
import { TrainingAgendaItem, fetchTrainerAgenda } from "@/api/training";

const LOGO = require("@/assets/images/logo/project_logo.png");

const pad2 = (n: number) => String(n).padStart(2, "0");
const toApiDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

function AgendaDateBadge({ conferenceDate, conferenceTime }: { conferenceDate: string | null; conferenceTime: string | null }) {
  const parsed = conferenceDate ? new Date(`${conferenceDate}T00:00:00`) : null;
  const day = parsed ? parsed.getDate() : "--";
  const month = parsed ? parsed.toLocaleDateString("en-GB", { month: "short" }).toUpperCase() : "";
  return (
    <View style={styles.agendaDateBadge}>
      <AppText style={styles.agendaDateDay} weight={FontWeight.bold}>{day}</AppText>
      <AppText style={styles.agendaDateMonth} color={Colors.gray600}>{month}</AppText>
      <View style={styles.agendaDateDivider} />
      <AppText style={styles.agendaTime} weight={FontWeight.bold} color={Colors.mainColour1}>{conferenceTime ?? "--:--"}</AppText>
    </View>
  );
}

const STATUS_PRESENTATION: Record<string, { label: string; color: string; background: string }> = {
  Scheduled: { label: "UPCOMING", color: Colors.mainColour1, background: "#E3ECFF" },
  Ongoing: { label: "LIVE NOW", color: Colors.danger, background: "#FCE4E4" },
  Completed: { label: "COMPLETED", color: Colors.gray600, background: Colors.gray100 },
};

function LaunchButton({ status, approvalStatus, onPress }: { status: string; approvalStatus: string; onPress: () => void }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status !== "Ongoing") return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [status, pulse]);

  if (status === "Completed") {
    return (
      <Pressable style={[styles.launchButton, styles.historyButton]} onPress={onPress}>
        <Ionicons name="time-outline" size={18} color={Colors.gray600} />
        <AppText style={styles.launchButtonText} color={Colors.gray600} weight={FontWeight.bold}>{"VIEW\nHISTORY"}</AppText>
      </Pressable>
    );
  }

  if (status === "Scheduled" && approvalStatus !== "Approved") {
    return (
      <Pressable style={[styles.launchButton, styles.historyButton]} onPress={onPress}>
        <Ionicons name={approvalStatus === "Rejected" ? "close-circle-outline" : "hourglass-outline"} size={18} color={Colors.gray600} />
        <AppText style={styles.launchButtonText} color={Colors.gray600} weight={FontWeight.bold}>
          {approvalStatus === "Rejected" ? "REJECTED" : "PENDING"}
        </AppText>
      </Pressable>
    );
  }

  if (status === "Ongoing") {
    const backgroundColor = pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.mainColour1, Colors.danger],
    });
    return (
      <Animated.View style={[styles.launchButton, { backgroundColor }]}>
        <Pressable style={styles.launchButtonPressable} onPress={onPress}>
          <Ionicons name="rocket" size={18} color={Colors.white} />
          <AppText style={styles.launchButtonText} color={Colors.white} weight={FontWeight.bold}>LAUNCH</AppText>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Pressable style={styles.launchButton} onPress={onPress}>
      <Ionicons name="rocket" size={18} color={Colors.white} />
      <AppText style={styles.launchButtonText} color={Colors.white} weight={FontWeight.bold}>LAUNCH</AppText>
    </Pressable>
  );
}

function AgendaCard({ item, onLaunch }: { item: TrainingAgendaItem; onLaunch: () => void }) {
  const presentation = STATUS_PRESENTATION[item.conferenceStatus] ?? { label: item.conferenceStatus, color: Colors.gray600, background: Colors.gray100 };
  return (
    <View style={[styles.agendaCard, { borderColor: presentation.color }]}>
      <AgendaDateBadge conferenceDate={item.conferenceDate} conferenceTime={item.conferenceTime} />
      <View style={styles.agendaVerticalDivider} />
      <View style={styles.agendaInfo}>
        <View style={styles.agendaMetaRow}>
          <View style={[styles.statusChip, { backgroundColor: presentation.background }]}>
            <View style={[styles.agendaStatusDot, { backgroundColor: presentation.color }]} />
            <AppText style={[styles.statusChipText, { color: presentation.color }]} weight={FontWeight.bold}>{presentation.label}</AppText>
          </View>
          <View style={styles.agendaCodeRow}>
            <Ionicons name="finger-print-outline" size={13} color={Colors.gray400} />
            <AppText style={styles.agendaCode} color={Colors.gray600}>{item.conferenceUid.slice(0, 10).toUpperCase()}</AppText>
          </View>
        </View>
        <AppText style={styles.agendaTitle} weight={FontWeight.bold}>{item.title}</AppText>
        {item.location && (
          <View style={styles.agendaMetaRow}>
            <View style={styles.flexs}>
              <Ionicons name="navigate-circle-outline" size={13} color={Colors.danger} />
              <AppText style={styles.agendaSubtext} color={Colors.gray600}>{item.location}</AppText>
            </View>
          </View>
        )}
      </View>
      <View style={styles.agendaAction}>
        <LaunchButton status={item.conferenceStatus} approvalStatus={item.approvalStatus} onPress={onLaunch} />
        {item.batchSize && (
          <AppText style={styles.batchSizeText} color={Colors.gray600}>
            Batch Size: <AppText weight={FontWeight.bold} color={Colors.black}>{item.batchSize}</AppText>
          </AppText>
        )}
      </View>
    </View>
  );
}

export default function TrainerDashboardScreen() {
  const router = useRouter();
  const { admin, adminToken, adminLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [dateDropOpen, setDateDropOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("today");
  const [dateRange, setDateRange] = useState<DateRange>(() => rangeForPreset("today", { start: new Date(), end: new Date() }));
  const [agenda, setAgenda] = useState<TrainingAgendaItem[]>([]);
  const [loadingAgenda, setLoadingAgenda] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const todayLabel = useMemo(
    () => new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    []
  );

  const dateRangeLabel = `${formatDMY(dateRange.start)}  →  ${formatDMY(dateRange.end)}`;

  const loadAgenda = useCallback(
    async (mode: "load" | "refresh" | "silent" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);
      else if (mode === "load") setLoadingAgenda(true);
      try {
        const data = await fetchTrainerAgenda(adminToken, {
          start: toApiDate(dateRange.start),
          end: toApiDate(dateRange.end),
        });
        setAgenda(data);
      } catch {
        // A silent background poll shouldn't wipe a working agenda list
        // just because of a transient network hiccup.
        if (mode !== "silent") setAgenda([]);
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else if (mode === "load") setLoadingAgenda(false);
      }
    },
    [adminToken, dateRange]
  );

  // Poll quietly while this screen is focused so an admin approval/rejection
  // (or a session going live/ending) shows up on its own, without the
  // trainer needing to pull-to-refresh. Stops as soon as the screen blurs.
  useFocusEffect(
    useCallback(() => {
      loadAgenda();
      const interval = setInterval(() => loadAgenda("silent"), 10000);
      return () => clearInterval(interval);
    }, [loadAgenda])
  );

  const totalSessions = agenda.length;
  const executed = agenda.filter((item) => item.conferenceStatus === "Completed").length;

  const applyDateRange = (range: DateRange, preset: DatePreset) => {
    setDateRange(range);
    setDatePreset(preset);
    setDateDropOpen(false);
  };

  const handleLogout = () => {
    setAccountOpen(false);
    adminLogout();
    router.replace("/trainer_login");
  };

  const handleLaunch = (conferenceUid: string) => {
    router.push({ pathname: "/session_dashboard", params: { conferenceUid } });
  };

  const closePanels = () => {
    setMenuOpen(false);
    setQuickActionsOpen(false);
  };

  const handleNavigate = (label: string) => {
    closePanels();
    if (label === "Add New Trainings") {
      router.push("/add_training");
    } else if (label === "Pending Trainings") {
      router.push("/pending_trainings");
    } else if (label === "Training List") {
      router.push("/training_list");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadAgenda("refresh")} colors={[Colors.mainColour1]} tintColor={Colors.mainColour1} />}
        >
          <ScreenBanner backgroundColor={Colors.mainColour1}>
            <View style={styles.topBar}>
              <View style={styles.brandChip}>
                <View style={styles.brandLogoCrop}>
                  <Image source={LOGO} style={styles.brandLogoImage} />
                </View>
              </View>
              <Pressable style={styles.profileChip} onPress={() => setAccountOpen(true)}>
                <Ionicons name="person-circle-outline" size={18} color={Colors.white} />
                <View>
                  <AppText style={styles.profileName} color={Colors.white} weight={FontWeight.medium}>{admin?.name ?? "Trainer"}</AppText>
                  <AppText style={styles.profileRole} color={Colors.white}>{admin?.role ?? "Trainer"}</AppText>
                </View>
              </Pressable>
            </View>

            <AppText style={styles.welcome} color={Colors.white}>
              Welcome back, <AppText style={styles.welcomeName} color={Colors.white} weight={FontWeight.bold}>{admin?.name ?? "Trainer"}</AppText>
            </AppText>

            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <AppText style={styles.statusText} color={Colors.white}>System Status: Optimized</AppText>
            </View>

            <Pressable style={styles.dateRangeChip} onPress={() => setDateDropOpen(true)}>
              <Ionicons name="calendar-outline" size={14} color={Colors.white} />
              <AppText style={styles.dateRangeText} color={Colors.white}>{dateRangeLabel}</AppText>
              <Ionicons name="chevron-down" size={13} color={Colors.white} />
            </Pressable>
          </ScreenBanner>

          <View style={styles.body}>
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <AppText style={styles.cardTitle} weight={FontWeight.medium}>Training Efficiency</AppText>
                <Ionicons name="pie-chart-outline" size={18} color={Colors.mainColour1} />
              </View>
              <View style={styles.donutRow}>
                <DonutChart
                  centerValue={String(totalSessions)}
                  centerLabel="TOTAL SESSIONS"
                  segments={[
                    { label: "Executed", value: executed, color: Colors.success },
                    { label: "Planned", value: Math.max(totalSessions - executed, 0), color: Colors.mainColour1 },
                  ]}
                />
                <View style={styles.legend}>
                  <LegendRow color={Colors.success} label="Executed" value={executed} />
                  <LegendRow color={Colors.mainColour1} label="Planned" value={totalSessions} />
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.agendaHeaderRow}>
                <View style={styles.agendaHeaderLeft}>
                  <Ionicons name="layers-outline" size={18} color={Colors.mainColour1} />
                  <AppText style={styles.cardTitle} weight={FontWeight.medium}>
                    {datePreset === "today" ? "Today's Agenda" : "Agenda"}
                  </AppText>
                </View>
                <Pressable style={styles.filterButton} onPress={() => setDateDropOpen(true)}>
                  <Ionicons name="filter" size={14} color={Colors.mainColour1} />
                  <AppText style={styles.filterButtonText} color={Colors.mainColour1}>Filter</AppText>
                </Pressable>
              </View>
              <AppText style={styles.agendaDate} color={Colors.gray600}>
                {datePreset === "today" ? todayLabel : dateRangeLabel}
              </AppText>

              {loadingAgenda ? (
                <View style={styles.emptyAgenda}>
                  <AppText style={styles.emptySubtitle} color={Colors.gray600}>Loading sessions…</AppText>
                </View>
              ) : agenda.length === 0 ? (
                <View style={styles.emptyAgenda}>
                  <Ionicons name="calendar-outline" size={36} color={Colors.gray400} />
                  <AppText style={styles.emptyTitle} weight={FontWeight.medium}>No Scheduled Missions</AppText>
                  <AppText style={styles.emptySubtitle} color={Colors.gray600}>
                    There are no sessions aligned for this period. Relax and prepare for the next deployment.
                  </AppText>
                </View>
              ) : (
                <View style={styles.agendaList}>
                  {agenda.map((item) => (
                    <AgendaCard key={item.conferenceUid} item={item} onLaunch={() => handleLaunch(item.conferenceUid)} />
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <TrainerFooter
          onOpenMenu={() => setMenuOpen(true)}
          onOpenQuickActions={() => setQuickActionsOpen(true)}
          onOpenAccount={() => setAccountOpen(true)}
        />
      </SafeAreaView>

      <AppModal visible={menuOpen} onClose={closePanels} position="left" contentStyle={styles.leftPanel}>
        <SidebarMenu onNavigate={handleNavigate} />
      </AppModal>

      <AppModal visible={quickActionsOpen} onClose={closePanels} position="top" contentStyle={styles.topPanel}>
        <TrainingsQuickPanel onSelect={handleNavigate} />
      </AppModal>

      <AppModal visible={dateDropOpen} onClose={() => setDateDropOpen(false)} position="top" contentStyle={styles.topPanel}>
        <DateDrop range={dateRange} preset={datePreset} onApply={applyDateRange} />
      </AppModal>

      <AppModal visible={accountOpen} onClose={() => setAccountOpen(false)} position="right" contentStyle={styles.rightPanel}>
        <AccountPanel
          name={admin?.name ?? "Trainer"}
          role={admin?.role ?? "Trainer"}
          onSettings={() => setAccountOpen(false)}
          onLogout={handleLogout}
        />
      </AppModal>
    </>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendSwatch, { backgroundColor: color }]} />
      <AppText style={styles.legendLabel} color={Colors.gray600}>{label}</AppText>
      <AppText style={styles.legendValue} weight={FontWeight.medium}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brandChip: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  // project_logo.png is a 1600x872 transparent canvas with the visible
  // mark sitting in a 930x308 region starting at (334, 282) - this crops
  // to just that region at a 30px-tall display size instead of shipping a
  // trimmed asset. Recompute these if the source PNG is replaced.
  brandLogoCrop: { width: 91, height: 30, overflow: "hidden" },
  brandLogoImage: { position: "absolute", top: -27, left: -33, width: 156, height: 85 },
  profileChip: { flexDirection: "row", alignItems: "center", gap: 6 },
  profileName: { fontSize: Fonts.bodySm },
  profileRole: { fontSize: Fonts.overline, opacity: 0.85 },
  welcome: { fontSize: Fonts.h3, marginTop: 22 },
  welcomeName: { fontSize: Fonts.h3 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#4ADE80" },
  statusText: { fontSize: Fonts.bodySm },
  dateRangeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.lg,
  },
  dateRangeText: { fontSize: Fonts.bodySm },
  body: { padding: 16, gap: 14 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xxl, padding: 16, ...Shadows.card },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cardTitle: { fontSize: Fonts.body },
  donutRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 12 },
  legend: { flex: 1, gap: 12 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendSwatch: { width: 10, height: 10, borderRadius: 3 },
  legendLabel: { fontSize: Fonts.bodySm, flex: 1 },
  legendValue: { fontSize: Fonts.bodySm },
  agendaDate: { fontSize: Fonts.overline, marginTop: 4 },
  agendaHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  agendaHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E3ECFF",
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterButtonText: { fontSize: Fonts.overline },
  emptyAgenda: { alignItems: "center", gap: 6, paddingVertical: 24 },
  emptyTitle: { fontSize: Fonts.body, marginTop: 4 },
  emptySubtitle: { fontSize: Fonts.bodySm, textAlign: "center", lineHeight: 18 },
  agendaList: { gap: 12, marginTop: 10 },
  agendaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radius.xxxl,
    borderWidth: 1.5,
    padding: 14,
    ...Shadows.raised,
  },
  agendaDateBadge: { alignItems: "center", width: 48, gap: 2 },
  agendaDateDay: { fontSize: Fonts.h1 },
  agendaDateMonth: { fontSize: Fonts.overline, letterSpacing: 0.5 },
  agendaDateDivider: { width: "70%", height: 1, backgroundColor: Colors.gray200, marginVertical: 4 },
  agendaTime: { fontSize: Fonts.bodySm },
  agendaVerticalDivider: { width: 1, alignSelf: "stretch", backgroundColor: Colors.gray200 },
  agendaInfo: { flex: 1, gap: 6, paddingRight: 4 },
  agendaMetaRow: { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap" },
  flexs: {
    flexDirection: "row", alignItems: "center", gap: 5,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  agendaStatusDot: { width: 6, height: 6, borderRadius: 3 },
  statusChipText: { fontSize: Fonts.overline, letterSpacing: 0.3 },
  agendaCodeRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  agendaCode: { fontSize: Fonts.overline },
  agendaTitle: { fontSize: Fonts.bodySm },
  agendaSubtext: { fontSize: Fonts.overline },
  agendaAction: { alignItems: "center", gap: 6, marginLeft: 8 },
  launchButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    // minWidth: 92,
    backgroundColor: Colors.mainColour1,
    borderRadius: Radius.xxl,
    paddingHorizontal: Fonts.body,
    paddingVertical: Fonts.bodySm,
    ...Shadows.raised,
  },
  launchButtonPressable: { flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 },
  historyButton: { backgroundColor: Colors.gray100, ...Shadows.card },
  launchButtonText: { fontSize: Fonts.overline, letterSpacing: 0.5, textAlign: "center" },
  batchSizeText: { fontSize: Fonts.overline },
  leftPanel: { width: "80%", height: "100%" },
  topPanel: { width: "100%" },
  rightPanel: { width: "80%", height: "100%" },
});
