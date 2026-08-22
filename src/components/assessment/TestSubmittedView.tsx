import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SmileIcon from "@/assets/images/svg/smile.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { createShadow } from "@/theme/shadows";
import { FontSize, FontWeight } from "@/theme/typography";

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
  {
    top: 12,
    left: 34,
    color: "#F59E0B",
    rotate: "-15deg",
    width: 6,
    height: 10,
  },
  {
    top: 2,
    right: 65,
    color: "#10B981",
    rotate: "25deg",
    width: 6,
    height: 10,
  },
  {
    top: 22,
    right: 30,
    color: "#0EA5E9",
    rotate: "-35deg",
    width: 8,
    height: 8,
  },
  { top: 38, left: 52, color: "#0EA5E9", rotate: "45deg", width: 8, height: 8 },
  { top: 58, left: 24, color: "#10B981", rotate: "12deg", width: 7, height: 9 },
  {
    top: 46,
    right: 40,
    color: "#06B6D4",
    rotate: "-20deg",
    width: 6,
    height: 10,
  },
  {
    bottom: 6,
    left: 74,
    color: "#10B981",
    rotate: "30deg",
    width: 6,
    height: 9,
  },
  {
    bottom: 4,
    right: 48,
    color: "#F59E0B",
    rotate: "-25deg",
    width: 7,
    height: 9,
  },
  { top: 5, left: 72, color: "#10B981", rotate: "20deg", width: 6, height: 9 },
  {
    top: 6,
    right: 104,
    color: "#F59E0B",
    rotate: "-10deg",
    width: 5,
    height: 8,
  },
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainCard}>
          {/* 1. Hero Checkmark & Confetti */}
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
                <Ionicons name="checkmark" size={36} color={Colors.white} />
              </View>
            </View>
          </View>

          {/* 2. Heading and Subtitle */}
          <View style={styles.titleWrap}>
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
          </View>

          {/* 3. Submission Summary Details Card */}
          <View style={styles.summaryCard}>
            <AppText
              variant="label"
              weight={FontWeight.semiBold}
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

          {/* 4. Thank You Banner Box */}
          <View style={styles.thankYouBox}>
            <View style={styles.thankYouIcon}>
              <SmileIcon width={20} height={20} />
            </View>
            <View style={styles.thankYouTextWrap}>
              <AppText variant="label" style={styles.thankYouText}>
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

          {/* 5. Bottom Actions Section */}
          <View style={styles.bottomSection}>
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
              <AppText
                style={styles.secureBadgeText}
                variant="caption"
                color="#6B7280"
                weight={FontWeight.medium}
              >
                Your data is secure and encrypted
              </AppText>
            </View>
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
      <AppText variant="caption" color="#111827" style={styles.summaryValue}>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    justifyContent: "flex-end",
  },
  mainCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    ...createShadow({ x: 0, y: 8, blur: 24, opacity: 0.08, elevation: 4 }),
  },
  titleWrap: {
    width: "100%",
    alignItems: "center",
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
  },

  // Hero Section
  heroWrap: {
    width: "100%",
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  confettiPiece: {
    position: "absolute",
    borderRadius: 2,
  },
  haloRing: {
    width: 95,
    height: 95,
    borderRadius: "50%",
    backgroundColor: "#D1FADF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 78,
    height: 78,
    borderRadius: "50%",
    backgroundColor: "#00A86B",
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 3, blur: 8, opacity: 0.15, elevation: 3 }),
  },

  title: {
    fontSize: 21,
    marginTop: 6,
    color: "#111827",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 17,
  },

  // Summary Card
  summaryCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingHorizontal: 15,
    paddingVertical: 15,
    ...createShadow({ x: 0, y: 2, blur: 6, opacity: 0.04, elevation: 1 }),
  },
  summaryCardTitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  summaryList: {
    gap: 0,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 10,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabel: {
    fontSize: FontSize.tiny,
    flex: 1,
  },
  summaryValue: {
    fontSize: FontSize.tiny,
    textAlign: "right",
  },

  // Thank You Banner Box
  thankYouBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EBFBF3",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1FADF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  thankYouIcon: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1CB07D",
  },
  thankYouTextWrap: {
    flex: 1,
    gap: 2,
  },
  thankYouText: {
    fontSize: 13.5,
    color: "#1CB07D",
  },
  thankYouSubtext: {
    fontSize: 11,
    lineHeight: 14,
  },

  // Primary Action Button
  dashboardButton: {
    width: "100%",
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: "#1CB07D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...createShadow({ x: 0, y: 3, blur: 10, opacity: 0.12, elevation: 3 }),
  },

  // Bottom Security Notice
  secureNotice: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secureBadge: {
    alignItems: "center",
    justifyContent: "center",
  },
  secureBadgeText: {
    fontSize: FontSize.caption,
  },
});
