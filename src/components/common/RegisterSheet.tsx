import { Pressable, ScrollView, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import PersonalDetails from "@/components/registration/PersonalDetails";
import ProfessionalDetails from "@/components/registration/ProfessionalDetails";
import RegisterButton from "@/components/registration/RegisterButton";
import SecurityFooter from "@/components/common/SecurityFooter";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { useRegisterForm } from "@/hooks/useRegisterForm";

type RegisterSheetProps = {
    visible: boolean;
    onClose: () => void;
};


export default function RegisterSheet({
    visible,
    onClose,
}: RegisterSheetProps) {
    const router = useRouter();
    const { control, errors, setValue, onSubmit, loading, error } = useRegisterForm({
        onSuccess: () => {
            onClose();
            router.push("/session");
        },
    });

    return (
        <AppModal
            visible={visible}
            title="Participant Registration"
            subtitle="Secure onboarding for this session"
            onClose={onClose}
            position="bottom"
            contentStyle={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 40,
            }}
        >
            <View style={styles.divider} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}
            >
                <PersonalDetails control={control} errors={errors} />
                <ProfessionalDetails control={control} setValue={setValue} errors={errors} />

                {error && (
                    <AppText style={styles.error}>{error}</AppText>
                )}

                <RegisterButton onPress={onSubmit} loading={loading} />

                <View style={styles.securityFooter}>
                    <SecurityFooter />
                </View>

                <Pressable
                    style={styles.trainerLogin}
                    onPress={() => {
                        onClose();
                        router.push("/trainer_login");
                    }}
                >
                    <View style={styles.trainerLoginIcon}>
                        <Ionicons name="school-outline" size={24} color={Colors.white} />
                    </View>
                    <AppText style={styles.trainerLoginLabel}>Trainer Login</AppText>
                </Pressable>
            </ScrollView>
        </AppModal>
    );
}

const styles = StyleSheet.create({
    formContent: {
        paddingBottom: 4,
    },
    securityFooter: {
        marginTop: 22,
    },

    trainerLogin: {
        marginTop: 18,
        alignItems: "center",
        gap: 6,
    },

    trainerLoginIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.mainColour1,
        alignItems: "center",
        justifyContent: "center",
    },

    trainerLoginLabel: {
        fontSize: Fonts.bodySm,
        color: Colors.mainColour1,
    },

    divider: {
        height: 1,
        backgroundColor: Colors.inputColour2,
        // opacity: .2,
        marginVertical: 16,
    },

    error: {
        color: Colors.danger,
        fontSize: Fonts.bodySm,
        marginBottom: 12,
        textAlign: "center",
    },
});
