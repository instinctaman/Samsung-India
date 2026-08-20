import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Green Section */}
        <View style={styles.successArea}>
          <View style={styles.successHalo}>
            <Sparkle width={213} height={101} style={styles.sparkle} />
            <View style={styles.successRing}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={60} color={Colors.success} />
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

        {/* Content Section: Full Height Card + Actions directly underneath */}
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

          {/* Bottom Actions directly under card */}
          <View style={styles.bottomActions}>
            <Pressable
              style={styles.continueButton}
              onPress={onContinue}
              accessibilityRole="button"
              accessibilityLabel="Great, Continue"
            >
              <AppText
                style={styles.continueText}
                color={Colors.white}
                weight={FontWeight.bold}
              >
                Great, Continue
              </AppText>
            </Pressable>

            <Pressable
              style={styles.homeLink}
              onPress={onHome}
              accessibilityRole="button"
              accessibilityLabel="Back to Home"
            >
              <Ionicons name="home-outline" size={16} color={Colors.success} />
              <AppText style={styles.homeText} color={Colors.success}>
                Back to Home
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
        <Ionicons name={icon} size={27} color={Colors.success} />
      </View>
      <View style={styles.detailTextColumn}>
        <AppText style={styles.detailLabel}>{label}</AppText>
        <AppText style={styles.detailValue} weight={FontWeight.medium}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

// Preserved alternate implementation (pre-redesign layout) from before the
// upstream/Tushar merge. AccessGrantedView above is the active component; this is kept
// intact rather than deleted since the same access-granted flow/styling is relied on
// elsewhere and shouldn't be lost.
export function AccessGrantedViewLegacy({ details, onContinue, onHome }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={legacyStyles.container} edges={["top", "bottom"]}>
      <View style={[legacyStyles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="dark" animated />
      <View style={legacyStyles.successArea}>
        <View style={legacyStyles.successHalo}>
          <Sparkle width={219} height={101} style={legacyStyles.sparkle} />
          <View style={legacyStyles.successRing}>
            <View style={legacyStyles.successCircle}>
              <Ionicons name="checkmark" size={Fonts.iconSize} color={Colors.success} />
            </View>
          </View>
        </View>
        <AppText style={legacyStyles.title} color={Colors.white} weight={FontWeight.semiBold}>Access Granted!</AppText>
        <AppText style={legacyStyles.subtitle} color={Colors.white}>Your attendance is permanently recorded.</AppText>
      </View>

      <View style={legacyStyles.content}>
        <View style={legacyStyles.detailsCard}>
          {details.map((detail, index) => (
            <DetailRowLegacy key={detail.label} {...detail} isLast={index === details.length - 1} />
          ))}
        </View>
        <Pressable style={legacyStyles.continueButton} onPress={onContinue}>
          <AppText style={legacyStyles.continueText} color={Colors.white} weight={FontWeight.medium}>Great, Continue</AppText>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </Pressable>
        <Pressable style={legacyStyles.homeLink} onPress={onHome}>
          <Ionicons name="home-outline" size={13} color={Colors.success} />
          <AppText style={legacyStyles.homeText} color={Colors.success}>Back to Home</AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function DetailRowLegacy({ label, value, icon, isLast }: AccessGrantedDetail & { isLast: boolean }) {
  return (
    <View style={[legacyStyles.detailRow, !isLast && legacyStyles.detailBorder]}>
      <View style={legacyStyles.detailIcon}><Ionicons name={icon} size={20} color={Colors.success} /></View>
      <View>
        <AppText style={legacyStyles.detailLabel}>{label}</AppText>
        <AppText style={legacyStyles.detailValue} weight={FontWeight.medium}>{value}</AppText>
      </View>
    </View>
  );
}

const legacyStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2FFF9" },
  statusBarBackground: { position: "absolute", top: 0, left: 0, right: 0, backgroundColor: Colors.success },
  successArea: { height: "80%", minHeight: 350, alignItems: "center", justifyContent: "center", backgroundColor: Colors.success, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, paddingBottom: 72 },
  successHalo: { width: 144, height: 144, borderRadius: 72, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0.035)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.06)" },
  sparkle: { position: "absolute", top: -65, zIndex: 0 },
  successRing: { width: 116, height: 116, zIndex: 1, borderRadius: 58, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0.07)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" },
  successCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", shadowColor: Colors.black, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 2 },
  title: { marginTop: 23, fontSize: Fonts.h1 },
  subtitle: { marginTop: 4, fontSize: Fonts.body },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 21, marginTop: -165 },
  detailsCard: {
    width: "100%", backgroundColor: Colors.white, borderRadius: 17, paddingHorizontal: 12, paddingVertical: 3, shadowColor: Colors.black, shadowOpacity: 0.12, shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10, elevation: 4
  },
  detailRow: { minHeight: 46, flexDirection: "row", alignItems: "center", gap: 10 },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  detailIcon: { width: 25, height: 25, borderRadius: 5, backgroundColor: "#D8F8EB", alignItems: "center", justifyContent: "center" },
  detailLabel: { fontSize: Fonts.overline, color: Colors.gray600 },
  detailValue: { fontSize: Fonts.bodySm, marginTop: 1 },
  continueButton: { width: "100%", height: 32, marginTop: 15, borderRadius: 7, backgroundColor: "#00A86B", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  continueText: { fontSize: Fonts.body },
  homeLink: { marginTop: 16, flexDirection: "row", alignItems: "center", gap: 5 },
  homeText: { fontSize: Fonts.caption },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FFF9",
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.success,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  successArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 270,
    paddingHorizontal: 20,
  },
  successHalo: {
    width: 213,
    height: 213,
    borderRadius: 106.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  sparkle: { position: "absolute", top: -35, zIndex: 0 },
  successRing: {
    width: 168,
    height: 168,
    zIndex: 1,
    borderRadius: 84,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 3, blur: 6, opacity: 0.08, elevation: 2 }),
  },
  title: {
    marginTop: 20,
    fontSize: 29,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    textAlign: "center",
    opacity: 0.95,
  },

  // Overlapping Content
  content: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 20,
    marginTop: -245,
  },
  detailsCard: {
    width: "100%",
    height: 295,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-around",
    ...createShadow({ x: 0, y: 8, blur: 20, opacity: 0.09, elevation: 5 }),
  },
  detailRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#D8F8EB",
    alignItems: "center",
    justifyContent: "center",
  },
  detailTextColumn: {
    flex: 1,
    gap: 1,
  },
  detailLabel: { fontSize: 12, color: Colors.gray600 },
  detailValue: { fontSize: 14, color: "#111827" },

  // Bottom Actions directly under card
  bottomActions: {
    width: "100%",
    alignItems: "center",
    gap: 14,
    marginTop: 22,
  },
  continueButton: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    backgroundColor: "#00A86B",
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 4, blur: 10, opacity: 0.12, elevation: 3 }),
  },
  continueText: { fontSize: 18, fontWeight: "700" },
  homeLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  homeText: { fontSize: 12, fontWeight: "600" },
});
