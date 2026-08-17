import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { TraineeTab } from "@/hooks/useTraineeHome";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

export type TraineeBottomNavigationProps = {
  activeTab: TraineeTab;
  onSelectTab: (tab: TraineeTab) => void;
};

export default function TraineeBottomNavigation({
  activeTab = "home",
  onSelectTab,
}: TraineeBottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.container}>
        {/* Left: Rank Tab */}
        <Pressable
          style={styles.tabItem}
          onPress={() => onSelectTab("rank")}
          accessibilityRole="button"
          accessibilityLabel="Rank"
          hitSlop={8}
        >
          <Ionicons
            name={activeTab === "rank" ? "podium" : "podium-outline"}
            size={24}
            color={activeTab === "rank" ? Colors.headerBlue : Colors.bottomNavInactive}
          />
          <AppText
            style={[
              styles.tabLabel,
              activeTab === "rank" && styles.tabLabelActive,
            ]}
            weight={activeTab === "rank" ? FontWeight.bold : FontWeight.medium}
          >
            Rank
          </AppText>
        </Pressable>

        {/* Center: Raised Circular Home Button */}
        <View style={styles.centerButtonWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.centerButton,
              pressed && styles.centerButtonPressed,
            ]}
            onPress={() => onSelectTab("home")}
            accessibilityRole="button"
            accessibilityLabel="Home"
          >
            <Ionicons name="home" size={28} color={Colors.white} />
          </Pressable>
        </View>

        {/* Right: Profile Tab */}
        <Pressable
          style={styles.tabItem}
          onPress={() => onSelectTab("profile")}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          hitSlop={8}
        >
          <Ionicons
            name={activeTab === "profile" ? "person-circle" : "person-circle-outline"}
            size={26}
            color={activeTab === "profile" ? Colors.headerBlue : Colors.bottomNavInactive}
          />
          <AppText
            style={[
              styles.tabLabel,
              activeTab === "profile" && styles.tabLabelActive,
            ]}
            weight={activeTab === "profile" ? FontWeight.bold : FontWeight.medium}
          >
            Profile
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.nav,
    borderTopRightRadius: Radius.nav,
    ...Shadows.footer,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingHorizontal: 24,
    height: 60,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    gap: 3,
  },
  tabLabel: {
    fontSize: Fonts.caption,
    color: Colors.bottomNavInactive,
  },
  tabLabelActive: {
    color: Colors.headerBlue,
  },
  centerButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    top: -18,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.headerBlue,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.homeButton,
  },
  centerButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
