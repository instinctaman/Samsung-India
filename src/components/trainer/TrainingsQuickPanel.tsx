import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";

const TRAININGS_SUB_ITEMS = ["Add New Trainings", "Pending Trainings", "Training List", "Other Trainings"];

type TrainingsQuickPanelProps = {
  onSelect: (label: string) => void;
};

export default function TrainingsQuickPanel({ onSelect }: TrainingsQuickPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people" size={18} color={Colors.white} />
        <AppText style={styles.headerLabel} weight={FontWeight.medium} color={Colors.white}>Trainings</AppText>
        <Ionicons name="chevron-down" size={16} color={Colors.white} />
      </View>

      <View style={styles.subList}>
        {TRAININGS_SUB_ITEMS.map((label) => (
          <Pressable key={label} style={styles.subItem} onPress={() => onSelect(label)}>
            <View style={styles.bullet} />
            <AppText style={styles.subItemLabel}>{label}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.mainColour1,
    borderRadius: Radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  headerLabel: { fontSize: Fonts.body, flex: 1 },
  subList: { marginTop: 6, marginLeft: 8 },
  subItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.gray400 },
  subItemLabel: { fontSize: Fonts.body },
});
