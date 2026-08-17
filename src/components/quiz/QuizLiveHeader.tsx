import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

export type QuizLiveHeaderProps = {
  onSync?: () => void;
  onRefresh?: () => void;
  isConnected?: boolean;
  isSyncing?: boolean;
  isRefreshing?: boolean;
};

export default function QuizLiveHeader({
  onSync,
  onRefresh,
  isConnected = true,
  isSyncing = false,
  isRefreshing = false,
}: QuizLiveHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Title with Flash Icon */}
      <View style={styles.titleSection}>
        <Ionicons name="flash" size={17} color="#FACC15" />
        <AppText
          style={styles.titleText}
          color={Colors.white}
          weight={FontWeight.bold}
        >
          LIVE QUIZ
        </AppText>
      </View>

      {/* Header Actions */}
      <View style={styles.actions}>
        {/* Sync Live Quiz Button */}
        {onSync && (
          <Pressable
            style={styles.actionButton}
            onPress={onSync}
            accessibilityRole="button"
            accessibilityLabel="Sync live quiz"
          >
            <Ionicons
              name="sync"
              size={12}
              color={Colors.headerBlue}
              style={isSyncing ? styles.spinningIcon : undefined}
            />
            <AppText
              style={styles.actionButtonText}
              color={Colors.headerBlue}
              weight={FontWeight.bold}
            >
              SYNC LIVE QUIZ
            </AppText>
          </Pressable>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <Pressable
            style={styles.actionButton}
            onPress={onRefresh}
            accessibilityRole="button"
            accessibilityLabel="Refresh"
          >
            <Ionicons
              name="sync"
              size={12}
              color={Colors.headerBlue}
              style={isRefreshing ? styles.spinningIcon : undefined}
            />
            <AppText
              style={styles.actionButtonText}
              color={Colors.headerBlue}
              weight={FontWeight.bold}
            >
              REFRESH
            </AppText>
          </Pressable>
        )}

        {/* Connected Wi-Fi Indicator */}
        <View
          style={[
            styles.wifiBadge,
            { backgroundColor: isConnected ? Colors.statusGreen : Colors.gray400 },
          ]}
        >
          <Ionicons name="wifi" size={13} color={Colors.white} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    marginHorizontal: 14,
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: Colors.headerBlue,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  titleText: {
    fontSize: 17,
    letterSpacing: 0.3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionButton: {
    height: 24,
    borderRadius: 6,
    paddingHorizontal: 7,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButtonText: {
    fontSize: 10,
    letterSpacing: 0.2,
  },

  spinningIcon: {
    transform: [{ rotate: "180deg" }],
  },
  wifiBadge: {
    width: 26,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
