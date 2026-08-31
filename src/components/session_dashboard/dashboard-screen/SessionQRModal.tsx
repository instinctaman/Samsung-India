import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

type SessionQRModalProps = {
  visible: boolean;
  onClose: () => void;
  conferenceUid: string;
};

// Deep link the OS routes to this app (see `scheme` in app.json). Scanning
// it with a phone camera / Google Lens opens the app straight on the join
// screen; the same string works as a tappable link shared over chat.
const joinLink = (code: string) => `samsungindia://join/${code}`;

export default function SessionQRModal({ visible, onClose, conferenceUid }: SessionQRModalProps) {
  const [copied, setCopied] = useState(false);
  const link = joinLink(conferenceUid);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppModal visible={visible} onClose={onClose} position="center" closeOnOverlayPress>
      <View style={styles.content}>
        <AppText style={styles.title} weight={FontWeight.bold}>
          Session QR Code
        </AppText>
        <AppText style={styles.subtitle}>
          Trainees scan this to join {conferenceUid}
        </AppText>

        <View style={styles.qrBox}>
          <QRCode value={link} size={190} />
        </View>

        <Pressable style={styles.copyBtn} onPress={handleCopy} hitSlop={6}>
          <Ionicons
            name={copied ? "checkmark" : "copy-outline"}
            size={14}
            color={Colors.mainColour1}
          />
          <AppText style={styles.copyText} weight={FontWeight.medium}>
            {copied ? "Link copied" : "Copy join link"}
          </AppText>
        </Pressable>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
  },
  title: { fontSize: 16, color: "#111827", marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#6B7280", marginBottom: 16, textAlign: "center" },
  qrBox: {
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  copyBtn: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  copyText: { fontSize: 12, color: Colors.mainColour1 },
});
