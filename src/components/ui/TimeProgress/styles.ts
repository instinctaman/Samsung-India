import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FF8D8D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  time: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  label: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#FF5C5C",
  },
});