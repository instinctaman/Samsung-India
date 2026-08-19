import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { useAuth } from "@/hooks/useAuth";
import {
  ApiError,
  AssessmentSuiteOut,
  PendingSessionItem,
  approveTraining,
  fetchAssessmentSuites,
  fetchPendingTrainings,
  rejectTraining,
} from "@/api/training";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { admin, adminToken, adminLogout } = useAuth();

  const [pending, setPending] = useState<PendingSessionItem[]>([]);
  const [suites, setSuites] = useState<AssessmentSuiteOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actioningUid, setActioningUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!adminToken) return;
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
        const [pendingList, suiteList] = await Promise.all([
          fetchPendingTrainings(adminToken),
          fetchAssessmentSuites(adminToken),
        ]);
        setPending(pendingList);
        setSuites(suiteList);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Couldn't load the admin dashboard.");
      } finally {
        isRefresh ? setRefreshing(false) : setLoading(false);
      }
    },
    [adminToken]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleApprove = async (uid: string) => {
    if (!adminToken || actioningUid) return;
    setActioningUid(uid);
    try {
      await approveTraining(adminToken, uid);
      await load();
    } catch {
      setError("Couldn't approve this session.");
    } finally {
      setActioningUid(null);
    }
  };

  const handleReject = async (uid: string) => {
    if (!adminToken || actioningUid) return;
    setActioningUid(uid);
    try {
      await rejectTraining(adminToken, uid);
      await load();
    } catch {
      setError("Couldn't reject this session.");
    } finally {
      setActioningUid(null);
    }
  };

  const handleLogout = () => {
    adminLogout();
    router.replace("/trainer_login");
  };

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={[Colors.mainColour1]} tintColor={Colors.mainColour1} />}
        >
          <View style={styles.banner}>
            <View style={styles.topBar}>
              <View>
                <AppText style={styles.welcome} color={Colors.white}>Welcome back,</AppText>
                <AppText style={styles.welcomeName} color={Colors.white} weight={FontWeight.bold}>{admin?.name ?? "Admin"}</AppText>
              </View>
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="power" size={20} color={Colors.mainColour1} />
              </Pressable>
            </View>
          </View>

          <View style={styles.body}>
            {error && <AppText style={styles.errorText}>{error}</AppText>}

            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="checkmark-done-circle-outline" size={18} color={Colors.mainColour1} />
                <AppText style={styles.cardTitle} weight={FontWeight.medium}>Pending Approvals</AppText>
                {pending.length > 0 && (
                  <View style={styles.countBadge}>
                    <AppText style={styles.countBadgeText} color={Colors.white} weight={FontWeight.bold}>{pending.length}</AppText>
                  </View>
                )}
              </View>

              {loading ? (
                <ActivityIndicator color={Colors.mainColour1} style={styles.loadingSpinner} />
              ) : pending.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle-outline" size={32} color={Colors.gray400} />
                  <AppText style={styles.emptyText} color={Colors.gray600}>Nothing waiting on review.</AppText>
                </View>
              ) : (
                <View style={styles.pendingList}>
                  {pending.map((item) => (
                    <View key={item.conferenceUid} style={styles.pendingRow}>
                      <View style={styles.pendingInfo}>
                        <AppText style={styles.pendingTitle} weight={FontWeight.medium}>{item.title}</AppText>
                        <AppText style={styles.pendingMeta} color={Colors.gray600}>
                          {item.trainerName ?? "Unknown Trainer"} • {item.conferenceDate ?? "--"} {item.conferenceTime ?? ""}
                        </AppText>
                      </View>
                      {actioningUid === item.conferenceUid ? (
                        <ActivityIndicator color={Colors.mainColour1} />
                      ) : (
                        <View style={styles.pendingActions}>
                          <Pressable style={styles.rejectButton} onPress={() => handleReject(item.conferenceUid)}>
                            <Ionicons name="close" size={16} color={Colors.danger} />
                          </Pressable>
                          <Pressable style={styles.approveButton} onPress={() => handleApprove(item.conferenceUid)}>
                            <Ionicons name="checkmark" size={16} color={Colors.white} />
                          </Pressable>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="document-text-outline" size={18} color={Colors.mainColour1} />
                <AppText style={styles.cardTitle} weight={FontWeight.medium}>Assessment Suites</AppText>
                <Pressable style={styles.addSuiteButton} onPress={() => router.push("/assessment_builder")}>
                  <Ionicons name="add" size={16} color={Colors.white} />
                  <AppText style={styles.addSuiteButtonText} color={Colors.white} weight={FontWeight.semiBold}>Add Suite</AppText>
                </Pressable>
              </View>

              {loading ? (
                <ActivityIndicator color={Colors.mainColour1} style={styles.loadingSpinner} />
              ) : suites.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="document-outline" size={32} color={Colors.gray400} />
                  <AppText style={styles.emptyText} color={Colors.gray600}>No assessment suites yet.</AppText>
                </View>
              ) : (
                <View style={styles.suiteList}>
                  {suites.map((suite) => (
                    <Pressable
                      key={suite.assessmentSuiteUid}
                      style={styles.suiteRow}
                      onPress={() => router.push({ pathname: "/assessment_builder", params: { suiteUid: suite.assessmentSuiteUid } })}
                    >
                      <View style={styles.suiteIcon}>
                        <Ionicons name="document-text" size={16} color={Colors.mainColour1} />
                      </View>
                      <View style={styles.suiteInfo}>
                        <AppText style={styles.suiteName} weight={FontWeight.medium}>{suite.name}</AppText>
                        <AppText style={styles.suiteMeta} color={Colors.gray600}>{suite.category} • {suite.noOfQuestion} questions</AppText>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },
  banner: {
    backgroundColor: Colors.mainColour1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: Radius.xxxl,
    borderBottomRightRadius: Radius.xxxl,
  },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  welcome: { fontSize: Fonts.bodySm, opacity: 0.85 },
  welcomeName: { fontSize: Fonts.h2, marginTop: 2 },
  logoutButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center" },
  body: { padding: 16, gap: 14 },
  errorText: { color: Colors.danger, fontSize: Fonts.bodySm, textAlign: "center" },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xxl, padding: 16, ...Shadows.card },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: Fonts.body, flex: 1 },
  countBadge: { backgroundColor: Colors.danger, borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  countBadgeText: { fontSize: Fonts.overline },
  loadingSpinner: { marginVertical: 20 },
  emptyState: { alignItems: "center", gap: 6, paddingVertical: 20 },
  emptyText: { fontSize: Fonts.bodySm, textAlign: "center" },
  pendingList: { marginTop: 10, gap: 10 },
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.xl,
    padding: 12,
  },
  pendingInfo: { flex: 1 },
  pendingTitle: { fontSize: Fonts.bodySm },
  pendingMeta: { fontSize: Fonts.overline, marginTop: 2 },
  pendingActions: { flexDirection: "row", gap: 8 },
  rejectButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: Colors.danger, alignItems: "center", justifyContent: "center" },
  approveButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.success, alignItems: "center", justifyContent: "center" },
  addSuiteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.mainColour1,
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addSuiteButtonText: { fontSize: Fonts.overline },
  suiteList: { marginTop: 10, gap: 8 },
  suiteRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  suiteIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#DDEEFF", alignItems: "center", justifyContent: "center" },
  suiteInfo: { flex: 1 },
  suiteName: { fontSize: Fonts.bodySm },
  suiteMeta: { fontSize: Fonts.overline, marginTop: 2 },
});
