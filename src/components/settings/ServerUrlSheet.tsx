import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { useServerUrlForm } from "@/hooks/useServerUrlForm";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

type ServerUrlSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const TEST_LABEL = {
  idle: "Test connection",
  testing: "Testing…",
  ok: "Reachable ✓",
  fail: "Can't reach ✗",
} as const;

export default function ServerUrlSheet({ visible, onClose }: ServerUrlSheetProps) {
  const { url, setUrl, test, isDefault, defaultUrl, handleTest, handleSave, handleReset } =
    useServerUrlForm(onClose);

  const testColor = test === "ok" ? "#059669" : test === "fail" ? Colors.danger : Colors.mainColour1;

  return (
    <AppModal visible={visible} onClose={onClose} position="center" title="Server URL" closeOnOverlayPress>
      <View style={styles.body}>
        <AppText style={styles.hint}>
          {"The backend address the app talks to. Change this when the PC's IP / Wi-Fi changes — no rebuild needed."}
        </AppText>

        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="http://192.168.1.10:8000"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <Pressable style={styles.testRow} onPress={handleTest} disabled={test === "testing"} hitSlop={6}>
          <Ionicons
            name={test === "ok" ? "checkmark-circle" : test === "fail" ? "close-circle" : "pulse"}
            size={15}
            color={testColor}
          />
          <AppText style={[styles.testText, { color: testColor }]}>{TEST_LABEL[test]}</AppText>
        </Pressable>

        <AppButton title="Save" onPress={handleSave} buttonStyle={styles.save} />

        {!isDefault && (
          <Pressable onPress={handleReset} hitSlop={6}>
            <AppText style={styles.reset}>Reset to default ({defaultUrl})</AppText>
          </Pressable>
        )}
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: "88%",
    alignSelf: "center",
    gap: 12,
  },
  hint: { fontSize: Fonts.bodySm, color: Colors.gray600 },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: Fonts.body,
    color: Colors.black,
  },
  testRow: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  testText: { fontSize: Fonts.bodySm, fontWeight: "600" },
  save: { width: "100%" },
  reset: { fontSize: Fonts.caption, color: Colors.gray600, textAlign: "center", marginTop: 2 },
});
