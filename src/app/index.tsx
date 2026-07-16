import { useRef, useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import AppCard from "@/components/ui/AppCard";
import AuthHeader from "@/components/common/AppHeader";
import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import RegisterSheet from "@/components/common/RegisterSheet";
import SecurityFooter from "@/components/common/SecurityFooter";
// import RegisterBottomSheet from "@/components/bottom-sheet/RegisterSheet";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

export default function HomeScreen() {
  const router = useRouter();
  // const bottomSheetRef = useRef(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const openRegister = () => setIsRegisterOpen(true);
  const closeRegister = () => setIsRegisterOpen(false);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AppCard>
          <View style={styles.header}>
            <AuthHeader />
          </View>
          <View style={styles.body}>
            <AppInput
              label="Company ID / Phone No"
              placeholder="Enter Company ID or Phone No"
            />
            <AppButton
              title="Continue"
              onPress={() => router.push("/session")}
            />
            <Pressable onPress={openRegister}>
              <AppText
                weight="500"
                style={styles.register}
              >
                New User ? Register
              </AppText>
            </Pressable>
          </View>
        </AppCard>
        <View style={styles.securityFooter}>
          <SecurityFooter />
        </View>
        <RegisterSheet
          visible={isRegisterOpen}
          onClose={closeRegister}
        />
        {/* <RegisterBottomSheet
          ref={bottomSheetRef}
        /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4FF",
  },
  header: {
    backgroundColor: Colors.mainColour1,
    paddingVertical: 35,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    alignItems: "center",
  },
  body: {
    padding: 20,
  },
  register: {
    marginTop: 15,
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: Fonts.bodySm,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  securityFooter: {
    marginTop: 42,
  },
});
