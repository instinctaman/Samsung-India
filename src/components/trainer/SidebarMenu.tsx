import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";

const TRAININGS_SUB_ITEMS = ["Add New Trainings", "Pending Trainings", "Training List", "Other Trainings"];

type SidebarMenuProps = {
  onNavigate: (label: string) => void;
};

export default function SidebarMenu({ onNavigate }: SidebarMenuProps) {
  const [trainingsOpen, setTrainingsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <AppText style={styles.brand} weight={FontWeight.bold} color={Colors.mainColour1}>SAMSUNG</AppText>
      <AppText style={styles.brandSubtitle} color={Colors.gray600}>Training &amp; Operations System</AppText>

      <View style={styles.list}>
        <Pressable style={[styles.item, styles.itemActive]} onPress={() => onNavigate("Home")}>
          <Ionicons name="grid" size={18} color={Colors.white} />
          <AppText style={styles.itemLabelActive} weight={FontWeight.medium}>Home</AppText>
        </Pressable>

        <Pressable style={styles.item} onPress={() => setTrainingsOpen((value) => !value)}>
          <Ionicons name="people-outline" size={18} color={Colors.gray600} />
          <AppText style={styles.itemLabel}>Trainings</AppText>
          <Ionicons
            name={trainingsOpen ? "chevron-down" : "chevron-forward"}
            size={16}
            color={Colors.gray600}
            style={styles.chevron}
          />
        </Pressable>

        {trainingsOpen && (
          <View style={styles.subList}>
            {TRAININGS_SUB_ITEMS.map((label) => (
              <Pressable key={label} style={styles.subItem} onPress={() => onNavigate(label)}>
                <View style={styles.bullet} />
                <AppText style={styles.subItemLabel} color={Colors.gray600}>{label}</AppText>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable style={styles.item} onPress={() => onNavigate("Participants")}>
          <Ionicons name="people-circle-outline" size={18} color={Colors.gray600} />
          <AppText style={styles.itemLabel}>Participants</AppText>
        </Pressable>

        <Pressable style={styles.item} onPress={() => onNavigate("Attendance")}>
          <Ionicons name="document-text-outline" size={18} color={Colors.gray600} />
          <AppText style={styles.itemLabel}>Attendance</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 12, paddingHorizontal: 18, paddingBottom: 24 },
  brand: { fontSize: Fonts.h3, letterSpacing: 1 },
  brandSubtitle: { fontSize: Fonts.overline, marginTop: 2, marginBottom: 20 },
  list: { gap: 4 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 11, paddingHorizontal: 12, borderRadius: Radius.lg },
  itemActive: { backgroundColor: Colors.mainColour1 },
  itemLabel: { fontSize: Fonts.body, color: Colors.gray600, flex: 1 },
  itemLabelActive: { fontSize: Fonts.body, color: Colors.white, flex: 1 },
  chevron: { marginLeft: "auto" },
  subList: { marginLeft: 30, marginBottom: 6, gap: 2 },
  subItem: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8 },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.gray400 },
  subItemLabel: { fontSize: Fonts.bodySm },
});
