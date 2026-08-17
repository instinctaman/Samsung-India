import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LinkIcon from "@/assets/images/svg/session/link.svg";
import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";

type SessionDashboardHeaderProps = {
  conferenceUid: string;
  timestamp?: string;
  onBack: () => void;
  onCopyLink: () => void;
  onShowQR: () => void;
  onRefresh: () => void;
  onReport: () => void;
  onEndSession: () => void;
};

export default function SessionDashboardHeader({
  conferenceUid,
  timestamp = "Generated: 29 July 2026, 11:09 AM",
  onBack,
  onCopyLink,
  onShowQR,
  onRefresh,
  onReport,
  onEndSession,
}: SessionDashboardHeaderProps) {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top > 0 ? insets.top + 8 : 16;

  return (
    <>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: topPadding }]}>
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.leftContent}>
            {/* Back Circular Button */}
            <Pressable
              style={styles.backCircleBtn}
              onPress={onBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </Pressable>

            {/* Title, Badge & Subtitle */}
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>SESSION DASHBOARD</Text>
              <View style={styles.uidBadge}>
                <Text style={styles.uidText}>
                  {conferenceUid ? conferenceUid.toUpperCase() : "CONF2627273"}
                </Text>
              </View>
              <Text style={styles.subtitle}>{timestamp}</Text>
            </View>
          </View>

          {/* Right Top Buttons: Copy Link & Show QR */}
          <View style={styles.rightButtons}>
            <Pressable
              style={styles.headerSquareBtn}
              onPress={onCopyLink}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Copy Link"
            >
              <LinkIcon width={19} height={19} />
              <Text style={styles.squareBtnText}>Copy Link</Text>
            </Pressable>

            <Pressable
              style={styles.headerSquareBtn}
              onPress={onShowQR}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Show QR"
            >
              <Ionicons name="qr-code-outline" size={19} color={Colors.white} />
              <Text style={styles.squareBtnText}>Show QR</Text>
            </Pressable>
          </View>
        </View>

        {/* Bottom Action Bar */}
        <View style={styles.bottomActionBar}>
          {/* Left Side: Refresh Button + Report Button */}
          <View style={styles.bottomLeftActions}>
            <Pressable
              style={styles.refreshBtn}
              onPress={onRefresh}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Refresh"
            >
              <Ionicons name="reload" size={18} color="#0066FF" />
            </Pressable>

            <Pressable
              style={styles.reportBtn}
              onPress={onReport}
              accessibilityRole="button"
              accessibilityLabel="Report"
            >
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#374151"
              />
              <Text style={styles.reportBtnText}>Report</Text>
            </Pressable>
          </View>

          {/* Right Side: End Session Red Button */}
          <Pressable
            style={styles.endSessionBtn}
            onPress={onEndSession}
            accessibilityRole="button"
            accessibilityLabel="End Session"
          >
            <View style={styles.whiteStopIcon}>
              <Ionicons name="square" size={11} color={Colors.white} />
            </View>
            <Text style={styles.endSessionBtnText}>End Session</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0066FF",
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  backCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  titleWrapper: {
    gap: 3,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  uidBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  uidText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 9.5,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    marginTop: 2,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 6,
  },
  headerSquareBtn: {
    width: 52,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  squareBtnText: {
    fontSize: 8,
    color: Colors.white,
    fontWeight: "600",
  },
  bottomActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 6,
    marginTop: 14,
    ...Shadows.card,
  },
  bottomLeftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  refreshBtn: {
    width: 40,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.2,
    borderColor: "#D1D5DB",
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  reportBtnText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "700",
  },
  endSessionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#DC2626",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  whiteStopIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  endSessionBtnText: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: "700",
  },
});
