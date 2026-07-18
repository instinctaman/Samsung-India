import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountCircle from "@/assets/images/svg/account_circle.svg";
import Calendar1 from "@/assets/images/svg/calender2.svg";
import Calendar from "@/assets/images/svg/calender.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { Spacing } from "@/theme/spacing";

type AppFooterProps = {
  activeTab?: "plan" | "profile";
};

export default function AppFooter({
  activeTab = "plan",
}: AppFooterProps) {
  const router = useRouter();

  const isPlanActive = activeTab === "plan";
  const isProfileActive = activeTab === "profile";

  return (
    <SafeAreaView style={styles.bottomArea} edges={["bottom"]}>
      <View style={styles.navBar}>
        <Pressable
          style={styles.navItem}
          onPress={() => router.replace("/session_detail")}
        >
          <Calendar1
            width={23}
            height={23}
            color={isPlanActive ? Colors.mainColour1 : Colors.gray600}
          />

          <AppText
            style={[
              styles.navLabel,
              isPlanActive && styles.navLabelActive,
            ]}
          >
            Plan
          </AppText>
        </Pressable>

        <Pressable
          style={styles.centerAction}
          accessibilityLabel="Open session calendar"
          onPress={() => router.replace("/session_detail")}
        >
          <Calendar width={31} height={31} />
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <AccountCircle
            width={23}
            height={23}
            color={isProfileActive ? Colors.mainColour1 : Colors.gray600}
          />

          <AppText
            style={[
              styles.navLabel,
              isProfileActive && styles.navLabelActive,
            ]}
          >
            Profile
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomArea: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: 50,
    ...Shadows.footer,
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },

  navLabel: {
    fontSize: Fonts.caption,
    color: Colors.gray600,
  },

  navLabelActive: {
    color: Colors.mainColour1,
  },

  centerAction: {
    position: "absolute",
    alignSelf: "center",
    left: "50%",
    marginLeft: -29,
    top: -25,
    width: 58,
    height: 58,
    borderRadius: Radius.pill,
    backgroundColor: Colors.mainColour1,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.raised,
  },
});