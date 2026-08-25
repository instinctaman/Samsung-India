import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { ApiError, uploadTraineePhoto } from "@/api/auth";
import { setSessionFlowState } from "@/api/session";
import { useAuth } from "@/hooks/useAuth";
import { DetailItem, MAX_PHOTO_BYTES, locationLabel } from "./constants";

export function useProfile() {
  const router = useRouter();
  const { trainee, token, logout, setSession } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo library access to set a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
      Alert.alert("Image too large", "Please choose an image smaller than 5MB.");
      return;
    }
    if (!token) return;

    setUploading(true);
    try {
      const extension = asset.uri.split(".").pop()?.toLowerCase() || "jpg";
      const type =
        asset.mimeType ??
        (extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg");
      const updated = await uploadTraineePhoto(token, {
        uri: asset.uri,
        name: `profile.${extension}`,
        type,
      });
      setSession({ access_token: token, token_type: "bearer", trainee: updated });
    } catch (err) {
      Alert.alert(
        "Upload failed",
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleTabSelect = (tab: "rank" | "home" | "profile") => {
    if (tab === "home") {
      setSessionFlowState("ATTENDANCE_RECORDED");
      router.replace({
        pathname: "/session_detail",
        params: { flow: "ATTENDANCE_RECORDED", attendance: "completed" },
      });
    } else if (tab === "rank") {
      router.replace({ pathname: "/session_detail", params: { tab: "rank" } });
    }
  };

  // Personal Details Rows with robust backend property fallback bindings
  const personalDetails: DetailItem[] = [
    { icon: "call", label: "Mobile", value: trainee?.phone ? String(trainee.phone) : "8750574444" },
    { icon: "mail", label: "Email", value: trainee?.email || "anandkumar@quess.com" },
    { icon: "briefcase", label: "Designation", value: trainee?.designation || "SEC" },
    { icon: "card", label: "Employee ID", value: trainee?.employee_id || "SOUTH1234" },
    {
      icon: "location",
      label: "Work Zone",
      value: trainee?.workZone || (trainee?.state ? locationLabel(trainee.state, trainee.district) : "SOUTH"),
    },
  ];

  // Organization Details Rows with backend property fallback bindings
  const organizationDetails: DetailItem[] = [
    { icon: "person", label: "Reporting Manager", value: trainee?.supervisorName || "ANAND ROY" },
    { icon: "call", label: "Department Support", value: trainee?.departmentSupport || "8569741259" },
    { icon: "business", label: "Department", value: trainee?.department || "SALES HEAD" },
  ];

  const sessionPillLabel =
    trainee?.sessionCode || (trainee?.state ? locationLabel(trainee.state, trainee.district) : "SOUTH 12234");

  return {
    trainee,
    uploading,
    editVisible,
    setEditVisible,
    handleLogout,
    handlePickPhoto,
    handleTabSelect,
    personalDetails,
    organizationDetails,
    sessionPillLabel,
  };
}
