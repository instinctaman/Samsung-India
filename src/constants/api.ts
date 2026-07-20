import { Platform } from "react-native";

// Android emulator can't reach the host machine via 127.0.0.1 - it needs
// the special 10.0.2.2 alias. iOS simulator/web can use 127.0.0.1 directly.
// For a physical device, set EXPO_PUBLIC_API_URL to your machine's LAN IP,
// e.g. EXPO_PUBLIC_API_URL=http://192.168.1.23:8000
const LOCAL_HOST = Platform.select({
  android: "10.0.2.2",
  default: "127.0.0.1",
});

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${LOCAL_HOST}:8000`;
