import React from "react";
import { StyleSheet, View } from "react-native";

import Loading from "@/assets/images/svg/loading.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

type WaitingCardProps = {
  title?: string;
  subtitle?: string;
};

export default function WaitingCard({
  title = "Please Wait",
  subtitle = "Trainer will unlock soon...",
}: WaitingCardProps) {
  return (
    <View style={styles.container}>
      <Loading width={17} height={17} />

      <View>
        <AppText
          style={styles.title}
          color={Colors.primary}
          weight={FontWeight.medium}
        >
          {title}
        </AppText>

        <AppText
          style={styles.subtitle}
          color={Colors.primary}
        >
          {subtitle}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#DDEEFF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 7,
  },

  title: {
    fontSize: Fonts.caption,
  },

  subtitle: {
    fontSize: Fonts.overline,
  },
});