import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { SessionTab } from "./sessionsUtils";

type SessionsHeaderProps = {
  dateRangeText?: string;
  activeTab: SessionTab;
  onSelectTab: (tab: SessionTab) => void;
  onSearchChange?: (text: string) => void;
  onFilterPress?: () => void;
  onCalendarPress?: () => void;
};

export default function SessionsHeader({
  dateRangeText = "01 Jul - 31 Jul",
  activeTab,
  onSelectTab,
  onSearchChange,
  onFilterPress,
  onCalendarPress,
}: SessionsHeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchToggle = () => {
    setShowSearchInput((prev) => {
      const next = !prev;
      if (!next) {
        setSearchText("");
        onSearchChange?.("");
      }
      return next;
    });
  };

  const handleTextChange = (val: string) => {
    setSearchText(val);
    onSearchChange?.(val);
  };

  return (
    <View style={styles.container}>
      {/* Top Row: Icon + Title/Subtitle + 3 Action Buttons */}
      <View style={styles.topRow}>
        <View style={styles.titleWithIcon}>
          <View style={styles.iconCircle}>
            <Ionicons name="school" size={24} color={Colors.white} />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>Sessions</Text>
            <Text style={styles.dateRangeSubtitle}>{dateRangeText}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionBtn, showSearchInput && styles.actionBtnActive]}
            onPress={handleSearchToggle}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Search sessions"
          >
            <Ionicons name="search" size={17} color={Colors.white} />
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={onFilterPress}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Filter sessions"
          >
            <Ionicons name="filter" size={17} color={Colors.white} />
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={onCalendarPress}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Calendar view"
          >
            <Ionicons name="calendar-outline" size={17} color={Colors.white} />
          </Pressable>
        </View>
      </View>

      {/* Expandable Search Input */}
      {showSearchInput && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="rgba(255, 255, 255, 0.7)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, UID, or location..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchText}
            onChangeText={handleTextChange}
            autoFocus
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => handleTextChange("")} hitSlop={6}>
              <Ionicons name="close-circle" size={16} color={Colors.white} />
            </Pressable>
          )}
        </View>
      )}

      {/* Tabs Segment: All Sessions | Today | Completed */}
      <View style={styles.tabSegmentContainer}>
        <Pressable
          style={[styles.tabButton, activeTab === "all" && styles.tabButtonActive]}
          onPress={() => onSelectTab("all")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "all" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.tabTextActive,
            ]}
          >
            All Sessions
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === "today" && styles.tabButtonActive,
          ]}
          onPress={() => onSelectTab("today")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "today" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "today" && styles.tabTextActive,
            ]}
          >
            Today
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === "completed" && styles.tabButtonActive,
          ]}
          onPress={() => onSelectTab("completed")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "completed" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.tabTextActive,
            ]}
          >
            Completed
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainColour1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  titleTextContainer: {
    gap: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
  },
  dateRangeSubtitle: {
    fontSize: 11.5,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnActive: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: Colors.white,
    padding: 0,
  },
  tabSegmentContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 70, 180, 0.7)",
    borderRadius: 14,
    padding: 4,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  tabTextActive: {
    color: Colors.mainColour1,
    fontWeight: "700",
  },
});
