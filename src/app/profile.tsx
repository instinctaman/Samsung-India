import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ApiError, uploadTraineePhoto } from "@/api/auth";
import { setSessionFlowState } from "@/api/session";
import Calendar from "@/assets/images/svg/calender2.svg";
import EditProfileSheet from "@/components/common/EditProfileSheet";
import TraineeBottomNavigation from "@/components/session/TraineeBottomNavigation";
import AppText from "@/components/ui/AppText";
import { STATES } from "@/data/states";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { createShadow } from "@/theme/shadows";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const DEFAULT_AVATAR: ImageSourcePropType = require("@/assets/images/user_img/default_male.png");

function locationLabel(state: string | null, district: string | null) {
  const stateEntry = STATES.find((item) => item.value === state);
  const districtEntry = stateEntry?.cities.find(
    (city) => city.value === district,
  );
  const parts = [districtEntry?.label, stateEntry?.label].filter(Boolean);
  return parts.length ? parts.join(", ") : "--";
}

type DetailItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
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
      Alert.alert(
        "Permission needed",
        "Allow photo library access to set a profile picture.",
      );
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
      Alert.alert(
        "Image too large",
        "Please choose an image smaller than 5MB.",
      );
      return;
    }
    if (!token) return;

    setUploading(true);
    try {
      const extension = asset.uri.split(".").pop()?.toLowerCase() || "jpg";
      const type =
        asset.mimeType ??
        (extension === "png"
          ? "image/png"
          : extension === "webp"
            ? "image/webp"
            : "image/jpeg");
      const updated = await uploadTraineePhoto(token, {
        uri: asset.uri,
        name: `profile.${extension}`,
        type,
      });
      setSession({
        access_token: token,
        token_type: "bearer",
        trainee: updated,
      });
    } catch (err) {
      Alert.alert(
        "Upload failed",
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
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
        params: {
          flow: "ATTENDANCE_RECORDED",
          attendance: "completed",
        },
      });
    } else if (tab === "rank") {
      router.replace({
        pathname: "/session_detail",
        params: { tab: "rank" },
      });
    }
  };

  // Personal Details Rows with robust backend property fallback bindings
  const personalDetails: DetailItem[] = [
    {
      icon: "call",
      label: "Mobile",
      value: trainee?.phone ? String(trainee.phone) : "8750574444",
    },
    {
      icon: "mail",
      label: "Email",
      value: trainee?.email || "anandkumar@quess.com",
    },
    {
      icon: "briefcase",
      label: "Designation",
      value: trainee?.designation || "SEC",
    },
    {
      icon: "card",
      label: "Employee ID",
      value: trainee?.employee_id || "SOUTH1234",
    },
    {
      icon: "location",
      label: "Work Zone",
      value:
        trainee?.workZone ||
        (trainee?.state
          ? locationLabel(trainee.state, trainee.district)
          : "SOUTH"),
    },
  ];

  // Organization Details Rows with backend property fallback bindings
  const organizationDetails: DetailItem[] = [
    {
      icon: "person",
      label: "Reporting Manager",
      value: trainee?.supervisorName || "ANAND ROY",
    },
    {
      icon: "call",
      label: "Department Support",
      value: trainee?.departmentSupport || "8569741259",
    },
    {
      icon: "business",
      label: "Department",
      value: trainee?.department || "SALES HEAD",
    },
  ];

  const sessionPillLabel =
    trainee?.sessionCode ||
    (trainee?.state
      ? locationLabel(trainee.state, trainee.district)
      : "SOUTH 12234");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="light" animated />

      {/* Royal Blue Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          {/* Avatar with Online Green Dot */}
          <View style={styles.profileMetaRow}>
            <Pressable
              style={styles.avatarWrap}
              onPress={handlePickPhoto}
              disabled={uploading}
              accessibilityRole="button"
              accessibilityLabel="Change profile picture"
            >
              <Image
                source={
                  trainee?.profilePhoto
                    ? { uri: trainee.profilePhoto }
                    : DEFAULT_AVATAR
                }
                style={styles.avatar}
              />
              <View style={styles.onlineDot} />
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color={Colors.white} />
                </View>
              )}
            </Pressable>

            {/* Name & Role */}
            <View style={styles.userTextColumn}>
              <AppText
                style={styles.userName}
                color={Colors.white}
                weight={FontWeight.bold}
              >
                {trainee?.name || "Tushar Prajapati"}
              </AppText>
              <AppText style={styles.userRole} color={Colors.white}>
                {trainee?.designation || "SEC"}
              </AppText>
            </View>
          </View>

          {/* White Logout Power Button */}
          <Pressable
            style={styles.powerButton}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Logout"
          >
            <Ionicons name="power" size={24} color="#0066FF" />
          </Pressable>
        </View>

        {/* Session Code / Location Pill Tag */}
        <View style={styles.sessionPill}>
          <Calendar width={13} height={13} color="#0066FF" />
          <AppText
            style={styles.sessionPillText}
            color="#0066FF"
            weight={FontWeight.bold}
          >
            {sessionPillLabel}
          </AppText>
        </View>
      </View>

      {/* Main Content Cards */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTag}>
              <AppText style={styles.cardTagText} weight={FontWeight.bold}>
                PERSONAL DETAILS
              </AppText>
            </View>
            <Pressable
              style={styles.editButton}
              onPress={() => setEditVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit personal details"
            >
              <Ionicons name="pencil-sharp" size={11} color="#6B7280" />
              <AppText
                style={styles.editButtonText}
                weight={FontWeight.semiBold}
              >
                EDIT
              </AppText>
            </Pressable>
          </View>

          {personalDetails.map((item, index) => (
            <React.Fragment key={item.label}>
              <View style={styles.detailRow}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon} size={20} color="#0066FF" />
                </View>
                <View style={styles.detailTextColumn}>
                  <AppText style={styles.detailLabel}>{item.label}</AppText>
                  <AppText style={styles.detailValue} weight={FontWeight.bold}>
                    {item.value}
                  </AppText>
                </View>
              </View>
              {index < personalDetails.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Organization Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTag}>
              <AppText style={styles.cardTagText} weight={FontWeight.bold}>
                ORGANIZATION DETAILS
              </AppText>
            </View>
            <Pressable
              style={styles.editButton}
              onPress={() => setEditVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit organization details"
            >
              <Ionicons name="pencil-sharp" size={11} color="#6B7280" />
              <AppText
                style={styles.editButtonText}
                weight={FontWeight.semiBold}
              >
                EDIT
              </AppText>
            </Pressable>
          </View>

          {organizationDetails.map((item, index) => (
            <React.Fragment key={item.label}>
              <View style={styles.detailRow}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon} size={20} color="#0066FF" />
                </View>
                <View style={styles.detailTextColumn}>
                  <AppText style={styles.detailLabel}>{item.label}</AppText>
                  <AppText style={styles.detailValue} weight={FontWeight.bold}>
                    {item.value}
                  </AppText>
                </View>
              </View>
              {index < organizationDetails.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Security & Verification Notice */}
        <View style={styles.securityBanner}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#0066FF" />
          <View style={styles.securityTextColumn}>
            <AppText style={styles.securityTitle} weight={FontWeight.bold}>
              Secure & Verified
            </AppText>
            <AppText style={styles.securitySubtitle}>
              Your profile information is verified and secure.
            </AppText>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Bottom Sheet */}
      <EditProfileSheet
        visible={editVisible}
        onClose={() => setEditVisible(false)}
      />

      {/* Unified Trainee Bottom Navigation */}
      <TraineeBottomNavigation
        activeTab="profile"
        onSelectTab={handleTabSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FC",
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0066FF",
  },

  // Header
  header: {
    backgroundColor: "#0066FF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DCEBFE",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#0066FF",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  userTextColumn: {
    gap: 2,
  },
  userName: {
    fontSize: 18,
    letterSpacing: 0.2,
  },
  userRole: {
    fontSize: 13,
    opacity: 0.95,
  },
  powerButton: {
    width: 41,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 2, blur: 6, opacity: 0.08, elevation: 2 }),
  },
  sessionPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  sessionPillText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },

  // Main Scrollable Area
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    ...createShadow({ x: 0, y: 4, blur: 14, opacity: 0.06, elevation: 3 }),
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTag: {
    backgroundColor: "#E0EFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardTagText: {
    fontSize: 10.5,
    color: "#0066FF",
    letterSpacing: 0.3,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.white,
  },
  editButtonText: {
    fontSize: 10,
    color: "#6B7280",
    letterSpacing: 0.2,
  },

  // Detail Row
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#E0EFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  detailTextColumn: {
    flex: 1,
    gap: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    letterSpacing: 0.1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  // Security Banner
  securityBanner: {
    backgroundColor: "#DCEBFE",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 2,
  },
  securityTextColumn: {
    flex: 1,
    gap: 1,
  },
  securityTitle: {
    fontSize: 12,
    color: "#1E293B",
  },
  securitySubtitle: {
    fontSize: 10.5,
    color: "#64748B",
  },
});
