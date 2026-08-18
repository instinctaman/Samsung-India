import { StyleSheet, View } from "react-native";

import ActionIcon from "@/assets/images/svg/action.svg";
import { DataTableColumn } from "@/components/ui/DataTable";
import AppText from "@/components/ui/AppText";
import { StatusPill } from "@/components/ui/StatusPill";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
import { formatDisplayDate } from "@/utils/formatDisplayDate";
import { AttendanceListItem } from "@/api/attendanceList";

export function useAttendanceListColumns(): DataTableColumn<AttendanceListItem>[] {
  return [
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
      render: () => (
        <View style={styles.actionButton}>
          <ActionIcon width={15} height={15} />
        </View>
      ),
      exportValue: () => "",
    },
    {
      key: "status",
      header: "Status",
      minWidth: 92,
      render: (row) =>
        row.marked ? <StatusPill label="Marked" tone="success" /> : <StatusPill label="Not Marked" tone="warning" />,
      exportValue: (row) => (row.marked ? "Marked" : "Not Marked"),
    },
    {
      key: "name",
      header: "Name",
      minWidth: 128,
      exportValue: (row) => row.name,
    },
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
      exportValue: (row) => formatDisplayDate(row.date),
      searchValue: (row) => row.date ?? "",
    },
  ];
}

const styles = StyleSheet.create({
  cellText: { fontSize: Fonts.bodySm },
  actionButton: {
    width: 26,
    height: 26,
    borderRadius: Radius.md,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
});
