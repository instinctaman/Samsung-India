import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/ui/AppCard";
import AppInput from "@/components/ui/AppInput";
import AppText from "@/components/ui/AppText";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";
import { DateTimeField } from "./DateTimeField";
import { SectionTitle } from "./SectionTitle";
import {
  ATTENDANCE_COLOR,
  MODULE_COLORS,
  MODULE_ICONS,
  MODULE_LABELS,
  ModuleKey,
  TOOLBAR_MODULE_ORDER,
  UNLOCK_CONDITIONS,
} from "./constants";
import { AddTrainingForm } from "./useAddTrainingForm";

export function SessionFlowSection({ form }: { form: AddTrainingForm }) {
  const anyModuleEnabled = Object.values(form.modules).some((m) => m.enabled);

  return (
    <AppCard style={styles.card}>
      <SectionTitle index={4} title="Session Flow" icon="git-branch-outline" />

      <View style={styles.flowToolbar}>
        <Pressable style={styles.flowToolBtn} onPress={() => form.setAttendanceEnabled((v) => !v)}>
          <Ionicons name="people" size={20} color={ATTENDANCE_COLOR} />
        </Pressable>
        {TOOLBAR_MODULE_ORDER.map((key) => (
          <Pressable key={key} style={styles.flowToolBtn} onPress={() => form.toggleModule(key)}>
            <Ionicons name={MODULE_ICONS[key]} size={20} color={MODULE_COLORS[key]} />
          </Pressable>
        ))}
      </View>
      <View style={styles.flowToolbarDivider} />

      {!form.attendanceEnabled && !anyModuleEnabled && (
        <View style={styles.emptyFlow}>
          <View style={styles.emptyFlowIconRing}>
            <Ionicons name="arrow-up" size={18} color={Colors.gray400} />
          </View>
          <AppText style={styles.emptyFlowText} color={Colors.gray600}>
            Select a module from the toolbar above to start building your session flow.
          </AppText>
        </View>
      )}

      {form.attendanceEnabled && (
        <View style={styles.plainModuleCard}>
          <View style={styles.plainModuleHeader}>
            <Ionicons name="people" size={16} color={ATTENDANCE_COLOR} />
            <AppText style={styles.plainModuleTitle} weight={FontWeight.semiBold}>ATTENDANCE</AppText>
          </View>
          <View style={styles.plainModuleHeaderDivider} />
          <DateTimeField compact label="Check-In Opens" value={form.checkInOpens} mode="time" onChange={form.setCheckInOpens} plain />
          <DateTimeField compact label="Check-Out Opens" value={form.checkOutCloses} mode="time" onChange={form.setCheckOutCloses} plain />
          <Pressable style={styles.checkboxRow} onPress={() => form.setGeoFencing((v) => !v)}>
            <View style={[styles.checkbox, form.geoFencing && styles.checkboxChecked]}>
              {form.geoFencing && <Ionicons name="checkmark" size={12} color={Colors.white} />}
            </View>
            <AppText style={styles.checkboxLabel}>GeoFencing</AppText>
          </Pressable>
        </View>
      )}

      {(Object.keys(MODULE_LABELS) as ModuleKey[])
        .filter((key) => form.modules[key].enabled)
        .map((key) => (
          <ModuleCard key={key} moduleKey={key} form={form} />
        ))}
    </AppCard>
  );
}

