import { Image } from "expo-image";
import { Dimensions, StyleSheet, View } from "react-native";

const SCREEN_W = Dimensions.get("window").width;

/**
 * Full-screen TOPS branding shown while the app boots (fonts / auth state
 * loading) before the role-selection screen is ready. Uses no custom fonts -
 * they may not be loaded yet - the wordmark + tagline are baked into the image.
 */
export default function BrandSplash() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo/project_logo.png")}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  logo: { width: SCREEN_W * 0.66, height: SCREEN_W * 0.66 * (872 / 1600) },
});
