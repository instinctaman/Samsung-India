import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Radius } from "@/theme/radius";

type Props = {
  backgroundColor: string;
  children: ReactNode;
  style?: ViewStyle;
};

/** Colored, rounded-bottom header shell that also flips the status bar
 * icons to light - the mainColour1 banner on the trainer dashboard, reused
 * wherever else a screen wants that same full-bleed colored header. */
export default function ScreenBanner({ backgroundColor, children, style }: Props) {
  return (
    <>
      <StatusBar style="light" />
      <View style={[styles.banner, { backgroundColor }, style]}>{children}</View>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: Radius.xxxl,
    borderBottomRightRadius: Radius.xxxl,
  },
});
