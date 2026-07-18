import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

type Props = {
  title?: string;
  message?: string;
};

export default function SessionNotice({
  title = "Stay Updated",
  message = "We'll notify you when the next session is ready.",
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="notifications-outline"
          size={Fonts.captionIcon}
          color={Colors.mainColour1}
        />
      </View>

      <View style={styles.content}>
        <AppText
          style={styles.title}
          weight={FontWeight.medium}
        >
          {title}
        </AppText>

        <AppText style={styles.message}>
          {message}
        </AppText>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={Colors.gray600}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DDEEFF",
    borderRadius: 5,
    padding: 9,
    gap: 8,
    marginTop: 12,
  },

  iconContainer: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#CBE5FF",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: Fonts.caption,
  },

  message: {
    marginTop: 1,
    fontSize: Fonts.overline,
    color: Colors.gray600,
  },
});
