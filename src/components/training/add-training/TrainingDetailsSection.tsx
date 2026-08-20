import { Pressable, StyleSheet, Switch } from "react-native";

import AppCard from "@/components/ui/AppCard";
import AppInput from "@/components/ui/AppInput";
import AppText from "@/components/ui/AppText";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { Spacing } from "@/theme/spacing";
import { DateTimeField } from "./DateTimeField";
import { SectionTitle } from "./SectionTitle";
import {
  AUDIENCE_OPTIONS,
  SESSION_TYPE_OPTIONS,
  TRAINING_HUB_OPTIONS,
  TRAINING_TYPE_OPTIONS,
} from "./constants";
import { AddTrainingForm } from "./useAddTrainingForm";

export function TrainingDetailsSection({ form }: { form: AddTrainingForm }) {
  return (
    <AppCard style={styles.card}>
      <SectionTitle index={3} title="Training Details" icon="people-outline" />
      <Pressable style={styles.toggleRow} onPress={() => form.setIsResidential((v) => !v)}>
        <AppText style={styles.toggleLabel}>Is this an Residential Program ?</AppText>
        <Switch value={form.isResidential} onValueChange={form.setIsResidential} trackColor={{ true: Colors.mainColour1 }} />
      </Pressable>

      <DateTimeField label="Training Date *" value={form.conferenceDate} mode="date" onChange={form.setConferenceDate} />
      <DateTimeField label="Start Time *" value={form.conferenceTime} mode="time" onChange={form.setConferenceTime} />
      <SearchableSelect
        label="Training Hub"
        placeholder="Select Hub"
        icon="business-outline"
        value={form.trainingHub}
        options={TRAINING_HUB_OPTIONS}
        onSelect={(option) => form.setTrainingHub(option.value)}
      />
      <SearchableSelect
        label="Audience"
        placeholder="Select Audience"
        icon="school-outline"
        value={form.audience}
        options={AUDIENCE_OPTIONS}
        onSelect={(option) => form.setAudience(option.value)}
      />
      <SearchableSelect
        label="Session Type"
        placeholder="Select Session Type"
        icon="person-outline"
        value={form.sessionType}
        options={SESSION_TYPE_OPTIONS}
        onSelect={(option) => form.setSessionType(option.value)}
      />
      <SearchableSelect
        label="Training Type"
        placeholder="Select Training Type"
        icon="wifi-outline"
        value={form.trainingType}
        options={TRAINING_TYPE_OPTIONS}
        onSelect={(option) => form.setTrainingType(option.value)}
      />
      <AppInput
        label="Batch Size"
        placeholder="Enter Batch Size"
        icon="people-outline"
        keyboardType="number-pad"
        value={form.batchSize}
        onChangeText={form.setBatchSize}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  toggleLabel: { fontSize: Fonts.body, color: Colors.gray600, flex: 1, marginRight: 12 },
});
