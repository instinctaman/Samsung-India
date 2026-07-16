import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

export default function SecurityFooter() {
  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed-outline" size={18} color={Colors.inputColour} />
      <AppText style={styles.text}>Your information is secure</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    color: Colors.inputColour,
    fontSize: Fonts.bodySm,
    fontWeight: FontWeight.regular,
    marginLeft: 8,
  },
});
