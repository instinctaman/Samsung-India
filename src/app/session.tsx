import CheckCircle from "@/assets/images/svg/check_circle.svg";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  CurrentSession,
  getCurrentSession,
  isAttendanceRecorded,
  setSessionFlowState,
} from "@/api/session";
import SecurityFooter from "@/components/common/SecurityFooter";
import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { createShadow } from "@/theme/shadows";
import { FontWeight } from "@/theme/typography";

const AVATAR_BY_GENDER: Record<string, ImageSourcePropType> = {
  male: require("@/assets/images/user_img/default_male.png"),
  female: require("@/assets/images/user_img/default_female.png"),
};
const DEFAULT_AVATAR: ImageSourcePropType = require("@/assets/images/user_img/default.png");

export default function SessionScreen() {
  const router = useRouter();
  const { trainee, token, logout } = useAuth();
  const avatar =
    AVATAR_BY_GENDER[trainee?.gender?.toLowerCase() ?? ""] ?? DEFAULT_AVATAR;

  const [session, setSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState(true);

  const details = [
    ["SUPERVISOR", trainee?.supervisorName || "N/A"],
    ["DESIGNATION", trainee?.designation || "N/A"],
    ["CITY", trainee?.district || "N/A"],
    ["COMPANY ID", trainee?.employee_id || "N/A"],
  ];

  const loadSession = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getCurrentSession(token);
      setSession(data);
    } catch {
      // No trainer session assigned yet (e.g. 404) - fall back to the
      // "not assigned" notice below instead of surfacing an error.
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Re-check every time this screen regains focus so a session that just
  // got approved/started shows up without needing to log out and back in.
  useFocusEffect(
    useCallback(() => {
      loadSession();
    }, [loadSession]),
  );

  const notice = !session
    ? "You are registered but not assigned to this session"
    : !session.started
      ? `Session with ${session.trainerName || "your trainer"} starts ${session.startsAt || "soon"}`
      : `Session with ${session.trainerName || "your trainer"} is live now`;

  const handleLogout = () => {
    logout();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Image source={avatar} style={styles.avatar} />
        <AppText style={styles.name}>{trainee?.name || "Trainee"}</AppText>
        <AppText style={styles.phone}>{trainee?.phone || ""}</AppText>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.details}>
            {details.map(([label, value]) => (
              <View key={label} style={styles.detail}>
                <AppText style={styles.label}>{label}</AppText>
                <AppText style={styles.value} weight={FontWeight.bold}>
                  {value}
                </AppText>
              </View>
            ))}
          </View>

          <View style={styles.notice}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.mainColour1} />
            ) : (
              <Ionicons
                name="information-circle-outline"
                size={14}
                color="#3D3D3D"
              />
            )}
            <AppText style={styles.noticeText}>
              {loading ? "Checking for your session…" : notice}
            </AppText>
          </View>

          <AppButton
            title="Join Session"
            onPress={() => {
              if (isAttendanceRecorded()) {
                router.push({
                  pathname: "/session_detail",
                  params: {
                    flow: "ATTENDANCE_RECORDED",
                    attendance: "completed",
                  },
                });
                return;
              }
              setSessionFlowState("SECURE_CHECKIN");
              router.push({
                pathname: "/session_detail",
                params: {
                  flow: "SECURE_CHECKIN",
                },
              });
            }}
            leftIcon={<CheckCircle width={24} height={24} />}
            buttonStyle={styles.joinButton}
            textStyle={styles.joinButtonText}
          />

          <Pressable onPress={handleLogout} hitSlop={8}>
            <AppText style={styles.logout}>Not you ? Logout</AppText>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <SecurityFooter />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: {
    height: "45%",
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    paddingTop: "20%",
    borderTopLeftRadius: Fonts.br,
    borderTopRightRadius: Fonts.br,
  },
  avatar: {
    width: 176,
    height: 131,
    marginBottom: 2,
  },
  name: { fontSize: 26, color: "white", marginBottom: 4 },
  phone: {
    fontSize: 15,
    color: Colors.white,
    backgroundColor: "#398CFF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 3,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: Colors.white,
    borderRadius: 27,
    padding: 24,
    marginTop: "-10%",
    ...createShadow({ x: 0, y: 3, blur: 8, opacity: 0.08, elevation: 5 }),
  },

  details: { flexDirection: "row", flexWrap: "wrap", rowGap: 20 },
  detail: { width: "50%" },
  label: { fontSize: 13, color: "#505050", marginBottom: 6 },
  value: { fontSize: 15, color: "#303030", fontWeight: "bold" },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 13,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: "#3D3D3D",
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: "#006AFF",
    height: 48,
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 20,
  },
  logout: {
    marginTop: 14,
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 13,
    color: "#4D4D4D",
  },
  footer: { marginTop: 36 },
});
