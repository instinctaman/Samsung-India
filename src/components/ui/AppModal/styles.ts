import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
  },

  keyboard: {
    flex: 1,
  },

  content: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },

  bottom: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },

  top: {
    left: 0,
    right: 0,
    top: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    maxHeight: "100%",
  },

  left: {
    top: 0,
    bottom: 0,
    left: 0,
    width: "82%",
  },

  right: {
    top: 0,
    bottom: 0,
    right: 0,
    width: "82%",
  },

  center: {
    alignSelf: "center",
    // alignSelf: "stretch",
    // marginHorizontal: 24,
    justifyContent: "center",
    borderRadius: 20,
  },
});