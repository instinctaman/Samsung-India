import { StyleSheet, View } from "react-native";
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

export default function SessionQRModal({ visible, onClose, conferenceUid }: SessionQRModalProps) {
  return (
    <AppModal visible={visible} onClose={onClose} position="center" closeOnOverlayPress>
      <View style={styles.qrModalContent}>
        <AppText style={styles.qrTitle} weight={FontWeight.bold}>
          Session QR Code
        </AppText>
        <AppText style={styles.qrSubtitle}>Scan to join conference: {conferenceUid}</AppText>
        <View style={styles.qrBox}>
          <QRCode value={`https://training.samsung.com/session/${conferenceUid}`} size={180} />
        </View>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  qrModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
  },
  qrTitle: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  qrBox: {
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
