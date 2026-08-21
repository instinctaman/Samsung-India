import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SmileIcon from "@/assets/images/svg/smile.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/typography";
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

const CONFETTI_ITEMS = [
  { top: 12, left: 34, color: "#F59E0B", rotate: "-15deg", width: 6, height: 10 },
  { top: 2, right: 65, color: "#10B981", rotate: "25deg", width: 6, height: 10 },
  { top: 22, right: 30, color: "#0EA5E9", rotate: "-35deg", width: 8, height: 8 },
  { top: 38, left: 52, color: "#0EA5E9", rotate: "45deg", width: 8, height: 8 },
  { top: 58, left: 24, color: "#10B981", rotate: "12deg", width: 7, height: 9 },
  { top: 46, right: 40, color: "#06B6D4", rotate: "-20deg", width: 6, height: 10 },
  { bottom: 6, left: 74, color: "#10B981", rotate: "30deg", width: 6, height: 9 },
  { bottom: 4, right: 48, color: "#F59E0B", rotate: "-25deg", width: 7, height: 9 },
  { top: 5, left: 72, color: "#10B981", rotate: "20deg", width: 6, height: 9 },
  { top: 6, right: 104, color: "#F59E0B", rotate: "-10deg", width: 5, height: 8 },
];

export default function TestSubmittedView({
  rows,
  onGoToDashboard,
  title = "Test Submitted Successfully",
  thankYouText = "Your Test has been submitted successfully.\nYou will be notified once the results are available.",
}: Props) {
  return (
    <SafeAreaView style={styles.screenContainer} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainCard}>
          <View style={styles.heroWrap}>
            {CONFETTI_ITEMS.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.confettiPiece,
                  {
                    top: item.top,
                    bottom: item.bottom,
                    left: item.left,
                    right: item.right,
                    backgroundColor: item.color,
                    width: item.width,
                    height: item.height,
                    transform: [{ rotate: item.rotate }],
                  },
                ]}
              />
            ))}

            {/* Glowing Mint Halo Ring */}
            <View style={styles.haloRing}>
              {/* Solid Green Check Circle */}
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={38} color={Colors.white} />
              </View>
            </View>
          </View>

          {/* Heading and Subtitle */}
          <AppText
            variant="h2"
            weight={FontWeight.medium}
            align="center"
            style={styles.title}
          >
            {title}
          </AppText>
          <AppText
            variant="caption"
            color="#6B7280"
            align="center"
            style={styles.subtitle}
          >
            {"Your assessment has been submitted\nand recorded successfully."}
          </AppText>

          {/* Submission Summary Details Card */}
          <View style={styles.summaryCard}>
            <AppText
              variant="label"
              weight={FontWeight.medium}
              color="#111827"
              style={styles.summaryCardTitle}
            >
              Submission Summary
            </AppText>

            <View style={styles.summaryList}>
              {rows.map((row, index) => (
                <SummaryRow
                  key={row.label}
                  {...row}
                  isLast={index === rows.length - 1}
                />
              ))}
            </View>
          </View>

          {/* Thank You Banner Box */}
          <View style={styles.thankYouBox}>
            <View style={styles.thankYouIcon}>
              <SmileIcon width={20} height={20} />
            </View>
            <View style={styles.thankYouTextWrap}>
              <AppText
                variant="label"
                style={styles.thankYouText}
              >
                Thank you!
              </AppText>
              <AppText
                variant="tiny"
                color="#374151"
                style={styles.thankYouSubtext}
              >
                {thankYouText}
              </AppText>
            </View>
          </View>

          {/* Primary Action Button */}
          <Pressable
            style={styles.dashboardButton}
            onPress={onGoToDashboard}
            accessibilityRole="button"
            accessibilityLabel="Go To Dashboard"
          >
            <Ionicons name="home-outline" size={20} color={Colors.white} />
            <AppText
              variant="label"
              color={Colors.white}
              weight={FontWeight.bold}
            >
              Go To Dashboard
            </AppText>
          </Pressable>

          {/* Bottom Security Notice */}
          <View style={styles.secureNotice}>
            <View style={styles.secureBadge}>
              <Ionicons name="lock-closed" size={12} color="#10B981" />
            </View>
            <AppText style = {styles.secureBadgeText} variant="caption" color="#6B7280" weight={FontWeight.medium}>
              Your data is secure and encrypted
            </AppText>
          </View>
        </View>
      </ScrollView>
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
      <AppText variant="caption" color="#4B5563" style={styles.summaryLabel}>
        {label}
      </AppText>
      <AppText
        variant="caption"
        color="#111827"
        style={styles.summaryValue}
      >
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F0F6FE",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  mainCard: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: "center",
    ...createShadow({ x: 0, y: 8, blur: 24, opacity: 0.08, elevation: 4 }),
  },

  // Hero Section
  heroWrap: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  confettiPiece: {
    position: "absolute",
    borderRadius: 2,
  },
  haloRing: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "#D1FADF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#00A86B",
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 4, blur: 10, opacity: 0.16, elevation: 3 }),
  },

  title: {
    fontSize: 18,
    marginTop: 14,
    color: "#111827",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 18,
  },

  // Summary Card
  summaryCard: {
    width: "100%",
    marginTop: 20,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...createShadow({ x: 0, y: 2, blur: 8, opacity: 0.04, elevation: 1 }),
  },
  summaryCardTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  summaryList: {
    gap: 0,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    gap: 10,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  summaryIcon: {
    width: 21,
    height: 21,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabel: {
    fontSize: 10.5,
    flex: 1,
  },
  summaryValue: {
    fontSize: 10.5,
    textAlign: "right",
  },

  // Thank You Banner Box
  thankYouBox: {
    width: "100%",
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EBFBF3",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D1FADF",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  thankYouIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1CB07D",
  },
  thankYouTextWrap: {
    flex: 1,
    gap: 2,
  },
  thankYouText: {
    fontSize: 12,
    color: "#1CB07D",
  },
  thankYouSubtext: {
    fontSize: 9,
    lineHeight: 15,
  },

  // Primary Action Button
  dashboardButton: {
    width: "100%",
    height: 46,
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: "#1CB07D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...createShadow({ x: 0, y: 4, blur: 12, opacity: 0.12, elevation: 3 }),
  },

  // Bottom Security Notice
  secureNotice: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  secureBadge : {
    alignItems : "center",
    justifyContent : "center",
  },
  secureBadgeText : {
    fontSize: 11,
  }
});
