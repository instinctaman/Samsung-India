import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

import { STATES } from "@/data/states";

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const DEFAULT_AVATAR: ImageSourcePropType = require("@/assets/images/user_img/default_male.png");

export type DetailItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

export function locationLabel(state: string | null, district: string | null) {
  const stateEntry = STATES.find((item) => item.value === state);
  const districtEntry = stateEntry?.cities.find((city) => city.value === district);
  const parts = [districtEntry?.label, stateEntry?.label].filter(Boolean);
  return parts.length ? parts.join(", ") : "--";
}
