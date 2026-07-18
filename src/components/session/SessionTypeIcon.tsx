import React, { ComponentType } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SvgProps } from "react-native-svg";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

type Props = {
  icon: keyof typeof Ionicons.glyphMap | ComponentType<SvgProps>;
  color?: string;
  backgroundColor?: string;
};

export default function SessionTypeIcon({
  icon,
  color = Colors.mainColour1,
  backgroundColor,
}: Props) {
  const bg =
    backgroundColor ??
    (color === Colors.success ? "#E8F8EF" : "#EAF2FF");

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {typeof icon === "string" ? (
        <Ionicons
          name={icon}
          size={Fonts.smallIcon}
          color={color}
        />
      ) : (
        (() => {
          const SvgIcon = icon;
          return (
            <SvgIcon
              width={Fonts.smallIcon}
              height={Fonts.smallIcon}
              color={color}
            />
          );
        })()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:3,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});