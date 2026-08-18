import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import ActionIcon from "@/assets/images/svg/action.svg";
import { DataTable, DataTableColumn } from "@/components/ui/DataTable";
import AppText from "@/components/ui/AppText";
import ScreenBanner from "@/components/ui/ScreenBanner";
import { StatusPill, StatusTone } from "@/components/ui/StatusPill";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { formatDisplayDate } from "@/utils/formatDisplayDate";
import { TrainingAgendaItem } from "@/api/training";

const APPROVAL_STATUS_PRESENTATION: Record<string, { label: string; tone: StatusTone }> = {
  Pending: { label: "Pending", tone: "warning" },
  Approved: { label: "Approved", tone: "success" },
  Rejected: { label: "Terminated", tone: "danger" },
};

export function approvalStatusColumn(): DataTableColumn<TrainingAgendaItem> {
  return {
    key: "status",
    header: "Status",
    minWidth: 92,
    render: (row) => {
      const presentation = APPROVAL_STATUS_PRESENTATION[row.approvalStatus] ?? {
        label: row.approvalStatus,
        tone: "neutral" as StatusTone,
      };
      return <StatusPill label={presentation.label} tone={presentation.tone} />;
    },
    exportValue: (row) => APPROVAL_STATUS_PRESENTATION[row.approvalStatus]?.label ?? row.approvalStatus,
  };
}

export function pendingStatusColumn(): DataTableColumn<TrainingAgendaItem> {
  return {
    key: "status",
    header: "Status",
    minWidth: 92,
    render: () => <StatusPill label="Pending" tone="warning" />,
    exportValue: () => "Pending",
  };
}

type TrainingListViewProps = {
  title: string;
  subtitle: string;
  items: TrainingAgendaItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onBack: () => void;
  onEdit: (row: TrainingAgendaItem) => void;
  statusColumn: DataTableColumn<TrainingAgendaItem>;
  exportFileName: string;
  emptyLabel: string;
};

export function TrainingListView({
  title,
  subtitle,
  items,
  loading,
  refreshing,
  onRefresh,
  onBack,
  onEdit,
  statusColumn,
  exportFileName,
  emptyLabel,
}: TrainingListViewProps) {
  const insets = useSafeAreaInsets();

  const columns: DataTableColumn<TrainingAgendaItem>[] = [
    {
      key: "slNo",
      header: "Sl No.",
      minWidth: 48,
      sortable: false,
      render: (_row, index) => <AppText style={styles.cellText}>{index + 1}</AppText>,
      exportValue: (_row, index) => String(index + 1),
    },
    {
      key: "action",
      header: "Action",
      minWidth: 48,
      sortable: false,
      render: (row) => (
        <Pressable style={styles.actionButton} onPress={() => onEdit(row)} hitSlop={4}>
          <ActionIcon width={15} height={15} />
        </Pressable>
      ),
      exportValue: () => "",
    },
    statusColumn,
    {
      key: "trainerName",
      header: "Trainer Name",
      minWidth: 118,
      exportValue: (row) => row.trainerName ?? "--",
    },
    {
      key: "date",
      header: "Date",
      minWidth: 128,
      exportValue: (row) => formatDisplayDate(row.conferenceDate),
      searchValue: (row) => row.conferenceDate ?? "",
    },
    {
      key: "time",
      header: "Time",
      minWidth: 76,
      exportValue: (row) => row.conferenceTime ?? "--",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScreenBanner backgroundColor={Colors.mainColour1} style={[styles.banner, { paddingTop: insets.top + 12 }]}>
        <View style={styles.bannerRow}>
          <Pressable onPress={onBack} hitSlop={8}>
            <Ionicons name="arrow-back" size={18} color={Colors.white} />
          </Pressable>
          <View>
            <AppText style={styles.bannerTitle} color={Colors.white} weight={FontWeight.semiBold}>{title}</AppText>
            <AppText style={styles.bannerSubtitle} color={Colors.white}>{subtitle}</AppText>
          </View>
        </View>
      </ScreenBanner>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.mainColour1]} tintColor={Colors.mainColour1} />}
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.mainColour1} />
          </View>
        ) : (
          <>
            <DataTable
              title={title}
              columns={columns}
              data={items}
              keyExtractor={(row) => row.conferenceUid}
              exportFileName={exportFileName}
              searchPlaceholder="Search..."
              emptyLabel={emptyLabel}
            />
            <View style={styles.secureFooter}>
              <Ionicons name="lock-closed" size={12} color={Colors.gray400} />
              <AppText style={styles.secureFooterText} color={Colors.gray400}>Your information is secure</AppText>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  banner: { paddingBottom: 70 },
  bannerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bannerTitle: { fontSize: Fonts.h3 },
  bannerSubtitle: { fontSize: Fonts.overline, marginTop: 2, opacity: 0.9 },

  scroll: { marginTop: -50, zIndex: 1, elevation: 1 },
  content: { paddingHorizontal: 8, paddingVertical: 16, flexGrow: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60 },

  cellText: { fontSize: Fonts.bodySm },
  actionButton: {
    width: 26,
    height: 26,
    borderRadius: Radius.md,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  secureFooter: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 },
  secureFooterText: { fontSize: Fonts.overline },
});
