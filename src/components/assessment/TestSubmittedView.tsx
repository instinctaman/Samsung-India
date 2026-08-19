import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
import { createShadow } from "@/theme/shadows";

export type SubmissionSummaryRow = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
};

type Props = {
  rows: SubmissionSummaryRow[];
  onGoToDashboard: () => void;
  title?: string;
  thankYouText?: string;
};

const CONFETTI = [
  { top: 2, left: 6, color: "#F5B301" },
  { top: 30, left: -8, color: Colors.mainColour1 },
  { top: -8, right: 2, color: Colors.success },
  { bottom: 14, right: -10, color: "#F5B301" },
  { bottom: -6, left: 22, color: Colors.mainColour1 },
];

export default function TestSubmittedView({
  rows,
  onGoToDashboard,
  title = "Test Submitted Successfully!",
  thankYouText = "Your Test has been submitted successfully. You will be notified once the results are available.",
}: Props) {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.badgeWrap}>
          {CONFETTI.map((dot, index) => (
            <View
              key={index}
              style={[
                styles.confettiDot,
                { backgroundColor: dot.color },
                dot as ViewStyle,
              ]}
            />
          ))}
          <View style={styles.badgeCircle}>
            <Ionicons name="checkmark" size={44} color={Colors.white} />
          </View>
        </View>

        <AppText style={styles.title} weight={FontWeight.semiBold}>
          {title}
        </AppText>
        <AppText style={styles.subtitle} color={Colors.gray600}>
          Your assessment has been submitted and recorded successfully.
        </AppText>

        <View style={styles.card}>
          <AppText style={styles.cardTitle} weight={FontWeight.medium}>
            Submission Summary
          </AppText>
          {rows.map((row, index) => (
            <SummaryRow
              key={row.label}
              {...row}
              isLast={index === rows.length - 1}
            />
          ))}
        </View>

        <View style={styles.thankYouBox}>
          <View style={styles.thankYouIcon}>
            <Ionicons name="happy" size={20} color={Colors.success} />
          </View>
          <View style={styles.thankYouTextWrap}>
            <AppText
              style={styles.thankYouTitle}
              color={Colors.success}
              weight={FontWeight.semiBold}
            >
              Thank you!
            </AppText>
            <AppText style={styles.thankYouText} color={Colors.success}>
              {thankYouText}
            </AppText>
          </View>
        </View>

        <Pressable
          style={styles.dashboardButton}
          onPress={() => {
            if (typeof document !== "undefined") {
              (document.activeElement as HTMLElement)?.blur?.();
              setTimeout(onGoToDashboard, 10);
            } else {
              onGoToDashboard();
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Go To Dashboard"
        >
          <Ionicons name="home" size={18} color={Colors.white} />
          <AppText color={Colors.white} weight={FontWeight.medium}>
            Go To Dashboard
          </AppText>
        </Pressable>

        <View style={styles.secureNotice}>
          <Ionicons name="lock-closed" size={12} color={Colors.gray600} />
          <AppText style={styles.secureNoticeText} color={Colors.gray600}>
            Your data is secure and encrypted
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  icon,
  iconColor,
  iconBg,
  isLast,
}: SubmissionSummaryRow & { isLast: boolean }) {
  return (
    <View style={[styles.summaryRow, !isLast && styles.summaryRowBorder]}>
      <View style={[styles.summaryIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <AppText style={styles.summaryLabel} color={Colors.gray600}>
        {label}
      </AppText>
      <AppText style={styles.summaryValue} weight={FontWeight.medium}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 36,
  },

  badgeWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  confettiDot: { position: "absolute", width: 8, height: 8, borderRadius: 4 },
  badgeCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 4, blur: 8, opacity: 0.15, elevation: 4 }),
  },

  title: { marginTop: 20, fontSize: Fonts.h2, textAlign: "center" },
  subtitle: {
    marginTop: 6,
    fontSize: Fonts.bodySm,
    textAlign: "center",
    lineHeight: 19,
  },

  card: {
    width: "100%",
    marginTop: 24,
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: 16,
    ...createShadow({ x: 0, y: 3, blur: 8, opacity: 0.06, elevation: 2 }),
  },
  cardTitle: { fontSize: Fonts.body, marginBottom: 6 },
  summaryRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabel: { flex: 1, fontSize: Fonts.bodySm },
  summaryValue: { fontSize: Fonts.bodySm },

  thankYouBox: {
    width: "100%",
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: "#E8FBF1",
    borderRadius: Radius.xl,
    padding: 14,
  },
  thankYouIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  thankYouTextWrap: { flex: 1 },
  thankYouTitle: { fontSize: Fonts.bodySm },
  thankYouText: { fontSize: Fonts.overline, marginTop: 2, lineHeight: 16 },

  dashboardButton: {
    width: "100%",
    height: 50,
    marginTop: 20,
    borderRadius: Radius.xl,
    backgroundColor: Colors.success,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  secureNotice: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secureNoticeText: { fontSize: Fonts.overline },
});
