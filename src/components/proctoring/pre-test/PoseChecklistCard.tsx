import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
import { ERROR_ANIMATION, POSE_ROWS, SUCCESS_ANIMATION } from "./constants";

export default function PoseChecklistCard() {
  return (
    <View style={styles.card}>
      {POSE_ROWS.map((row) => (
        <View key={row.key} style={styles.poseRow}>
          <View style={styles.poseAnimation}>
            <LottieView source={row.ok ? SUCCESS_ANIMATION : ERROR_ANIMATION} autoPlay loop style={styles.lottie} />
          </View>
          <Ionicons name={row.icon} size={16} color={row.ok ? Colors.success : Colors.danger} />
          <AppText style={styles.poseLabel}>{row.label}</AppText>
          <Ionicons name={row.ok ? "checkmark" : "close"} size={16} color={row.ok ? Colors.success : Colors.danger} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: 14,
    gap: 10,
  },
  poseRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  poseAnimation: { width: 40, height: 40 },
  lottie: { width: "100%", height: "100%" },
  poseLabel: { fontSize: Fonts.bodySm, flex: 1 },
});
