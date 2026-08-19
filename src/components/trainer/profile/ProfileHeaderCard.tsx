import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/ui/AppCard";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

export function ProfileHeaderCard({ name, onLogout }: { name: string; onLogout: () => void }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppCard variant="mainColour1" style={styles.card}>
      <View style={styles.avatar}>
        <AppText style={styles.avatarText} weight={FontWeight.bold} color={Colors.mainColour1}>
          {initials}
        </AppText>
      </View>
      <View style={styles.textGroup}>
        <AppText style={styles.welcome} color={Colors.white}>Welcome Back,</AppText>
        <AppText style={styles.name} color={Colors.white} weight={FontWeight.semiBold}>{name}</AppText>
      </View>
      <Pressable style={styles.logoutButton} onPress={onLogout} hitSlop={8}>
        <Ionicons name="power" size={18} color={Colors.white} />
      </Pressable>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, marginBottom: 14 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: Fonts.body },
  textGroup: { flex: 1 },
  welcome: { fontSize: Fonts.overline, opacity: 0.85 },
  name: { fontSize: Fonts.h3, marginTop: 2 },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
