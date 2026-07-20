import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import {
    Control,
    Controller,
    FieldErrors,
    UseFormSetValue,
    useWatch,
} from "react-hook-form";

import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import { STATES } from "@/data/states";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { RegisterFormValues } from "@/hooks/useRegisterForm";

type ProfessionalDetailsProps = {
    control: Control<RegisterFormValues>;
    setValue: UseFormSetValue<RegisterFormValues>;
    errors: FieldErrors<RegisterFormValues>;
};

export default function ProfessionalDetails({
    control,
    setValue,
    errors,
}: ProfessionalDetailsProps) {
    const state = useWatch({ control, name: "state" });
    const selectedState = useMemo(
        () => STATES.find((item) => item.value === state),
        [state]
    );

    return (
        <View>
            <AppText style={styles.sectionTitle}>
                PROFESSIONAL INFO
            </AppText>

            <View style={styles.row}>
                <View style={styles.half}>
                    <Controller
                        control={control}
                        name="designation"
                        rules={{ required: "Designation is required" }}
                        render={({ field: { value, onChange } }) => (
                            <AppInput
                                placeholder="Designation*"
                                autoCapitalize="words"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                <View style={styles.half}>
                    <Controller
                        control={control}
                        name="employee_id"
                        render={({ field: { value, onChange } }) => (
                            <AppInput
                                placeholder="Employee ID"
                                autoCapitalize="characters"
                                autoCorrect={false}
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>
            </View>
            {errors.designation && (
                <AppText style={styles.error}>{errors.designation.message}</AppText>
            )}

            <Controller
                control={control}
                name="supervisorName"
                render={({ field: { value, onChange } }) => (
                    <AppInput
                        placeholder="Supervisor Name"
                        autoCapitalize="words"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />

            <View style={styles.row}>
                <View style={styles.half}>
                    <Controller
                        control={control}
                        name="state"
                        render={({ field: { value, onChange } }) => (
                            <AppSelect
                                selectedValue={value}
                                onValueChange={(newValue) => {
                                    onChange(newValue);
                                    setValue("district", "");
                                }}
                                items={[
                                    {
                                        label: "Select State",
                                        value: "",
                                    },
                                    ...STATES.map((item) => ({
                                        label: item.label,
                                        value: item.value,
                                    })),
                                ]}
                            />
                        )}
                    />
                </View>

                <View style={styles.half}>
                    <Controller
                        control={control}
                        name="district"
                        render={({ field: { value, onChange } }) => (
                            <AppSelect
                                selectedValue={value}
                                onValueChange={onChange}
                                items={[
                                    {
                                        label: "Select City",
                                        value: "",
                                    },
                                    ...(selectedState?.cities || []),
                                ]}
                            />
                        )}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: Fonts.bodyLg,
        color: Colors.mainColour1,
        fontWeight: FontWeight.semiBold,
        marginBottom: 10,
        marginTop: 6,
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
