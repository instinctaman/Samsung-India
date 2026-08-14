import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import AccountCircle from "@/assets/images/svg/account_circle.svg";
import Calendar from "@/assets/images/svg/calender.svg";
import Calendar1 from "@/assets/images/svg/calender2.svg";
import AppText from "@/components/ui/AppText";
import AppFooter from "@/components/ui/AppFooter";
import EditProfileSheet from "@/components/common/EditProfileSheet";
import { STATES } from "@/data/states";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, uploadTraineePhoto } from "@/api/auth";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function locationLabel(state: string | null, district: string | null) {
    const stateEntry = STATES.find((item) => item.value === state);
    const districtEntry = stateEntry?.cities.find((city) => city.value === district);
    const parts = [districtEntry?.label, stateEntry?.label].filter(Boolean);
    return parts.length ? parts.join(", ") : "--";
}

export default function ProfileScreen() {
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
                asset.mimeType ?? (extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg");
            const updated = await uploadTraineePhoto(token, {
                uri: asset.uri,
                name: `profile.${extension}`,
                type,
            });
            setSession({ access_token: token, token_type: "bearer", trainee: updated });
        } catch (err) {
            Alert.alert("Upload failed", err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const personalDetails = [
        ["call-outline", "Mobile", trainee ? String(trainee.phone) : "--"],
        ["mail-outline", "Email", trainee?.email ?? "--"],
        ["briefcase-outline", "Designation", trainee?.designation ?? "--"],
        ["card-outline", "Employee ID", trainee?.employee_id ?? "--"],
        ["location-outline", "Work Zone", trainee ? locationLabel(trainee.state, trainee.district) : "--"],
    ] as const;

    const organizationDetails = [
        ["person-outline", "Reporting Manager", trainee?.supervisorName ?? "--"],
        ["male-female-outline", "Gender", trainee?.gender ?? "--"],
    ] as const;

    return <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
            <View style={styles.headerRow}>
                <View style={styles.profile}>
                    <Pressable style={styles.avatarWrap} onPress={handlePickPhoto} disabled={uploading}>
                        <Image
                            source={trainee?.profilePhoto ? { uri: trainee.profilePhoto } : require("@/assets/images/Icons/face_icon.png")}
                            style={[styles.avatar, trainee?.profilePhoto && styles.avatarPhoto]}
                        />
                        <View style={styles.avatarBadge}>
                            {uploading ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <Ionicons name="add" size={14} color={Colors.white} />
                            )}
                        </View>
                    </Pressable>
                    <View>
                        <AppText style={styles.name} color={Colors.white} weight={FontWeight.medium}>{trainee?.name ?? "Trainee"}</AppText>
                        <View style={styles.online}>
                            <View style={styles.dot} />
                            <AppText style={styles.role} color={Colors.white}>{trainee?.designation ?? "Trainee"}</AppText>
                        </View>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <Pressable style={styles.iconButton} onPress={() => setEditVisible(true)}>
                        <Ionicons name="pencil" size={18} color={Colors.mainColour1} />
                    </Pressable>
                    <Pressable style={styles.iconButton} onPress={handleLogout}>
                        <Ionicons name="power" size={23} color={Colors.mainColour1} />
                    </Pressable>
                </View>
            </View>
            <View style={styles.sessionPill}>
                <Calendar width={13} height={13} />
                <AppText style={styles.sessionText}>{trainee ? locationLabel(trainee.state, trainee.district) : "--"}</AppText>
            </View>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
            <DetailsCard label="PERSONAL DETAILS" rows={personalDetails} />
            <DetailsCard label="ORGANIZATION DETAILS" rows={organizationDetails} />
            <View style={styles.safeNotice}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
                <AppText style={styles.safeText}>Your profile information is verified and secure.</AppText>
            </View>
        </ScrollView>
        <EditProfileSheet visible={editVisible} onClose={() => setEditVisible(false)} />
        <AppFooter
            items={[
                {
                    key: "plan",
                    label: "Plan",
                    icon: ({ size, color }) => <Calendar1 width={size} height={size} color={color} />,
                    onPress: () => router.replace("/session_detail"),
                },
                {
                    key: "calendar",
                    center: true,
                    icon: ({ size }) => <Calendar width={size} height={size} />,
                    onPress: () => router.replace("/session_detail"),
                },
                {
                    key: "profile",
                    label: "Profile",
                    active: true,
                    icon: ({ size, color }) => <AccountCircle width={size} height={size} color={color} />,
                    onPress: () => router.push("/profile"),
                },
            ]}
        />
    </SafeAreaView>;
}

function DetailsCard({ label, rows }: { label: string; rows: readonly (readonly [keyof typeof Ionicons.glyphMap, string, string])[] }) {
    return <View style={styles.card}>
        <AppText style={styles.cardLabel} color={Colors.primary}>{label}</AppText>{rows.map(([icon, title, value], index) => <View key={title} style={[styles.detailRow, index === rows.length - 1 && styles.lastRow]}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={22} color={Colors.primary} />
            </View>
            <View>
                <AppText style={styles.detailTitle}>{title}</AppText>
                <AppText style={styles.detailValue} weight={FontWeight.medium}>{value}</AppText>
            </View>
        </View>)}</View>;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { backgroundColor: Colors.mainColour1, padding: 22, paddingTop: 15, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    profile: { flexDirection: "row", alignItems: "center", gap: 9 },
    avatarWrap: { width: 52, height: 52 },
    avatar: { width: 52, height: 52 },
    avatarPhoto: { borderRadius: 26 },
    avatarBadge: {
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Colors.success,
        borderWidth: 2,
        borderColor: Colors.mainColour1,
        alignItems: "center",
        justifyContent: "center",
    },
    name: { fontSize: Fonts.h3 },
    online: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
    dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
    role: { fontSize: Fonts.caption },
    headerActions: { flexDirection: "row", gap: 8 },
    iconButton: { width: 31, height: 31, backgroundColor: Colors.white, borderRadius: 7, alignItems: "center", justifyContent: "center" },
    sessionPill: { marginTop: 12, alignSelf: "flex-start", borderRadius: 12, backgroundColor: Colors.white, paddingHorizontal: 9, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 5 },
    sessionText: { color: Colors.primary, fontSize: Fonts.caption },
    content: { padding: 11, gap: 11, paddingBottom: 100 },
    card: { backgroundColor: Colors.white, borderRadius: 12, padding: 12, shadowColor: Colors.black, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
    cardLabel: { alignSelf: "flex-start", backgroundColor: "#DDEEFF", borderRadius: 3, paddingHorizontal: 5, paddingVertical: 3, fontSize: Fonts.overline },
    detailRow: { minHeight: 43, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
    lastRow: { borderBottomWidth: 0 },
    iconBox: { width: 29, height: 29, borderRadius: 4, backgroundColor: "#DDEEFF", alignItems: "center", justifyContent: "center" },
    detailTitle: { fontSize: Fonts.overline, color: Colors.gray600 },
    detailValue: { fontSize: Fonts.caption, marginTop: 1 },
    safeNotice: { backgroundColor: "#DDEEFF", borderRadius: 6, padding: 10, flexDirection: "row", gap: 8, alignItems: "center" },
    safeText: { flex: 1, color: Colors.gray600, fontSize: Fonts.caption },

});
