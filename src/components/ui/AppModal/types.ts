import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export type ModalPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center";

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;

  children: ReactNode;

  title?: string;

  subtitle?: string;

  showCloseButton?: boolean;

  position?: ModalPosition;

  overlayOpacity?: number;

  animationDuration?: number;

  closeOnOverlayPress?: boolean;

  containerStyle?: StyleProp<ViewStyle>;

  contentStyle?: StyleProp<ViewStyle>;
}
