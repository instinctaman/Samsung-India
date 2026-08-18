import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { JSX } from "react/jsx-runtime";

export type DashboardTab = "home" | "plan" | "profile" | "more";

type DashboardBottomNavProps = {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
};

export default function DashboardBottomNav({
  activeTab = "home",
  onSelectTab,
}: DashboardBottomNavProps) {
  const tabs: {
    key: DashboardTab;
    label: string;
    icon: (isActive: boolean) => JSX.Element;
  }[] = [
    {
      key: "home",
      label: "Home",
      icon: (active) => (
        <Ionicons
          name={active ? "home" : "home-outline"}
          size={24}
          color={active ? Colors.mainColour1 : "#6B7280"}
        />
      ),
    },
    {
      key: "plan",
      label: "Plan",
      icon: (active) => (
        <Ionicons
          name={active ? "calendar" : "calendar-outline"}
          size={24}
          color={active ? Colors.mainColour1 : "#6B7280"}
        />
      ),
    },
    {
      key: "profile",
      label: "Profile",
      icon: (active) => (
        <Ionicons
          name={active ? "person-circle" : "person-circle-outline"}
          size={24}
          color={active ? Colors.mainColour1 : "#6B7280"}
        />
      ),
    },
    {
      key: "more",
      label: "More",
      icon: (active) => (
        <Ionicons
          name={active ? "grid" : "grid-outline"}
          size={24}
          color={active ? Colors.mainColour1 : "#6B7280"}
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            {tab.icon(isActive)}
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? Colors.mainColour1 : "#6B7280" },
                isActive && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    ...Shadows.raised,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    minWidth: 64,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },
  activeTabLabel: {
    fontWeight: "700",
  },
});
