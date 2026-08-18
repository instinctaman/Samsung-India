import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { TrainerProfile, fetchTrainerProfile, updateTrainerProfile } from "@/api/trainerProfile";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSectionKey, PROFILE_SECTION_FIELDS } from "./types";

const EMPTY_EDITING: Record<ProfileSectionKey, boolean> = {
  personal: false,
  address: false,
  documents: false,
  social: false,
  official: false,
  security: false,
};

export function useTrainerProfileForm() {
  const { adminToken } = useAuth();
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(EMPTY_EDITING);
  const [savingSection, setSavingSection] = useState<ProfileSectionKey | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      setProfile(await fetchTrainerProfile(adminToken));
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const setField = <K extends keyof TrainerProfile>(key: K, value: TrainerProfile[K]) => {
    setProfile((current) => (current ? { ...current, [key]: value } : current));
  };

  const toggleEdit = (section: ProfileSectionKey) => {
    setEditing((current) => ({ ...current, [section]: !current[section] }));
  };

  const saveSection = async (section: ProfileSectionKey) => {
    if (!adminToken || !profile) return;
    setSavingSection(section);
    setNotice(null);
    try {
      const keys = PROFILE_SECTION_FIELDS[section] as (keyof TrainerProfile)[];
      const payload: Partial<TrainerProfile> = {};
      keys.forEach((key) => {
        (payload as Record<string, unknown>)[key] = profile[key];
      });
      const updated = await updateTrainerProfile(adminToken, payload);
      setProfile(updated);
      setEditing((current) => ({ ...current, [section]: false }));
    } catch {
      setNotice("Couldn't save your changes. Please try again.");
    } finally {
      setSavingSection(null);
    }
  };

  return { profile, loading, editing, savingSection, notice, setField, toggleEdit, saveSection };
}

export type TrainerProfileForm = ReturnType<typeof useTrainerProfileForm>;
