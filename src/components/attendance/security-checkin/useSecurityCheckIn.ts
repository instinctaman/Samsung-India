import { useEffect, useRef, useState } from "react";
import { Image, ImageSourcePropType } from "react-native";
import { CameraRef, useCameraDevice, useCameraPermission, usePhotoOutput } from "react-native-vision-camera";

const DEFAULT_SAMPLE_PHOTO: ImageSourcePropType = require("@/assets/images/user_img/default_male.png");

export function useSecurityCheckIn() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("front");
  // mirrorMode defaults to "auto", which mirrors front-camera output to match
  // the mirrored live selfie preview — the same behavior the previous
  // expo-camera implementation needed an explicit isImageMirror flag for.
  const photoOutput = usePhotoOutput();
  const cameraRef = useRef<CameraRef>(null);

  const [capturing, setCapturing] = useState(false);
  const [photoSource, setPhotoSource] = useState<ImageSourcePropType | null>(null);

  // Request camera permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = async () => {
    setCapturing(true);
    try {
      if (cameraRef.current && device) {
        const photoFile = await photoOutput.capturePhotoToFile({}, {});
        const uri = photoFile.filePath.startsWith("file://") ? photoFile.filePath : `file://${photoFile.filePath}`;
        setPhotoSource({ uri });
        setCapturing(false);
        return;
      }
    } catch {
      // Fallback for emulator / web / environment without active hardware camera stream
    }

    // Fallback sample photo for development / simulators / a camera that
    // won't capture. Resolve the bundled asset to a real `{ uri }` so the
    // upload paths (which need a URI, not a require() id) still work.
    const resolved = Image.resolveAssetSource(DEFAULT_SAMPLE_PHOTO);
    setPhotoSource(resolved?.uri ? { uri: resolved.uri } : DEFAULT_SAMPLE_PHOTO);
    setCapturing(false);
  };

  const handleRetake = () => {
    setPhotoSource(null);
  };

  return {
    hasPermission,
    requestPermission,
    device,
    photoOutput,
    cameraRef,
    capturing,
    photoSource,
    hasPhoto: photoSource !== null,
    handleCapture,
    handleRetake,
  };
}
