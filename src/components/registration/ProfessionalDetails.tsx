import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";

import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import { STATES } from "@/data/states";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

export default function ProfessionalDetails() {
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
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
                    <AppInput
                        placeholder="Designation*"
                        autoCapitalize="words"
                    />
                </View>

                <View style={styles.half}>
                    <AppInput
                        placeholder="Employee ID"
                        autoCapitalize="characters"
                        autoCorrect={false}
                    />
                </View>
            </View>

            <AppInput
                placeholder="Supervisor Name"
                autoCapitalize="words"
            />

            <View style={styles.row}>
                <View style={styles.half}>
                    <AppSelect
                        selectedValue={state}
                        onValueChange={(value) => {
                            setState(value);
                            setCity("");
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
                </View>

                <View style={styles.half}>
                    <AppSelect
                        selectedValue={city}
                        onValueChange={setCity}
                        items={[
                            {
                                label: "Select City",
                                value: "",
                            },
                            ...(selectedState?.cities || []),
                        ]}
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
});