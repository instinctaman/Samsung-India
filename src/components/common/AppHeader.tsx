import { View, StyleSheet, Image } from "react-native";

import AppText from "../ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

export default function AuthHeader() {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image
                    source={require("@/assets/images/Icons/user_icon.png")}
                    style={styles.icon}
                    resizeMode="contain"
                />
            </View>
            <AppText
                weight="500"
                style={styles.title}
                color={Colors.white}
            >
                Welcome Back
            </AppText>
            <AppText
                color={Colors.white}
                style={styles.subtitle}
            >
                Authenticate to access your session
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: Colors.mainColour1,
        paddingRight: 35,
        paddingLeft: 35,
    },
    iconContainer: {
        borderRadius: 45,
        backgroundColor: "#E8F0FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    icon: {
        width: Fonts.profileIconSize,
        height: Fonts.profileIconSize,
        backgroundColor: Colors.mainColour1,
        tintColor: "#E8F0FF",
        borderRadius: 45,
    },
    title: {
        marginBottom: 8,
        fontSize: Fonts.h1,
    },
    subtitle: {
        textAlign: "center",
        fontSize: Fonts.xs,
    },
});
