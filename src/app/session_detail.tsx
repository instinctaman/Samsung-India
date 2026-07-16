import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import AccountCircle from "@/assets/images/svg/account_circle.svg";
import Alarm from "@/assets/images/svg/alarm.svg";
import Calendar from "@/assets/images/svg/calender.svg";
import GoogleDocs from "@/assets/images/svg/google-docs 1.svg";
import Loading from "@/assets/images/svg/loading.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

type SessionItem = {
  time: string;
  endTime: string;
  type: string;
  duration: string;
  status: "LIVE NOW" | "Upcoming";
  icon: keyof typeof Ionicons.glyphMap | ComponentType<SvgProps>;
};

const sessions: SessionItem[] = [
  { time: "09:00", endTime: "10:00", type: "ATTENDANCE", duration: "1h", status: "LIVE NOW", icon: AccountCircle },
  { time: "10:00", endTime: "12:00", type: "QUIZ", duration: "2h", status: "Upcoming", icon: Alarm },
  { time: "12:00", endTime: "14:00", type: "POST TEST", duration: "2h", status: "Upcoming", icon: GoogleDocs },
  { time: "14:00", endTime: "16:00", type: "POST TEST", duration: "2h", status: "Upcoming", icon: GoogleDocs },
];

export default function SessionDetailScreen() {
  const router = useRouter();
  const { attendance } = useLocalSearchParams<{ attendance?: string }>();
  const attendanceRecorded = attendance === "recorded";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </Pressable>
          <View style={styles.profile}>
            <Image source={require("@/assets/images/Icons/face_icon.png")} style={styles.profileAvatar} />
            <View>
              <AppText style={styles.userName} color={Colors.white} weight={FontWeight.medium}>Anshu Pandey</AppText>
              <View style={styles.confirmation}>
                <View style={styles.statusDot} />
                <AppText style={styles.confirmationText} color={Colors.white}>Not Confirmed</AppText>
              </View>
            </View>
          </View>
          <Pressable style={styles.powerButton} accessibilityLabel="Log out">
            <Ionicons name="power" size={22} color={Colors.mainColour1} />
          </Pressable>
        </View>
        <View style={styles.sessionPill}>
          <Calendar width={11} height={11} />
          <AppText style={styles.sessionPillText} color={Colors.mainColour1}>One-Day Session</AppText>
        </View>
        <AppText style={styles.title} color={Colors.white} weight={FontWeight.semiBold}>Training Session</AppText>
        <View style={styles.meta}>
          <Calendar width={14} height={14} />
          <AppText style={styles.metaText} color={Colors.white}>06 Jun 2026</AppText>
          <View style={styles.divider} />
          <Ionicons name="location-outline" size={14} color={Colors.white} />
          <AppText style={styles.metaText} color={Colors.white}>New Delhi</AppText>
        </View>

      </View>


      <View style={styles.body}>

        <ScrollView contentContainerStyle={styles.timeline} showsVerticalScrollIndicator={false}>

          {sessions.map((session, index) => (
            <TimelineItem
              key={`${session.time}-${session.type}`}
              session={session}
              isAttendanceLive={!attendanceRecorded && index === 0}
              isAttendanceRecorded={attendanceRecorded && index === 0}
              isQuizLive={attendanceRecorded && index === 1}
              onMarkAttendance={() => router.push("/attendance")}
              onEnterQuiz={() => router.push("/wait")}
            />
          ))}
          <View style={styles.updateNotice}>
            <View style={styles.noticeIcon}>
              <Ionicons name="notifications-outline" size={16} color={Colors.mainColour1} />
            </View>
            <View style={styles.noticeCopy}>
              <AppText style={styles.noticeTitle} weight={FontWeight.medium}>Stay Updated</AppText>
              <AppText style={styles.noticeText}>We'll notify you when the next session is ready.</AppText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray600} />
          </View>
        </ScrollView>

      </View>

      <View style={styles.bottomArea}>
        <View style={styles.navBar}>
          <NavItem icon="calendar-outline" label="Plan" active />
          <Pressable style={styles.centerAction} accessibilityLabel="Open session calendar">
            <Calendar width={31} height={31} />
          </Pressable>
          <NavItem label="Profile" svgIcon={<AccountCircle width={23} height={23} />} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function TimelineItem({
  session,
  isAttendanceLive,
  isAttendanceRecorded,
  isQuizLive,
  onMarkAttendance,
  onEnterQuiz,
}: {
  session: SessionItem;
  isAttendanceLive: boolean;
  isAttendanceRecorded: boolean;
  isQuizLive: boolean;
  onMarkAttendance: () => void;
  onEnterQuiz: () => void;
}) {
  const indicatorColor = isAttendanceLive || isAttendanceRecorded ? Colors.success : Colors.primary;
  const statusLabel = isAttendanceRecorded ? "Present" : isQuizLive || isAttendanceLive ? "LIVE NOW" : session.status;
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timeColumn}>
        <AppText style={styles.time} weight={FontWeight.semiBold}>{session.time}</AppText>
        <AppText style={styles.endTime}>{session.endTime}</AppText>
      </View>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: indicatorColor }]} />{!isAttendanceLive && !isAttendanceRecorded && !isQuizLive && <View style={styles.railLine} />}</View>
      <View style={styles.activityCard}>
        <View style={styles.cardHeader}>
          <View style={styles.type}>
            <SessionTypeIcon session={session} />
            <AppText style={styles.typeText} color={Colors.primary}>{session.type}</AppText>
          </View>
          <View style={[styles.status, (isAttendanceLive || isQuizLive) && styles.liveStatus, isAttendanceRecorded && styles.presentStatus]}>
            {isAttendanceRecorded && <Ionicons name="checkmark-circle" size={10} color={Colors.success} />}
            <AppText style={[styles.statusText, (isAttendanceLive || isQuizLive) && styles.liveStatusText, isAttendanceRecorded && styles.presentStatusText]}>{statusLabel}</AppText>
          </View>
        </View>
        <AppText style={styles.activityTitle} weight={FontWeight.semiBold}>Session Activity</AppText>
        <AppText style={styles.duration}>{session.duration}</AppText>
        {isAttendanceRecorded ? <>
          <View style={styles.presenceLine}><View style={styles.presentDot} /><AppText style={styles.presentTime} color={Colors.success}>Present (10:25)</AppText></View>
          <View style={styles.recorded}><Ionicons name="checkmark-circle" size={18} color={Colors.success} /><View><AppText style={styles.recordedTitle} color={Colors.success} weight={FontWeight.medium}>Recorded</AppText><AppText style={styles.recordedText} color={Colors.success}>Good Job!</AppText></View></View>
        </> : isAttendanceLive ? <Pressable style={styles.attendanceButton} onPress={onMarkAttendance}>
          <AppText style={styles.attendanceText} color={Colors.white} weight={FontWeight.medium}>Mark Attendance</AppText>
        </Pressable> : isQuizLive ? <Pressable style={styles.enterButton} onPress={onEnterQuiz}>
          <AppText style={styles.attendanceText} color={Colors.white} weight={FontWeight.medium}>Enter Session</AppText>
        </Pressable> : <View style={styles.waiting}>
          <Loading width={17} height={17} />
          <View>
            <AppText style={styles.waitingTitle} color={Colors.primary} weight={FontWeight.medium}>Please Wait</AppText>
            <AppText style={styles.waitingText} color={Colors.primary}>Trainer will unlock soon...</AppText>
          </View>
        </View>}
      </View>
    </View>
  );
}

