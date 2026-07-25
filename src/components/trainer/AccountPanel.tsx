import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";

type AccountPanelProps = {
  name: string;
  role: string;
  onSettings: () => void;
  onLogout: () => void;
};

export default function AccountPanel({ name, role, onSettings, onLogout }: AccountPanelProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <AppText style={styles.avatarText} weight={FontWeight.bold} color={Colors.white}>{initials}</AppText>
        </View>
        <AppText style={styles.name} weight={FontWeight.medium}>{name}</AppText>
        <AppText style={styles.role} color={Colors.gray600}>{role}</AppText>
      </View>

      <View style={styles.list}>
        <Pressable style={styles.item} onPress={onSettings}>
          <Ionicons name="settings-outline" size={18} color={Colors.gray600} />
          <AppText style={styles.itemLabel}>Settings</AppText>
        </Pressable>

        <Pressable style={styles.item} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <AppText style={styles.itemLabel} color={Colors.danger}>Logout</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 12, paddingHorizontal: 18, paddingBottom: 24 },
  profile: { alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray100, marginBottom: 12 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: Fonts.h3 },
  name: { fontSize: Fonts.body },
  role: { fontSize: Fonts.bodySm, marginTop: 2 },
  list: { gap: 4 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 12, borderRadius: Radius.lg },
  itemLabel: { fontSize: Fonts.body, flex: 1 },
});
