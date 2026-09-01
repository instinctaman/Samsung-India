import { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useCameraPermissions, type BarcodeScanningResult } from "expo-camera";

import { parseJoinCode } from "./parseJoinCode";

/**
 * Backs the in-app QR scanner (`app/scan.tsx`). Reads a session QR with
 * expo-camera, pulls the conference code out of it, and hands off to the
 * join screen - the same place a `samsungindia://join/<code>` deep link
 * lands, so from there the flow (preview -> login/register -> session) is
 * unchanged.
 */
export function useQrScanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  const handleScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (handled.current) return;
      const code = parseJoinCode(result.data);
      if (!code) {
        setError("That doesn't look like a session QR code.");
        return;
      }
      handled.current = true;
      router.replace({ pathname: "/join/[code]", params: { code } });
    },
    [router],
  );

  return {
    granted: permission?.granted ?? false,
    canAskAgain: permission?.canAskAgain ?? true,
    requestPermission,
    error,
    handleScanned,
    onClose: () => router.back(),
  };
}
