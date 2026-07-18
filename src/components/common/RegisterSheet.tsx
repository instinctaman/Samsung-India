import { ScrollView, View, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";
import PersonalDetails from "@/components/registration/PersonalDetails";
import ProfessionalDetails from "@/components/registration/ProfessionalDetails";
import RegisterButton from "@/components/registration/RegisterButton";
import SecurityFooter from "@/components/common/SecurityFooter";
import AppModal from "@/components/ui/AppModal";

type RegisterSheetProps = {
    visible: boolean;
    onClose: () => void;
};


export default function RegisterSheet({
    visible,
    onClose,
}: RegisterSheetProps) {
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
                <PersonalDetails />
                <ProfessionalDetails />
                <RegisterButton onPress={() => { }} />

                <View style={styles.securityFooter}>
                    <SecurityFooter />
                </View>
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

    divider: {
        height: 1,
        backgroundColor: Colors.inputColour2,
        // opacity: .2, 
        marginVertical: 16,
    },
});
