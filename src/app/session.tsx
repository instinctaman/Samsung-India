import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CheckCircle from "@/assets/images/svg/check_circle.svg";

import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import SecurityFooter from "@/components/common/SecurityFooter";
import { Colors } from "@/theme/colors";

const details = [
  ["SUPERVISOR", "AKASH ROY"],
  ["DESIGNATION", "COORDINATOR"],
  ["DISTRICT", "SOUTH"],
  ["COMPANY ID", "N/A"],
];

export default function SessionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Image
          source={require("@/assets/images/Icons/face_icon.png")}
          style={styles.avatar}
        />
        <AppText style={styles.name} color={Colors.white} weight="500">
          Anshu Pandey
        </AppText>
        <AppText style={styles.phone} color={Colors.white}>9987898789</AppText>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.details}>
            {details.map(([label, value]) => (
              <View key={label} style={styles.detail}>
                <AppText style={styles.label}>{label}</AppText>
                <AppText style={styles.value} weight="700">{value}</AppText>
              </View>
            ))}
          </View>

          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={14} color="#3D3D3D" />
            <AppText style={styles.noticeText}>
              You are registered but not assigned to this session
            </AppText>
          </View>

          <AppButton
            title="Join Session"
            onPress={() => {}}
            leftIcon={<CheckCircle width={21} height={21} />}
            buttonStyle={styles.joinButton}
          />

          <Pressable onPress={() => router.back()} hitSlop={8}>
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
    height: "40%",
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    paddingTop: "25%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  avatar: { width: 92, height: 92, borderRadius: 46, marginBottom: 12 },
  name: { fontSize: 20, lineHeight: 25 },
  phone: {
    fontSize: 11,
    lineHeight: 17,
    backgroundColor: "rgba(255,255,255,0.20)",
    paddingHorizontal: 5,
    borderRadius: 2,
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
    marginTop: -39,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  details: { flexDirection: "row", flexWrap: "wrap", rowGap: 20 },
  detail: { width: "50%" },
  label: { fontSize: 10, color: "#505050", marginBottom: 6 },
  value: { fontSize: 13, color: "#303030" },
  notice: { flexDirection: "row", alignItems: "center", marginTop: 26, marginBottom: 13 },
  noticeText: { flex: 1, fontSize: 10, color: "#3D3D3D", marginLeft: 4 },
  joinButton: { height: 40, borderRadius: 8 },
  logout: { marginTop: 14, textAlign: "center", textDecorationLine: "underline", fontSize: 10, color: "#4D4D4D" },
  footer: { marginTop: 36 },
});
