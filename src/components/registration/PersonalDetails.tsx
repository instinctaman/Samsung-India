import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

export default function PersonalDetails() {
    const [gender, setGender] = useState("");
    return (
        <View>
            <AppText style={styles.sectionTitle}>
                PERSONAL DETAILS
            </AppText>

            <AppInput
                placeholder="Full Name*"
                autoCapitalize="words"
            />

            <View style={styles.row}>
                <View style={styles.half}>
                    <AppInput
                        placeholder="Phone No*"
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View>

                <View style={styles.half}>
                    <AppSelect
                        selectedValue={gender}
                        onValueChange={setGender}
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
                </View>
            </View>

            <AppInput
                placeholder="Email*"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
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
});