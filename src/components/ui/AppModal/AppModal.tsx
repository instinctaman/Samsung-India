import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";

import ModalHeader from "./ModalHeader";
import { styles } from "./styles";
import { AppModalProps } from "./types";

const { width, height } = Dimensions.get("window");

const alignStyleForPosition = {
  bottom: "alignBottom",
  top: "alignTop",
  left: "alignLeft",
  right: "alignRight",
  center: "alignCenter",
} as const;

export default function AppModal({
  visible,
  onClose,
  children,
  title,
  subtitle,
  showCloseButton,
  position = "center",
  overlayOpacity = 0.4,
  animationDuration = 300,
  closeOnOverlayPress = true,
  containerStyle,
  contentStyle,
}: AppModalProps) {
  const [isMounted, setIsMounted] = useState(visible);

  const translate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const getInitialValue = () => {
    switch (position) {
      case "bottom":
        return height;

      case "top":
        return -height;

      case "left":
        return -width;

      case "right":
        return width;

      default:
        return 0;
    }
  };

  useEffect(() => {
    if (visible) {
      setIsMounted(true);

      translate.setValue(getInitialValue());
      opacity.setValue(0);
      scale.setValue(0.9);

      const useNativeDriver = Platform.OS !== "web";

      Animated.parallel([
        Animated.timing(translate, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver,
        }),

        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver,
        }),
      ]).start();
    } else if (isMounted) {
      const useNativeDriver = Platform.OS !== "web";

      Animated.parallel([
        Animated.timing(translate, {
          toValue: getInitialValue(),
          duration: animationDuration,
          useNativeDriver,
        }),

        Animated.timing(opacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver,
        }),

        Animated.timing(scale, {
          toValue: 0.9,
          duration: animationDuration,
          useNativeDriver,
        }),
      ]).start(() => {
        setIsMounted(false);
      });
    }
  }, [visible]);

  if (!isMounted) return null;

  const transform = [];

  if (position === "left" || position === "right") {
    transform.push({
      translateX: translate,
    });
  }

  if (position === "top" || position === "bottom") {
    transform.push({
      translateY: translate,
    });
  }

  if (position === "center") {
    transform.push({
      scale,
    });
  }

  return (
    <Modal transparent visible={isMounted} onRequestClose={onClose}>
      <View style={[styles.container, containerStyle]}>
        <Pressable
          style={[
            styles.overlay,
            {
              backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
            },
          ]}
          onPress={() => {
            if (closeOnOverlayPress) {
              onClose();
            }
          }}
        />

        <KeyboardAvoidingView
          style={[styles.keyboard, styles[alignStyleForPosition[position]]]}
          behavior="padding"
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.content,
              styles[position],
              contentStyle,
              {
                opacity,
                transform,
              },
            ]}
          >
            {title && (
              <ModalHeader
                title={title}
                subtitle={subtitle}
                onClose={onClose}
                showCloseButton={showCloseButton}
              />
            )}
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
