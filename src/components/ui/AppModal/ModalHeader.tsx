import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../AppText";
import { Colors } from "@/theme/colors";

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export default function ModalHeader({
  title,
  subtitle,
  onClose,
  showCloseButton = true,
}: ModalHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText
          size={20}
          weight="600"
        >
          {title}
        </AppText>

        {subtitle && (
          <AppText
            size={12}
            style={styles.subtitle}
          >
            {subtitle}
          </AppText>
        )}
      </View>

      {showCloseButton && (
        <Pressable
          onPress={onClose}
          style={styles.closeButton}
        >
          <Ionicons
            name="close"
            size={24}
            color={Colors.inputColour}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textContainer: {
    flex: 1,
  },

  subtitle: {
    marginTop: 4,
    color: Colors.inputColour,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});