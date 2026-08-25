import { StyleSheet, View } from "react-native";

import WinImage from "@/assets/images/svg/win.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

type TrophyHeroProps = {
  screenWidth: number;
};

export default function TrophyHero({ screenWidth }: TrophyHeroProps) {
  return (
    <View style={styles.trophyWrapper}>
      <View style={styles.trophyBanner}>
        <WinImage width={screenWidth} height={133} />
      </View>
      <AppText style={styles.resultsTitle} weight={FontWeight.bold}>
        Results
      </AppText>
      <AppText style={styles.resultsSubtitle}>Great attempt! Keep going and improve your score.</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  trophyWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  trophyBanner: {
    width: "100%",
    height: 133,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -16,
  },
  resultsTitle: {
    fontSize: 26,
    color: "#111827",
    marginTop: 6,
  },
  resultsSubtitle: {
    fontSize: 12.5,
    color: Colors.gray600,
    textAlign: "center",
    marginTop: 3,
  },
});
