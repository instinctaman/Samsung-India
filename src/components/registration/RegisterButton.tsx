import React from "react";
import AppButton from "@/components/ui/AppButton";
import { Fonts } from "@/theme/fonts";
import { Ionicons } from "@expo/vector-icons";

interface RegisterButtonProps {
  loading?: boolean;
  onPress: () => void;
}

export default function RegisterButton({
  loading = false,
  onPress,
}: RegisterButtonProps) {
  return (
    <AppButton
      title={loading ? "Registering..." : "Complete Registration"}
      onPress={onPress}
      loading={loading}
      textStyle={{
        fontSize: Fonts.lg,
      }}
      rightIcon={
        <Ionicons
          name="arrow-forward"
          size={20}
          color="#fff"
        />
      }
    />
  );
}