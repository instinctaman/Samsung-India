import { CameraView } from "expo-camera";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { useQrScanner } from "./useQrScanner";

export default function QrScannerView() {
  const { granted, canAskAgain, requestPermission, error, handleScanned, onClose } = useQrScanner();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {granted && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleScanned}
        />
      )}

      <SafeAreaView style={styles.overlay}>
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10} accessibilityLabel="Close scanner">
          <Ionicons name="close" size={26} color={Colors.white} />
        </Pressable>

        {granted ? (
          <View style={styles.center}>
            <View style={styles.frame} />
            <AppText style={styles.hint}>Point at the session QR code</AppText>
            {error ? <AppText style={styles.error}>{error}</AppText> : null}
          </View>
        ) : (
          <View style={styles.center}>
            <Ionicons name="camera-outline" size={56} color={Colors.white} />
            <AppText style={styles.hint}>
              {canAskAgain
                ? "Camera access is needed to scan the session QR."
                : "Enable camera access for this app in Settings, then try again."}
            </AppText>
            {canAskAgain && (
              <AppButton title="Enable Camera" onPress={requestPermission} buttonStyle={styles.permBtn} />
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  overlay: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  closeBtn: { position: "absolute", top: 12, left: 12, padding: 8 },
  center: { alignItems: "center", gap: 16 },
  frame: {
    width: 220,
    height: 220,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  hint: { color: Colors.white, textAlign: "center", fontSize: 13 },
  error: { color: "#FCA5A5", textAlign: "center", fontSize: 12 },
  permBtn: { paddingHorizontal: 20 },
});
