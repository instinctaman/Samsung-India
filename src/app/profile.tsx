import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Calendar from "@/assets/images/svg/calender.svg";
import AppText from "@/components/ui/AppText";
import AppFooter from "@/components/ui/AppFooter";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

const personalDetails = [["call-outline", "Mobile", "8750574444"], ["mail-outline", "Email", "anandkumar@quess.com"], ["briefcase-outline", "Designation", "SEC"], ["card-outline", "Employee ID", "SOUTH1234"], ["location-outline", "Work Zone", "SOUTH"]] as const;
const organizationDetails = [["person-outline", "Reporting Manager", "ANAND ROY"], ["call-outline", "Department Support", "8569741259"]] as const;

export default function ProfileScreen() {
    return <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
            <View style={styles.headerRow}>
                <View style={styles.profile}>
                    <Image source={require("@/assets/images/Icons/face_icon.png")} style={styles.avatar} />
                    <View>
                        <AppText style={styles.name} color={Colors.white} weight={FontWeight.medium}>Anshu Pandey</AppText>
                        <View style={styles.online}>
                            <View style={styles.dot} />
                            <AppText style={styles.role} color={Colors.white}>SEC</AppText>
                        </View>
                    </View>
                </View>
                <Pressable style={styles.power}>
                    <Ionicons name="power" size={23} color={Colors.mainColour1} />
                </Pressable>
            </View>
            <View style={styles.sessionPill}>
                <Calendar width={13} height={13} />
                <AppText style={styles.sessionText}>SOUTH 12234</AppText>
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
        <AppFooter activeTab="profile" />
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
    avatar: { width: 52, height: 52 },
    name: { fontSize: Fonts.h3 },
    online: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
    dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
    role: { fontSize: Fonts.caption },
    power: { width: 31, height: 31, backgroundColor: Colors.white, borderRadius: 7, alignItems: "center", justifyContent: "center" },
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
