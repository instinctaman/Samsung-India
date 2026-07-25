import { Ionicons } from "@expo/vector-icons";

import AppFooter from "@/components/ui/AppFooter";
import { Colors } from "@/theme/colors";

type TrainerFooterProps = {
  onOpenMenu: () => void;
  onOpenQuickActions: () => void;
  onOpenAccount: () => void;
};

export default function TrainerFooter({ onOpenMenu, onOpenQuickActions, onOpenAccount }: TrainerFooterProps) {
  return (
    <AppFooter
      items={[
        {
          key: "menu",
          label: "Menu",
          icon: ({ size, color }) => <Ionicons name="menu-outline" size={size} color={color} />,
          onPress: onOpenMenu,
        },
        {
          key: "quick-actions",
          center: true,
          icon: ({ size }) => <Ionicons name="apps" size={size} color={Colors.white} />,
          onPress: onOpenQuickActions,
        },
        {
          key: "account",
          label: "Account",
          icon: ({ size, color }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
          onPress: onOpenAccount,
        },
      ]}
    />
  );
}
