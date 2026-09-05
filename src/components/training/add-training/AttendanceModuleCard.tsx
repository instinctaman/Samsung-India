import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import AppInput from "@/components/ui/AppInput";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { digitsOnly } from "@/utils/validation";
import { ATTENDANCE_COLOR, ATTENDANCE_ICON } from "./constants";
import { DateTimeField } from "./DateTimeField";
import { flowCardStyles as s } from "./flowCardStyles";
import { AddTrainingForm } from "./useAddTrainingForm";

export function AttendanceModuleCard({ form }: { form: AddTrainingForm }) {
  return (
    <View style={s.card}>
      <View style={s.header}>
        <Ionicons name={ATTENDANCE_ICON} size={16} color={ATTENDANCE_COLOR} />
        <AppText style={s.headerTitle} weight={FontWeight.semiBold}>ATTENDANCE</AppText>
      </View>
      <View style={s.headerDivider} />

      <DateTimeField compact label="Check-In Opens" value={form.checkInOpens} mode="time" onChange={form.setCheckInOpens} plain />
      <DateTimeField compact label="Check-Out Opens" value={form.checkOutCloses} mode="time" onChange={form.setCheckOutCloses} plain />

      <Pressable
        style={[s.checkboxRow, form.geoFencing && s.checkboxRowTight]}
        onPress={() => form.setGeoFencing((v) => !v)}
      >
        <View style={[s.checkbox, form.geoFencing && s.checkboxChecked]}>
          {form.geoFencing && <Ionicons name="checkmark" size={12} color={Colors.white} />}
        </View>
        <AppText style={s.checkboxLabel}>GeoFencing</AppText>
      </Pressable>

      {form.geoFencing && (
        <>
          <AppInput
            compact
            label="Check-in radius (metres)"
            value={form.geoRadius}
            onChangeText={(t) => form.setGeoRadius(digitsOnly(t).slice(0, 4))}
            keyboardType="number-pad"
            placeholder="100"
          />
          <AppText style={s.geoHint} color={Colors.gray600}>
            Trainees must be within this distance of the venue&apos;s saved location to check
            in. If the venue has no coordinates on record, the fence isn&apos;t enforced.
          </AppText>
        </>
      )}
    </View>
  );
}
