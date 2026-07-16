import { KeyboardAvoidingView, Platform, ScrollView, View, StyleSheet, Modal, Pressable } from "react-native";
import AppText from "../ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import AppButton from "../ui/AppButton";
import { Ionicons } from "@expo/vector-icons";
import PersonalDetails from "@/components/registration/PersonalDetails";
import ProfessionalDetails from "@/components/registration/ProfessionalDetails";
import RegisterButton from "@/components/registration/RegisterButton";
import SecurityFooter from "@/components/common/SecurityFooter";

type RegisterSheetProps = {
    visible: boolean;
    onClose: () => void;
};

export default function RegisterSheet({
    visible,
    onClose,
}: RegisterSheetProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <Pressable
                    style={styles.overlay}
                    onPress={onClose}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.registerContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.headerText}>
                                <AppText size={20} weight="600">
                                    Participant Registration
                                </AppText>
                                <AppText
                                    size={12}
                                    style={styles.subtitle}
                                >
                                    Secure onboarding for this session
                                </AppText>
                            </View>
                            <Pressable onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={Colors.inputColour} />
                            </Pressable>
                        </View>
                        <View style={styles.divider} />
                        {/* Form Content */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.formContent}
                        >
                            <PersonalDetails />
                            <ProfessionalDetails />
                            <RegisterButton
                                onPress={() => {
                                    console.log("Register");
                                }}
                            />
                            <View style={styles.securityFooter}>
                                <SecurityFooter />
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: "flex-end",
    },
    registerContainer: {
        maxHeight: "95%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    formContent: {
        paddingBottom: 4,
    },
    securityFooter: {
        marginTop: 22,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12, // React Native 0.71+ supports gap
    },

    halfWidth: {
        flex: 1,
    },
    headerText: {
        flex: 1,
    },

    subtitle: {
        marginTop: 4,
        color: Colors.inputColour,
    },

    closeButton: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
    },
    ft: {
        fontSize: Fonts.bodyLg,
        color: Colors.mainColour1,
        fontWeight: FontWeight.semiBold,
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.inputColour2,
        // opacity: .2, 
        marginVertical: 16,
    },
});
