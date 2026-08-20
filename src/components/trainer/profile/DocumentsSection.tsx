import { Alert, Pressable, StyleSheet, View } from "react-native";

import AppInput from "@/components/ui/AppInput";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { TrainerProfileForm } from "./useTrainerProfileForm";
import { ProfileSection } from "./ProfileSection";

function FileFieldLabel({ label }: { label: string }) {
  return (
    <View style={styles.labelRow}>
      <AppText style={styles.label} color={Colors.black}>{label}</AppText>
      <Pressable onPress={() => Alert.alert("No file uploaded yet", "This trainee hasn't uploaded a file for this field.")}>
        <AppText style={styles.viewExisting} color={Colors.mainColour1}>(View Existing)</AppText>
      </Pressable>
    </View>
  );
}

export function DocumentsSection({ form }: { form: TrainerProfileForm }) {
  const { profile, editing, savingSection, setField, toggleEdit, saveSection } = form;
  if (!profile) return null;
  const isEditing = editing.documents;

  return (
    <ProfileSection
      icon="document-text-outline"
      title="Documents"
      editing={isEditing}
      saving={savingSection === "documents"}
      onToggleEdit={() => (isEditing ? saveSection("documents") : toggleEdit("documents"))}
    >
      <AppInput
        label="Aadhar Number"
        placeholder="Enter 12 Digit Aadhar Number"
        value={profile.aadharNumber}
        editable={isEditing}
        keyboardType="number-pad"
        onChangeText={(v) => setField("aadharNumber", v)}
      />
      <FileFieldLabel label="Aadhar (File)" />
      <AppInput value={profile.aadharFile} editable={isEditing} onChangeText={(v) => setField("aadharFile", v)} />
      <FileFieldLabel label="Profile Picture" />
      <AppInput
        value={profile.profilePicture}
        editable={isEditing}
        onChangeText={(v) => setField("profilePicture", v)}
      />
      <AppInput
        label="About"
        value={profile.about}
        editable={isEditing}
        multiline
        numberOfLines={3}
        onChangeText={(v) => setField("about", v)}
      />
      <FileFieldLabel label="Resume" />
      <AppInput value={profile.resume} editable={isEditing} onChangeText={(v) => setField("resume", v)} />
      <FileFieldLabel label="Other Document" />
      <AppInput
        value={profile.otherDocument}
        editable={isEditing}
        onChangeText={(v) => setField("otherDocument", v)}
      />
    </ProfileSection>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  label: { fontSize: Fonts.body },
  viewExisting: { fontSize: Fonts.bodySm },
});
