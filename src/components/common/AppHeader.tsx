import { View, StyleSheet, Image } from "react-native";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";

export default function AuthHeader() {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image
                    source={require("@/assets/images/Icons/user_icon.png")}
                    style={styles.icon}
                    resizeMode="contain"
                    tintColor="#E8F0FF"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.mainColour1,
        paddingVertical: 32,
        borderTopLeftRadius: Radius.xxl,
        borderTopRightRadius: Radius.xxl,
    },
    iconContainer: {
        borderRadius: 45,
        backgroundColor: "#E8F0FF",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        width: Fonts.profileIconSize,
        height: Fonts.profileIconSize,
        backgroundColor: Colors.mainColour1,
        borderRadius: 45,
    },
});
