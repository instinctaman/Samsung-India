import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";

type StatCardProps = {
  icon: ReactNode;
  iconBg: string;
  title: string;
  value: number | string;
  valueColor: string;
  subtext: string;
  subtextColor?: string;
  isActive?: boolean;
};

export default function StatCard({
  icon,
  iconBg,
  title,
  value,
  valueColor,
  subtext,
  subtextColor = "#9CA3AF",
  isActive = false,
}: StatCardProps) {
  return (
    <View style={[styles.card, isActive && styles.activeCard]}>
      <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.value, { color: valueColor }]}>
        {value}
      </Text>
      <Text style={[styles.subtext, { color: subtextColor }]} numberOfLines={1}>
        {subtext}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  activeCard: {
    borderColor: Colors.mainColour1,
    borderWidth: 1.8,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 9.5,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 3,
    textAlign: "center",
  },
  subtext: {
    fontSize: 9,
    marginTop: 2,
    textAlign: "center",
    fontWeight: "400",
  },
});
