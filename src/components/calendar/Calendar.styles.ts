import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { StyleSheet } from "react-native";

export const CalendarStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxxl,
    padding: 16,
    ...Shadows.raised,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  navArrow: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: "#D1D5DB",
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdownPillText: {
    fontSize: 11,
    color: "#1F2937",
    fontWeight: "500",
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 6,
  },
  weekdayLabel: {
    width: 32,
    textAlign: "center",
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  dayCell: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
    borderRadius: Radius.md,
  },
  dayCellSelected: {
    backgroundColor: Colors.mainColour1,
  },
  dayCellInRange: {
    backgroundColor: "#EFF6FF",
  },
  dayText: {
    fontSize: 11,
    color: "#1F2937",
  },
  dayTextSelected: {
    color: Colors.white,
    fontWeight: "700",
  },
  dayTextInRange: {
    color: Colors.mainColour1,
    fontWeight: "600",
  },
  dayTextOutside: {
    color: "#D1D5DB",
  },
  dayTextToday: {
    fontWeight: "700",
    color: Colors.mainColour1,
  },
  dateSummaryBadge: {
    marginTop: 10,
    backgroundColor: "#EFF6FF",
    borderRadius: Radius.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dateSummaryLabel: {
    fontSize: 11,
    color: "#374151",
  },
  dateSummaryValue: {
    fontSize: 12,
    color: Colors.mainColour1,
    fontWeight: "700",
  },
  infoBanner: {
    marginTop: 14,
    backgroundColor: "#EFF6FF",
    borderRadius: Radius.xl,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoBannerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: "#1F2937",
  },
  infoBannerHighlight: {
    color: Colors.mainColour1,
    fontWeight: "700",
  },
});
