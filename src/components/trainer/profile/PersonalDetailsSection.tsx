import AppInput from "@/components/ui/AppInput";
import { TrainerProfileForm } from "./useTrainerProfileForm";
import { ProfileSection } from "./ProfileSection";

export function PersonalDetailsSection({ form }: { form: TrainerProfileForm }) {
  const { profile, editing, savingSection, setField, toggleEdit, saveSection } = form;
  if (!profile) return null;
  const isEditing = editing.personal;

  return (
    <ProfileSection
      icon="person-outline"
      title="Personal Details"
      editing={isEditing}
      saving={savingSection === "personal"}
      onToggleEdit={() => (isEditing ? saveSection("personal") : toggleEdit("personal"))}
    >
      <AppInput
        label="Name *"
        value={profile.name}
        editable={isEditing}
        onChangeText={(v) => setField("name", v)}
      />
      <AppInput
        label="Email *"
        value={profile.email}
        editable={isEditing}
        onChangeText={(v) => setField("email", v)}
      />
      <AppInput
        label="Mobile Number *"
        value={profile.mobileNumber}
        editable={isEditing}
        keyboardType="phone-pad"
        onChangeText={(v) => setField("mobileNumber", v)}
      />
      <AppInput
        label="Alt Phone"
        value={profile.altPhone}
        editable={isEditing}
        keyboardType="phone-pad"
        onChangeText={(v) => setField("altPhone", v)}
      />
      <AppInput
        label="Gender"
        value={profile.gender}
        editable={isEditing}
        onChangeText={(v) => setField("gender", v)}
      />
      <AppInput
        label="Date Of Birth"
        value={profile.dob}
        editable={isEditing}
        onChangeText={(v) => setField("dob", v)}
      />
    </ProfileSection>
  );
}
