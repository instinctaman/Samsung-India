import { Pressable, StyleSheet, View } from "react-native";

import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";

type ConfirmModalProps = {
  visible: boolean;
  message: string;
  title?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  visible,
  message,
  title,
  cancelText = "No",
  confirmText = "Yes",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <AppModal visible={visible} onClose={onCancel} position="center" title={title}>
      <AppText style={styles.message}>{message}</AppText>
      <View style={styles.actionRow}>
        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <AppText color={Colors.gray600} weight={FontWeight.semiBold}>
            {cancelText}
          </AppText>
        </Pressable>
        <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
          <AppText color={Colors.white} weight={FontWeight.semiBold}>
            {confirmText}
          </AppText>
        </Pressable>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: "center",
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.gray100,
  },
  confirmButton: {
    backgroundColor: Colors.mainColour1,
  },
});
