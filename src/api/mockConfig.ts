// Single switch between the frontend-only mock backend (src/api/mockService.ts)
// and the real network API. Set EXPO_PUBLIC_USE_MOCK_DATA=false in .env to point
// the app at a real backend once one is reachable.
export const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA !== "false";