function ModuleCard({ moduleKey: key, form }: { moduleKey: ModuleKey; form: AddTrainingForm }) {
  const moduleState = form.modules[key];
  const selectedSuite = form.assessmentSuites.find((s) => s.assessmentSuiteUid === moduleState.assessmentSuiteUid);

  return (
    <View style={styles.plainModuleCard}>
      <View style={styles.plainModuleHeader}>
        <Ionicons name={MODULE_ICONS[key]} size={16} color={MODULE_COLORS[key]} />
        <AppText style={styles.plainModuleTitle} weight={FontWeight.semiBold}>{MODULE_LABELS[key].toUpperCase()}</AppText>
      </View>
      <View style={styles.plainModuleHeaderDivider} />

      <SearchableSelect
        label="Category"
        compact
        placeholder="Select Category..."
        value={moduleState.category ?? ""}
        options={form.categoryOptions}
        onSelect={(option) =>
          form.updateModule(key, { category: option.value, assessmentSuiteUid: undefined, questionCount: "" })
        }
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <SearchableSelect
            label="Select Question Set"
            compact
            placeholder={moduleState.category ? "Select Test" : "Select Category First"}
            value={moduleState.assessmentSuiteUid ?? ""}
            options={form.questionSetOptionsFor(moduleState.category)}
            onSelect={(option) => {
              const suite = form.assessmentSuites.find((s) => s.assessmentSuiteUid === option.value);
              form.updateModule(key, {
                assessmentSuiteUid: option.value,
                questionCount: suite ? String(suite.noOfQuestion) : "",
              });
            }}
            disabled={!moduleState.category}
          />
        </View>
        <View style={styles.half}>
          <View style={styles.questionsLabelRow}>
            <AppText style={styles.fieldLabel} weight={FontWeight.medium}>Questions</AppText>
            {moduleState.assessmentSuiteUid && (
              <View style={styles.maxBadge}>
                <AppText style={styles.maxBadgeText} color={Colors.white}>
                  Max: {selectedSuite?.noOfQuestion ?? 0}
                </AppText>
              </View>
            )}
          </View>
          <AppInput
            compact
            placeholder="Number of questions"
            keyboardType="number-pad"
            value={moduleState.questionCount}
            onChangeText={(text) => form.updateModule(key, { questionCount: text })}
            editable={!!moduleState.assessmentSuiteUid}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <DateTimeField
            compact
            label="Start Time"
            value={moduleState.startTime ?? ""}
            mode="time"
            onChange={(v) => form.updateModule(key, { startTime: v })}
            plain
          />
        </View>
        <View style={styles.half}>
          <DateTimeField
            compact
            label="End Time"
            value={moduleState.endTime ?? ""}
            mode="time"
            onChange={(v) => form.updateModule(key, { endTime: v })}
            plain
          />
        </View>
      </View>
      <Pressable style={styles.checkboxRow} onPress={() => form.updateModule(key, { checkIn: !moduleState.checkIn })}>
        <View style={[styles.checkbox, moduleState.checkIn && styles.checkboxChecked]}>
          {moduleState.checkIn && <Ionicons name="checkmark" size={12} color={Colors.white} />}
        </View>
        <AppText style={styles.checkboxLabel}>Check-in</AppText>
      </Pressable>
      <AppText style={styles.fieldLabel} weight={FontWeight.medium}>Unlock Condition</AppText>
      <SearchableSelect
        compact
        value={moduleState.unlockCondition ?? "Automatic"}
        options={UNLOCK_CONDITIONS.map((u) => ({ label: u, value: u }))}
        onSelect={(option) => form.updateModule(key, { unlockCondition: option.value })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  fieldLabel: { fontSize: Fonts.body, marginBottom: Spacing.sm },
  questionsLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: Spacing.sm },
  maxBadge: { backgroundColor: Colors.success, borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  maxBadgeText: { fontSize: Fonts.overline },
  flowToolbar: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 22,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginBottom: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.pill,
  },
  flowToolBtn: { alignItems: "center", justifyContent: "center" },
  flowToolbarDivider: { height: 1, backgroundColor: Colors.gray200, marginBottom: 14 },
  emptyFlow: { alignItems: "center", gap: 10, paddingVertical: 28, backgroundColor: Colors.gray100, borderRadius: Radius.xl },
  emptyFlowIconRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyFlowText: { fontSize: Fonts.bodySm, textAlign: "center", paddingHorizontal: 24 },
  plainModuleCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.xl,
    padding: 14,
    marginBottom: 12,
  },
  plainModuleHeader: { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 12 },
  plainModuleTitle: { fontSize: Fonts.body, letterSpacing: 0.3 },
  plainModuleHeaderDivider: { height: 1, backgroundColor: Colors.gray200, marginBottom: 14 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: Spacing.lg },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: Colors.mainColour1, borderColor: Colors.mainColour1 },
  checkboxLabel: { fontSize: Fonts.body, flex: 1 },
});
