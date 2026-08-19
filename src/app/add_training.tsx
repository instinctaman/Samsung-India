import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import AppText from "@/components/ui/AppText";
import {
  SearchableMultiSelect,
  SearchableSelect,
} from "@/components/ui/SearchableSelect";
import { STATES } from "@/data/states";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { Spacing } from "@/theme/spacing";

import {
  AUDIENCE_OPTIONS,
  CHECKLIST_OPTIONS,
  MODULE_ICONS,
  MODULE_LABELS,
  ModuleKey,
  REGIONS_BY_ZONE,
  REQUESTED_BY_OPTIONS,
  SESSION_TYPE_OPTIONS,
  TRAINER_OPTIONS,
  TRAINING_HUB_OPTIONS,
  TRAINING_TYPE_OPTIONS,
  UNLOCK_CONDITIONS,
  useAddTrainingForm,
  ZONES,
} from "@/hooks/useAddTrainingForm";

const pad2 = (n: number) => String(n).padStart(2, "0");
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const formatTime = (d: Date) => {
  let hours = d.getHours();
  const minutes = pad2(d.getMinutes());
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${pad2(hours)}:${minutes} ${suffix}`;
};

function DateTimeField({
  label,
  value,
  mode,
  onChange,
}: {
  label: string;
  value: string;
  mode: "date" | "time";
  onChange: (formatted: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  const open = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: new Date(),
        mode,
        is24Hour: false,
        onChange: (_event, selected) => {
          if (selected)
            onChange(
              mode === "date" ? formatDate(selected) : formatTime(selected),
            );
        },
      });
    } else {
      setShowPicker(true);
    }
  };

  return (
    <View style={styles.field}>
      <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
        {label}
      </AppText>
      <Pressable style={styles.pickerField} onPress={open}>
        <Ionicons
          name={mode === "date" ? "calendar-outline" : "time-outline"}
          size={16}
          color={Colors.gray600}
        />
        <AppText
          style={styles.pickerFieldText}
          color={value ? Colors.black : Colors.gray400}
        >
          {value || (mode === "date" ? "dd-mm-yyyy" : "--:-- --")}
        </AppText>
      </Pressable>

      {Platform.OS === "ios" && showPicker && (
        <View style={styles.inlinePicker}>
          <DateTimePicker
            value={new Date()}
            mode={mode}
            display="spinner"
            onChange={(_event, selected) => {
              if (selected)
                onChange(
                  mode === "date" ? formatDate(selected) : formatTime(selected),
                );
            }}
          />
          <Pressable
            style={styles.doneButton}
            onPress={() => setShowPicker(false)}
          >
            <AppText color={Colors.mainColour1} weight={FontWeight.semiBold}>
              Done
            </AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function SectionTitle({ index, title }: { index: number; title: string }) {
  return (
    <AppText
      style={styles.sectionTitle}
      color={Colors.mainColour1}
      weight={FontWeight.semiBold}
    >
      {index}. {title}
    </AppText>
  );
}

export default function AddTrainingScreen() {
  const router = useRouter();

  const {
    zone,
    setZone,
    region,
    setRegion,
    company,
    setCompany,
    requestedByOption,
    setRequestedByOption,
    requestedByOther,
    setRequestedByOther,
    trainerId,
    setTrainerId,
    trainerName,
    setTrainerName,
    stateValue,
    setStateValue,
    district,
    setDistrict,
    venue,
    setVenue,
    isResidential,
    setIsResidential,
    conferenceDate,
    setConferenceDate,
    conferenceTime,
    setConferenceTime,
    trainingHub,
    setTrainingHub,
    audience,
    setAudience,
    sessionType,
    setSessionType,
    trainingType,
    setTrainingType,
    batchSize,
    setBatchSize,
    attendanceEnabled,
    setAttendanceEnabled,
    checkInOpens,
    setCheckInOpens,
    checkOutCloses,
    setCheckOutCloses,
    geoFencing,
    setGeoFencing,
    modules,
    toggleModule,
    updateModule,
    checklist,
    setChecklist,
    agreeTerms,
    setAgreeTerms,
    submitting,
    notice,
    assessmentSuites,
    categoryOptions,
    questionSetOptionsFor,
    selectedState,
    handleSubmit,
  } = useAddTrainingForm();

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.mainColour1} />
          </Pressable>
          <AppText style={styles.headerTitle} weight={FontWeight.semiBold}>
            Training Registration
          </AppText>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AppCard style={styles.card}>
            <SectionTitle index={1} title="Basic Details" />
            <View style={styles.row}>
              <View style={styles.half}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
                  Zone
                </AppText>
                <AppSelect
                  selectedValue={zone}
                  onValueChange={(v) => {
                    setZone(v);
                    setRegion("");
                  }}
                  items={[
                    { label: "Select Zone", value: "" },
                    ...ZONES.map((z) => ({ label: z, value: z })),
                  ]}
                />
              </View>
              <View style={styles.half}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
                  Region
                </AppText>
                <AppSelect
                  selectedValue={region}
                  onValueChange={setRegion}
                  items={[
                    {
                      label: zone ? "Select Region" : "Select Zone First",
                      value: "",
                    },
                    ...(REGIONS_BY_ZONE[zone] ?? []).map((r) => ({
                      label: r,
                      value: r,
                    })),
                  ]}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <AppInput
                  label="Company"
                  placeholder="Company name"
                  value={company}
                  onChangeText={setCompany}
                />
              </View>
              <View style={styles.half}>
                <SearchableSelect
                  label="Requested By"
                  placeholder="Select requester"
                  value={requestedByOption}
                  options={REQUESTED_BY_OPTIONS}
                  onSelect={(option) => setRequestedByOption(option.value)}
                />
              </View>
            </View>
            {requestedByOption === "Other" && (
              <AppInput
                placeholder="Enter Name"
                value={requestedByOther}
                onChangeText={setRequestedByOther}
              />
            )}
          </AppCard>

          <AppCard style={styles.card}>
            <SectionTitle index={2} title="Trainer & Venue" />
            <View style={styles.row}>
              <View style={styles.half}>
                <SearchableSelect
                  label="Trainer ID"
                  required
                  placeholder="Select Now"
                  value={trainerId}
                  options={TRAINER_OPTIONS}
                  onSelect={(option) => {
                    setTrainerId(option.value);
                    setTrainerName(option.label.split(" - ")[1] ?? "");
                  }}
                />
              </View>
              <View style={styles.half}>
                <AppInput
                  label="Trainer Name"
                  placeholder="Auto-fetched name"
                  value={trainerName}
                  editable={false}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
                  State
                </AppText>
                <AppSelect
                  selectedValue={stateValue}
                  onValueChange={(value) => {
                    setStateValue(value);
                    setDistrict("");
                  }}
                  items={[
                    { label: "Select State", value: "" },
                    ...STATES.map((s) => ({ label: s.label, value: s.value })),
                  ]}
                />
              </View>
              <View style={styles.half}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
                  District
                </AppText>
                <AppSelect
                  selectedValue={district}
                  onValueChange={setDistrict}
                  items={[
                    { label: "Select District", value: "" },
                    ...(selectedState?.cities ?? []),
                  ]}
                />
              </View>
            </View>
            <AppInput
              label="Venue"
              placeholder="Venue address"
              value={venue}
              onChangeText={setVenue}
            />
          </AppCard>

          <AppCard style={styles.card}>
            <SectionTitle index={3} title="Training Details" />
            <Pressable
              style={styles.toggleRow}
              onPress={() => setIsResidential((v) => !v)}
            >
              <AppText style={styles.toggleLabel}>
                Is this a Residential Program?
              </AppText>
              <Switch
                value={isResidential}
                onValueChange={setIsResidential}
                trackColor={{ true: Colors.mainColour1 }}
              />
            </Pressable>

            <View style={styles.row}>
              <View style={styles.half}>
                <DateTimeField
                  label="Training Date *"
                  value={conferenceDate}
                  mode="date"
                  onChange={setConferenceDate}
                />
              </View>
              <View style={styles.half}>
                <DateTimeField
                  label="Start Time *"
                  value={conferenceTime}
                  mode="time"
                  onChange={setConferenceTime}
                />
              </View>
            </View>
            <SearchableSelect
              label="Training Hub"
              placeholder="Select Hub"
              value={trainingHub}
              options={TRAINING_HUB_OPTIONS}
              onSelect={(option) => setTrainingHub(option.value)}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <SearchableSelect
                  label="Audience"
                  placeholder="Select Audience"
                  value={audience}
                  options={AUDIENCE_OPTIONS}
                  onSelect={(option) => setAudience(option.value)}
                />
              </View>
              <View style={styles.half}>
                <SearchableSelect
                  label="Session Type"
                  placeholder="Select Session Type"
                  value={sessionType}
                  options={SESSION_TYPE_OPTIONS}
                  onSelect={(option) => setSessionType(option.value)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <SearchableSelect
                  label="Training Type"
                  placeholder="Select Training Type"
                  value={trainingType}
                  options={TRAINING_TYPE_OPTIONS}
                  onSelect={(option) => setTrainingType(option.value)}
                />
              </View>
              <View style={styles.half}>
                <AppInput
                  label="Batch Size"
                  placeholder="e.g. 25"
                  keyboardType="number-pad"
                  value={batchSize}
                  onChangeText={setBatchSize}
                />
              </View>
            </View>
          </AppCard>

          <AppCard style={styles.card}>
            <SectionTitle index={4} title="Session Flow (Evaluations)" />

            <View style={styles.chipRow}>
              <Pressable
                style={[styles.chip, attendanceEnabled && styles.chipActive]}
                onPress={() => setAttendanceEnabled((v) => !v)}
              >
                <Ionicons
                  name="people"
                  size={14}
                  color={attendanceEnabled ? Colors.white : Colors.gray600}
                />
                <AppText
                  style={styles.chipLabel}
                  color={attendanceEnabled ? Colors.white : Colors.gray600}
                >
                  Attendance
                </AppText>
              </Pressable>
              {(Object.keys(MODULE_LABELS) as ModuleKey[]).map((key) => (
                <Pressable
                  key={key}
                  style={[
                    styles.chip,
                    modules[key].enabled && styles.chipActive,
                  ]}
                  onPress={() => toggleModule(key)}
                >
                  <Ionicons
                    name={MODULE_ICONS[key]}
                    size={14}
                    color={modules[key].enabled ? Colors.white : Colors.gray600}
                  />
                  <AppText
                    style={styles.chipLabel}
                    color={modules[key].enabled ? Colors.white : Colors.gray600}
                  >
                    {MODULE_LABELS[key]}
                  </AppText>
                </Pressable>
              ))}
            </View>

            {!attendanceEnabled &&
              !Object.values(modules).some((m) => m.enabled) && (
                <View style={styles.emptyFlow}>
                  <Ionicons name="arrow-up" size={18} color={Colors.gray400} />
                  <AppText style={styles.emptyFlowText} color={Colors.gray600}>
                    Select a module above to start building your session flow.
                  </AppText>
                </View>
              )}

            {attendanceEnabled && (
              <View style={styles.moduleCard}>
                <View style={styles.moduleHeader}>
                  <Ionicons name="people" size={16} color={Colors.success} />
                  <AppText
                    style={styles.moduleTitle}
                    weight={FontWeight.semiBold}
                  >
                    ATTENDANCE
                  </AppText>
                  <Pressable
                    onPress={() => setAttendanceEnabled(false)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={Colors.danger}
                    />
                  </Pressable>
                </View>
                <View style={styles.row}>
                  <View style={styles.half}>
                    <DateTimeField
                      label="Check-In Opens"
                      value={checkInOpens}
                      mode="time"
                      onChange={setCheckInOpens}
                    />
                  </View>
                  <View style={styles.half}>
                    <DateTimeField
                      label="Check-Out Closes"
                      value={checkOutCloses}
                      mode="time"
                      onChange={setCheckOutCloses}
                    />
                  </View>
                </View>
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => setGeoFencing((v) => !v)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      geoFencing && styles.checkboxChecked,
                    ]}
                  >
                    {geoFencing && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color={Colors.white}
                      />
                    )}
                  </View>
                  <AppText style={styles.checkboxLabel}>GeoFencing</AppText>
                </Pressable>
              </View>
            )}

            {(Object.keys(MODULE_LABELS) as ModuleKey[])
              .filter((key) => modules[key].enabled)
              .map((key) => (
                <View key={key} style={styles.moduleCard}>
                  <View style={styles.moduleHeader}>
                    <Ionicons
                      name={MODULE_ICONS[key]}
                      size={16}
                      color={Colors.mainColour1}
                    />
                    <AppText
                      style={styles.moduleTitle}
                      weight={FontWeight.semiBold}
                    >
                      {MODULE_LABELS[key].toUpperCase()}
                    </AppText>
                    <Pressable onPress={() => toggleModule(key)} hitSlop={8}>
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={Colors.danger}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.half}>
                      <SearchableSelect
                        label="Category"
                        placeholder="Select Category..."
                        value={modules[key].category ?? ""}
                        options={categoryOptions}
                        onSelect={(option) =>
                          updateModule(key, {
                            category: option.value,
                            assessmentSuiteUid: undefined,
                            questionCount: "",
                          })
                        }
                      />
                    </View>
                    <View style={styles.half}>
                      <SearchableSelect
                        label="Select Question Set"
                        placeholder={
                          modules[key].category
                            ? "Select Test"
                            : "Select a category first"
                        }
                        value={modules[key].assessmentSuiteUid ?? ""}
                        options={questionSetOptionsFor(modules[key].category)}
                        onSelect={(option) => {
                          const suite = assessmentSuites.find(
                            (s) => s.assessmentSuiteUid === option.value,
                          );
                          updateModule(key, {
                            assessmentSuiteUid: option.value,
                            questionCount: suite
                              ? String(suite.noOfQuestion)
                              : "",
                          });
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.half}>
                      <View style={styles.questionsLabelRow}>
                        <AppText
                          style={styles.fieldLabel}
                          weight={FontWeight.medium}
                        >
                          Questions
                        </AppText>
                        {modules[key].assessmentSuiteUid && (
                          <View style={styles.maxBadge}>
                            <AppText
                              style={styles.maxBadgeText}
                              color={Colors.white}
                            >
                              Max:{" "}
                              {assessmentSuites.find(
                                (s) =>
                                  s.assessmentSuiteUid ===
                                  modules[key].assessmentSuiteUid,
                              )?.noOfQuestion ?? 0}
                            </AppText>
                          </View>
                        )}
                      </View>
                      <AppInput
                        placeholder="Number of questions"
                        keyboardType="number-pad"
                        value={modules[key].questionCount}
                        onChangeText={(text) =>
                          updateModule(key, { questionCount: text })
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.half}>
                      <DateTimeField
                        label="Start Time"
                        value={modules[key].startTime ?? ""}
                        mode="time"
                        onChange={(v) => updateModule(key, { startTime: v })}
                      />
                    </View>
                    <View style={styles.half}>
                      <DateTimeField
                        label="End Time"
                        value={modules[key].endTime ?? ""}
                        mode="time"
                        onChange={(v) => updateModule(key, { endTime: v })}
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <Pressable
                      style={styles.checkboxRow}
                      onPress={() =>
                        updateModule(key, { checkIn: !modules[key].checkIn })
                      }
                    >
                      <View
                        style={[
                          styles.checkbox,
                          modules[key].checkIn && styles.checkboxChecked,
                        ]}
                      >
                        {modules[key].checkIn && (
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color={Colors.white}
                          />
                        )}
                      </View>
                      <AppText style={styles.checkboxLabel}>Check-in</AppText>
                    </Pressable>
                    <View style={styles.half}>
                      <AppText
                        style={styles.fieldLabel}
                        weight={FontWeight.medium}
                      >
                        Unlock Condition
                      </AppText>
                      <AppSelect
                        selectedValue={
                          modules[key].unlockCondition ?? "Automatic"
                        }
                        onValueChange={(v) =>
                          updateModule(key, { unlockCondition: v })
                        }
                        items={UNLOCK_CONDITIONS.map((u) => ({
                          label: u,
                          value: u,
                        }))}
                      />
                    </View>
                  </View>
                </View>
              ))}
          </AppCard>

          <AppCard style={styles.card}>
            <SectionTitle index={5} title="Checklist" />
            <SearchableMultiSelect
              label="Select Required Checklists"
              placeholder="Select checklist items"
              values={checklist}
              options={CHECKLIST_OPTIONS}
              onChange={setChecklist}
            />

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setAgreeTerms((v) => !v)}
            >
              <View
                style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}
              >
                {agreeTerms && (
                  <Ionicons name="checkmark" size={12} color={Colors.white} />
                )}
              </View>
              <AppText style={styles.checkboxLabel}>
                I agree to the Terms &amp; Conditions
              </AppText>
            </Pressable>

            {notice && <AppText style={styles.notice}>{notice}</AppText>}

            <AppButton
              title="Register Training Session"
              onPress={handleSubmit}
              loading={submitting}
            />
          </AppCard>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  headerTitle: { fontSize: Fonts.h3 },
  content: { padding: 16, paddingTop: 4, gap: 14 },
  card: { padding: 16 },
  sectionTitle: { fontSize: Fonts.bodyLg, marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  field: { marginBottom: Spacing.lg },
  fieldLabel: { fontSize: Fonts.body, marginBottom: Spacing.sm },
  questionsLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.sm,
  },
  maxBadge: {
    backgroundColor: Colors.success,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  maxBadgeText: { fontSize: Fonts.overline },
  pickerField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
  },
  pickerFieldText: { fontSize: Fonts.xs },
  inlinePicker: {
    alignItems: "flex-end",
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  doneButton: { paddingVertical: 6, paddingHorizontal: 4 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  toggleLabel: { fontSize: Fonts.body, color: Colors.gray600 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.gray100,
  },
  chipActive: { backgroundColor: Colors.mainColour1 },
  chipLabel: { fontSize: Fonts.bodySm },
  emptyFlow: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 24,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.xl,
  },
  emptyFlowText: {
    fontSize: Fonts.bodySm,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  moduleCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.mainColour1,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.xl,
    padding: 14,
    marginBottom: 12,
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  moduleTitle: { fontSize: Fonts.body, flex: 1 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.mainColour1,
    borderColor: Colors.mainColour1,
  },
  checkboxLabel: { fontSize: Fonts.body },
  notice: {
    color: Colors.danger,
    fontSize: Fonts.bodySm,
    textAlign: "center",
    marginBottom: 12,
  },
});
