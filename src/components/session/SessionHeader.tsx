import React from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Calendar from "@/assets/images/svg/calender2.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";

const AVATAR_BY_GENDER: Record<string, ImageSourcePropType> = {
  male: require("@/assets/images/user_img/default_male.png"),
  female: require("@/assets/images/user_img/default_female.png"),
};
const DEFAULT_AVATAR: ImageSourcePropType = require("@/assets/images/Icons/face_icon.png");

type SessionHeaderProps = {
  onBack: () => void;
  onLogout?: () => void;
  onHistoryPress?: () => void;

  userName: string;
  gender?: string | null;
  profilePhoto?: string | null;
  confirmationStatus: string;

  sessionType: string;
  title: string;
  date: string;
  location: string;
};

export default function SessionHeader({
  onBack,
  onLogout,
  onHistoryPress,
  userName,
  gender,
  profilePhoto,
  confirmationStatus,
  sessionType,
  title,
  date,
  location,
}: SessionHeaderProps) {
  // profilePhoto is a local URI when set by the mock upload service.
  const avatar: ImageSourcePropType = profilePhoto
    ? { uri: profilePhoto }
    : AVATAR_BY_GENDER[gender?.toLowerCase() ?? ""] ?? DEFAULT_AVATAR;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={Colors.white}
          />
        </Pressable>

        <View style={styles.profile}>
          <Image
            source={avatar}
            style={[styles.profileAvatar, profilePhoto && styles.profileAvatarPhoto]}
          />

          <View>
            <AppText
              style={styles.userName}
              color={Colors.white}
              weight={FontWeight.medium}
            >
              {userName}
            </AppText>

            <View style={styles.confirmation}>
              <View style={styles.statusDot} />

              <AppText
                style={styles.confirmationText}
                color={Colors.white}
              >
                {confirmationStatus}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          {onHistoryPress && (
            <Pressable
              style={styles.powerButton}
              onPress={onHistoryPress}
              accessibilityLabel="Recent sessions"
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={Colors.mainColour1}
              />
            </Pressable>
          )}

          <Pressable
            style={styles.powerButton}
            onPress={onLogout}
          >
            <Ionicons
              name="power"
              size={22}
              color={Colors.mainColour1}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.sessionPill}>
        <Calendar width={Fonts.captionIcon} height={Fonts.captionIcon} color={Colors.mainColour1} />

        <AppText
          style={styles.sessionPillText}
          color={Colors.mainColour1}
        >
          {sessionType}
        </AppText>
      </View>

      <AppText
        style={styles.title}
        color={Colors.white}
        weight={FontWeight.semiBold}
      >
        {title}
      </AppText>

      <View style={styles.meta}>
        <Calendar width={Fonts.captionIcon} height={Fonts.captionIcon} color={Colors.white}/>

        <AppText
          style={styles.metaText}
          color={Colors.white}
        >
          {date}
        </AppText>

        <View style={styles.divider} />

        <Ionicons
          name="location-outline"
          size={Fonts.captionIcon}
          color={Colors.white}
        />

        <AppText
          style={styles.metaText}
          color={Colors.white}
        >
          {location}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.mainColour1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomLeftRadius: Radius.xxxl,
    borderBottomRightRadius: Radius.xxxl,
  },

  headerTop: {
    height: 37,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginRight: "auto",
    marginLeft: 10,
  },

  profileAvatar: {
    width: Fonts.iconSize,
    height: Fonts.iconSize,
  },

  profileAvatarPhoto: {
    borderRadius: Fonts.iconSize / 2,
  },

  userName: {
    fontSize: Fonts.bodyLg,
  },

  confirmation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#FACC15",
  },

  confirmationText: {
    fontSize: Fonts.caption,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  powerButton: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  sessionPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 20,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  sessionPillText: {
    fontSize: Fonts.caption,
  },

  title: {
    marginTop: 7,
    fontSize: Fonts.h2,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    color: Colors.white,
  },

  metaText: {
    fontSize: Fonts.bodySm,
  },

  divider: {
    width: 1,
    height: 15,
    backgroundColor: Colors.white,
    opacity: 0.7,
    marginHorizontal: 3,
  },
});