function SessionTypeIcon({ session }: { session: SessionItem }) {
  if (session.type === "POST TEST") return <GoogleDocs width={12} height={12} />;
  if (typeof session.icon !== "string") {
    const SvgIcon = session.icon;
    return <SvgIcon width={12} height={12} />;
  }
  return <Ionicons name={session.icon} size={12} color={Colors.primary} />;
}

function NavItem({ icon, label, active = false, svgIcon }: { icon?: keyof typeof Ionicons.glyphMap; label: string; active?: boolean; svgIcon?: React.ReactNode }) {
  return <View style={styles.navItem}>{svgIcon ?? <Ionicons name={icon!} size={23} color={active ? Colors.mainColour1 : Colors.gray600} />}<AppText style={[styles.navLabel, active && styles.navLabelActive]}>{label}</AppText>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.mainColour1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomLeftRadius: Fonts.h3,
    borderBottomRightRadius: Fonts.h3
  },
  headerTop: {
    height: 37,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginRight: "auto",
    marginLeft: 10
  },
  profileAvatar: { width: 33, height: 33 },
  userName: { fontSize: Fonts.bodyLg },
  confirmation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#FACC15"
  },
  confirmationText: { fontSize: Fonts.caption },
  powerButton: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  sessionPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 13,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  sessionPillText: { fontSize: Fonts.caption },
  title: {
    marginTop: 7,
    fontSize: Fonts.h2
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10
  },
  metaText: { fontSize: Fonts.bodySm },
  divider: {
    height: 15,
    width: 1,
    backgroundColor: Colors.white,
    opacity: 0.7,
    marginHorizontal: 3
  },
  body: {
    flex: 1,
    minHeight: 0
  },
  timeline: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 10
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 98
  },
  timeColumn: {
    width: 38,
    alignItems: "flex-end",
    paddingTop: 3
  },
  time: { fontSize: Fonts.bodySm },
  endTime: {
    fontSize: Fonts.caption,
    color: Colors.gray600,
    marginTop: 2
  },
  rail: {
    width: 24,
    alignItems: "center",
    paddingTop: 6
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 1
  },
  railLine: {
    position: "absolute",
    top: 14,
    bottom: -13,
    width: 2,
    backgroundColor: Colors.gray200
  },
  activityCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 9,
    borderRadius: 6,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0
      , height: 2
    },
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  type: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  typeText: { fontSize: Fonts.caption },
  status: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1
  },
  liveStatus: {
    borderColor: Colors.success,
    backgroundColor: Colors.success
  },
  statusText: {
    fontSize: Fonts.overline,
    color: Colors.primary
  },
  liveStatusText: { color: Colors.white },
  presentStatus: { borderColor: Colors.success, flexDirection: "row", alignItems: "center", gap: 3 },
  presentStatusText: { color: Colors.success },
  activityTitle: {
    fontSize: Fonts.body,
    marginTop: 7
  },
  duration: {
    alignSelf: "flex-start",
    fontSize: Fonts.caption,
    backgroundColor: Colors.gray100,
    color: Colors.gray600,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: 8
  },
  attendanceButton: {
    backgroundColor: Colors.success,
    height: 25,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7
  },
  attendanceText: { fontSize: Fonts.body },
  enterButton: { backgroundColor: Colors.mainColour1, height: 25, borderRadius: 4, alignItems: "center", justifyContent: "center", marginTop: 7 },
  presenceLine: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 7 },
  presentDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  presentTime: { fontSize: Fonts.caption },
  recorded: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#D8F8EB", borderRadius: 4, paddingHorizontal: 8, paddingVertical: 5, marginTop: 7 },
  recordedTitle: { fontSize: Fonts.caption },
  recordedText: { fontSize: Fonts.overline },
  waiting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#DDEEFF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 7
  },
  waitingTitle: { fontSize: Fonts.caption },
  waitingText: { fontSize: Fonts.overline },
  bottomArea: {
    backgroundColor: Colors.white,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 50,
    paddingLeft: 50,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0
      , height: -2
    },
    shadowRadius: 5,
    elevation: 7
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 33
  },
  navItem: {
    width: 42,
    alignItems: "center",
    gap: 3
  },
  navLabel: {
    fontSize: Fonts.caption,
    color: Colors.gray600
  },
  navLabelActive: { color: Colors.mainColour1 },
  centerAction: {
    position: "absolute",
    alignSelf: "center",
    left: "50%",
    marginLeft: -29,
    top: -25,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.mainColour1,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0
      , height: 3
    },
    shadowRadius: 5,
    elevation: 5
  },
  updateNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DDEEFF",
    // marginHorizontal: 18,
    // marginBottom: 11,
    marginTop: 12,
    borderRadius: 5,
    padding: 9,
    gap: 8
  },
  noticeIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#CBE5FF",
    alignItems: "center",
    justifyContent: "center"
  },
  noticeCopy: { flex: 1 },
  noticeTitle: { fontSize: Fonts.caption },
  noticeText: {
    fontSize: Fonts.overline,
    color: Colors.gray600,
    marginTop: 1
  },
});
