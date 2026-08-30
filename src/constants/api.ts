import { Platform } from "react-native";

// In Expo, EXPO_PUBLIC_* env vars are inlined at bundle time.
// Set default host to your computer's local Wi-Fi IP so physical devices on Wi-Fi,
// emulators, and web browsers can all reach FastAPI without depending on .env reload.
const DEFAULT_HOST = "192.168.29.237";

// Only used when USE_MOCK_DATA is false (see src/config/dataSource.ts).
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${DEFAULT_HOST}:8000`;
