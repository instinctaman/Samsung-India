import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import ScreenBanner from "@/components/ui/ScreenBanner";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Shadows } from "@/theme/shadows";

type DashboardHeaderProps = {
  name: string;
  companyId?: string | null;
  avatarUri?: string | null;
  onOpenProfile: () => void;
  onLogout: () => void;
};

export default function DashboardHeader({
  name,
  companyId = "2020045897",
  avatarUri,
  onOpenProfile,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <ScreenBanner backgroundColor={Colors.mainColour1} style={styles.banner}>
      <View style={styles.topRow}>
        <View style={styles.avatarWithId}>
          <Pressable
            style={styles.avatarWrapper}
            onPress={onOpenProfile}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Account settings"
          >
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : require("@/assets/images/Icons/face_icon.png")
              }
              style={styles.avatarImage}
              resizeMode="cover"
            />
            <View style={styles.avatarOnlineBadge} />
          </Pressable>

          <View style={styles.companyIdContainer}>
            <AppText style={styles.companyIdLabel} color={Colors.white}>
              Company ID
            </AppText>
            <AppText
              style={styles.companyIdValue}
              color={Colors.white}
              weight={FontWeight.bold}
            >
              {companyId || "2020045897"}
            </AppText>
          </View>
        </View>

        <Pressable
          style={styles.powerButton}
          onPress={onLogout}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <Ionicons name="power" size={25} color={Colors.mainColour1} />
        </Pressable>
      </View>

      <View style={styles.welcomeSection}>
        <AppText style={styles.welcomeGreeting} color={Colors.white}>
          Welcome Back,
        </AppText>
        <AppText
          style={styles.welcomeName}
          color={Colors.white}
          weight={FontWeight.bold}
        >
          {name}
        </AppText>
      </View>
    </ScreenBanner>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 18,
    borderRadius: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarWithId: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  avatarWrapper: {
    position: "relative",
    width: 52,
    height: 52,
  },
  avatarImage: {
    width: 81,
    height: 60,
    borderRadius: 26,
  },
  avatarOnlineBadge: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: Colors.mainColour1,
  },
  companyIdContainer: {
    gap: 1,
  },
  companyIdLabel: {
    fontSize: 7.5,
  },
  companyIdValue: {
    fontSize: 10.5,
    letterSpacing: 0.3,
  },
  powerButton: {
    width: 41,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  welcomeSection: {
    marginTop: 14,
  },
  welcomeGreeting: {
    fontSize: 12.5,
    lineHeight: 18,
    opacity: 0.9,
  },
  welcomeName: {
    fontSize: 20,
    lineHeight: 26,
    marginTop: 2,
  },
});
