import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";

import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { RegisterFormValues } from "@/hooks/useRegisterForm";

type PersonalDetailsProps = {
    control: Control<RegisterFormValues>;
    errors: FieldErrors<RegisterFormValues>;
};

export default function PersonalDetails({ control, errors }: PersonalDetailsProps) {
    return (
        <View>
            <AppText style={styles.sectionTitle}>
                PERSONAL DETAILS
            </AppText>

            <Controller
                control={control}
                name="name"
                rules={{ required: "Full name is required" }}
                render={({ field: { value, onChange } }) => (
                    <AppInput
                        placeholder="Full Name*"
                        autoCapitalize="words"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors.name && (
                <AppText style={styles.error}>{errors.name.message}</AppText>
            )}

            <View style={styles.row}>
                <View style={styles.half}>
                    <Controller
                        control={control}
                        name="phone"
                        rules={{
                            required: "Phone No is required",
                            minLength: { value: 10, message: "Enter a valid phone number" },
                        }}
                        render={({ field: { value, onChange } }) => (
                            <AppInput
                                placeholder="Phone No*"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                <View style={styles.half}>
                    <Controller
                        control={control}
                        name="gender"
                        render={({ field: { value, onChange } }) => (
                            <AppSelect
                                selectedValue={value}
                                onValueChange={onChange}
                                items={[
                                    {
                                        label: "Choose Gender",
                                        value: "",
                                    },
                                    {
                                        label: "Male",
                                        value: "male",
                                    },
                                    {
                                        label: "Female",
                                        value: "female",
                                    },
                                    {
                                        label: "Other",
                                        value: "other",
                                    },
                                ]}
                            />
                        )}
                    />
                </View>
            </View>
            {errors.phone && (
                <AppText style={styles.error}>{errors.phone.message}</AppText>
            )}

            <Controller
                control={control}
                name="email"
                rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                    },
                }}
                render={({ field: { value, onChange } }) => (
                    <AppInput
                        placeholder="Email*"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors.email && (
                <AppText style={styles.error}>{errors.email.message}</AppText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: Fonts.bodyLg,
        color: Colors.mainColour1,
        fontWeight: FontWeight.semiBold,
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        gap: 12,
    },

    half: {
        flex: 1,
    },

    error: {
        color: Colors.danger,
        fontSize: Fonts.bodySm,
        marginTop: -12,
        marginBottom: 12,
    },
});
