import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchSessionDashboard, SessionDashboard } from "@/api/training";
import { DataTable } from "@/components/ui/DataTable";
import {
  SessionReportHeader,
  SessionSummaryCard,
  useSessionReportColumns,
} from "@/components/session_report";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/theme/colors";
import { DEMO_SESSION_REPORT_PARTICIPANTS, DEMO_SESSION_REPORT_SUMMARY } from "@/data/mockData";

export default function SessionReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ conferenceUid?: string }>();
  const conferenceUid = params.conferenceUid || "CONF25456581";
  const { adminToken } = useAuth();

  const [data, setData] = useState<SessionDashboard | null>(null);
  const columns = useSessionReportColumns();

  const loadData = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetchSessionDashboard(adminToken, conferenceUid);
      setData(res);
    } catch {
      // Fallback to summary defaults below
    }
  }, [adminToken, conferenceUid]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const summary = {
    ...DEMO_SESSION_REPORT_SUMMARY,
    conferenceId: conferenceUid || DEMO_SESSION_REPORT_SUMMARY.conferenceId,
    sessionName: data?.trainingType || DEMO_SESSION_REPORT_SUMMARY.sessionName,
    date: data?.conferenceDate || DEMO_SESSION_REPORT_SUMMARY.date,
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <SessionReportHeader onBack={() => router.back()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SessionSummaryCard summary={summary} />

        <View style={styles.tableWrap}>
          <DataTable
            title="Quiz Participant Details"
            columns={columns}
            data={DEMO_SESSION_REPORT_PARTICIPANTS}
            keyExtractor={(row, index) => `quiz-${row.userId}-${index}`}
            exportFileName="quiz-participant-details"
            toolbarVariant="download"
            headerBackgroundColor={Colors.mainColour1}
            headerTextColor={Colors.white}
          />
        </View>

        <View style={styles.tableWrap}>
          <DataTable
            title="Test Participant Details"
            columns={columns}
            data={DEMO_SESSION_REPORT_PARTICIPANTS}
            keyExtractor={(row, index) => `test-${row.userId}-${index}`}
            exportFileName="test-participant-details"
            toolbarVariant="download"
            headerBackgroundColor={Colors.mainColour1}
            headerTextColor={Colors.white}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F7FA" },
  scroll: { marginTop: -50, zIndex: 1, elevation: 1 },
  content: { paddingBottom: 24 },
  tableWrap: { marginHorizontal: 14, marginTop: 16 },
});
