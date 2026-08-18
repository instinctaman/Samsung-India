import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Sparkle from "@/assets/images/svg/sparkle.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { createShadow } from "@/theme/shadows";

export type AccessGrantedDetail = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  details: AccessGrantedDetail[];
  onContinue: () => void;
  onHome: () => void;
};

export default function AccessGrantedView({
  details,
  onContinue,
  onHome,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="light" animated />
      <View style={styles.successArea}>
        <View style={styles.successHalo}>
          <Sparkle width={219} height={101} style={styles.sparkle} />
          <View style={styles.successRing}>
            <View style={styles.successCircle}>
              <Ionicons
                name="checkmark"
                size={Fonts.iconSize}
                color={Colors.success}
              />
            </View>
          </View>
        </View>
        <AppText
          style={styles.title}
          color={Colors.white}
          weight={FontWeight.semiBold}
        >
          Access Granted!
        </AppText>
        <AppText style={styles.subtitle} color={Colors.white}>
          Your attendance is permanently recorded.
        </AppText>
      </View>

      <View style={styles.content}>
        <View style={styles.detailsCard}>
          {details.map((detail, index) => (
            <DetailRow
              key={detail.label}
              {...detail}
              isLast={index === details.length - 1}
            />
          ))}
        </View>
        <Pressable style={styles.continueButton} onPress={onContinue}>
          <AppText
            style={styles.continueText}
            color={Colors.white}
            weight={FontWeight.medium}
          >
            Great, Continue
          </AppText>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </Pressable>
        <Pressable style={styles.homeLink} onPress={onHome}>
          <Ionicons name="home-outline" size={13} color={Colors.success} />
          <AppText style={styles.homeText} color={Colors.success}>
            Back to Home
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  icon,
  isLast,
}: AccessGrantedDetail & { isLast: boolean }) {
  return (
    <View style={[styles.detailRow, !isLast && styles.detailBorder]}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={20} color={Colors.success} />
      </View>
      <View>
        <AppText style={styles.detailLabel}>{label}</AppText>
        <AppText style={styles.detailValue} weight={FontWeight.medium}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2FFF9" },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.success,
  },
  successArea: {
    height: "80%",
    minHeight: 350,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    paddingBottom: 72,
  },
  successHalo: {
    width: 144,
    height: 144,
    borderRadius: 72,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  sparkle: { position: "absolute", top: -65, zIndex: 0 },
  successRing: {
    width: 116,
    height: 116,
    zIndex: 1,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  successCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 3, blur: 6, opacity: 0.08, elevation: 2 }),
  },
  title: { marginTop: 23, fontSize: Fonts.h1 },
  subtitle: { marginTop: 4, fontSize: Fonts.body },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 21,
    marginTop: -165,
  },
  detailsCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 17,
    paddingHorizontal: 12,
    paddingVertical: 3,
    ...createShadow({ x: 0, y: 3, blur: 10, opacity: 0.12, elevation: 4 }),
  },
  detailRow: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  detailIcon: {
    width: 25,
    height: 25,
    borderRadius: 5,
    backgroundColor: "#D8F8EB",
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: { fontSize: Fonts.overline, color: Colors.gray600 },
  detailValue: { fontSize: Fonts.bodySm, marginTop: 1 },
  continueButton: {
    width: "100%",
    height: 48,
    marginTop: 18,
    borderRadius: 10,
    backgroundColor: "#00A86B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueText: { fontSize: Fonts.body, fontWeight: "600" },
  homeLink: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  homeText: { fontSize: Fonts.caption },
});
