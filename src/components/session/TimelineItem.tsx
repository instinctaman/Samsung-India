import type { ComponentType } from "react";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import SessionButton from "./SessionButton";
import SessionStatusBadge from "./SessionStatusBadge";
import SessionTypeIcon from "./SessionTypeIcon";
import WaitingCard from "./WaitingCard";
import RecordedCard from "./RecordedCard";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import type { SessionModuleKey } from "@/api/session";

import type { SvgProps } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

export type SessionItem = {
    key: SessionModuleKey;
    time: string;
    endTime: string;
    duration: string;
    type: string;
    isLive: boolean;
    isCompleted: boolean;
    isMissed: boolean;
    completedAt: string | null;
    score: string | null;
    icon: keyof typeof Ionicons.glyphMap | ComponentType<SvgProps>;
    iconColor: string;
    geoFencing?: boolean;
};

type Props = {
    session: SessionItem;
    onMarkAttendance: () => void;
    onEnterQuiz: () => void;
    onEnterPostTest: () => void;
    onEnterSurvey: () => void;
};

export default function TimelineItem({
    session,
    onMarkAttendance,
    onEnterQuiz,
    onEnterPostTest,
    onEnterSurvey,
}: Props) {
    const { key, isLive, isCompleted, isMissed } = session;
    const isAttendance = key === "ATTENDANCE";
    const indicatorColor = isCompleted
        ? Colors.success
        : isMissed
            ? Colors.danger
            : Colors.primary;
    const statusLabel = isCompleted
        ? isAttendance
            ? "Present"
            : session.score
                ? `Score: ${session.score}`
                : "Completed"
        : isMissed
            ? "Missed"
            : isLive
                ? "LIVE NOW"
                : session.time
                    ? "Upcoming"
                    : "Please Wait";
    const handleEnter = key === "LIVE_QUIZ" ? onEnterQuiz : key === "SURVEY" ? onEnterSurvey : onEnterPostTest;

    return (
        <View style={styles.timelineRow}>
            <View style={styles.timeColumn}>
                <AppText
                    style={styles.time}
                    weight={FontWeight.semiBold}
                >
                    {session.time}
                </AppText>
                <AppText style={styles.endTime}>
                    {session.endTime}
                </AppText>
            </View>
            <View style={styles.rail}>
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor: indicatorColor,
                        },
                    ]}
                />
                {!isLive && !isCompleted && (
                    <View style={styles.railLine} />
                )}
            </View>
            <View style={styles.activityCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.type}>
                        <SessionTypeIcon icon={session.icon}
                            color={session.iconColor} />
                        <AppText
                            style={styles.typeText}
                            color={Colors.primary}
                        >
                            {session.type}
                        </AppText>
                    </View>
                    <SessionStatusBadge
                        label={statusLabel}
                        live={isLive}
                        completed={isCompleted}
                        missed={isMissed}
                    />
                </View>
                <AppText
                    style={styles.activityTitle}
                    weight={FontWeight.semiBold}
                >
                    Session Activity
                </AppText>
                <AppText style={styles.duration}>
                    {session.duration}
                </AppText>
                {isCompleted && isAttendance ? (
                    <>
                        <View style={styles.presenceLine}>
                            <View style={styles.presentDot} />
                            <AppText
                                style={styles.presentTime}
                                color={Colors.success}
                            >
                                {session.completedAt ? `Present (${session.completedAt})` : "Present"}
                            </AppText>
                        </View>
                        <RecordedCard
                            title="Recorded"
                            subtitle="Good Job!"
                            color={Colors.success}
                        />
                    </>
                ) : isCompleted ? (
                    <RecordedCard
                        title="Completed"
                        subtitle="Good Job!"
                        color={Colors.primary}
                        backgroundColor="#DDEEFF"
                    />
                ) : isLive && isAttendance ? (
                    <SessionButton
                        title={session.geoFencing ? "Secure Check-In" : "Mark Attendance"}
                        icon={session.geoFencing ? "camera" : undefined}
                        onPress={onMarkAttendance}
                        backgroundColor={Colors.success}
                    />
                ) : isLive ? (
                    <SessionButton
                        title="Enter Session"
                        onPress={handleEnter}
                        backgroundColor={Colors.mainColour1}
                    />
                ) : isMissed ? (
                    <MissedCard />
                ) : (
                    <WaitingCard />
                )}
            </View>
        </View>
    );
}

function MissedCard() {
    return (
        <View style={styles.missedContainer}>
            <Ionicons name="close-circle" size={17} color={Colors.danger} />
            <View>
                <AppText style={styles.missedTitle} color={Colors.danger} weight={FontWeight.medium}>
                    Missed
                </AppText>
                <AppText style={styles.missedSubtitle} color={Colors.danger}>
                    You missed this session, try next time.
                </AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    timelineRow: {
        flexDirection: "row",
        minHeight: 98,
    },
    timeColumn: {
        alignItems: "flex-end",
        paddingTop: 3,
    },
    time: {
        fontSize: Fonts.body,
    },
    endTime: {
        fontSize: Fonts.bodySm,
        color: Colors.gray600,
        marginTop: 2,
    },
    rail: {
        width: 24,
        alignItems: "center",
        paddingTop: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        zIndex: 1,
    },
    railLine: {
        position: "absolute",
        top: 14,
        bottom: -13,
        width: 2,
        backgroundColor: Colors.gray200,
    },
    activityCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 9,
        borderRadius: 6,
        shadowColor: Colors.black,
        shadowOpacity: 0.08,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    type: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    typeText: {
        fontSize: Fonts.bodySm,
    },
    activityTitle: {
        marginTop: 7,
        fontSize: Fonts.body,
    },
    duration: {
        marginTop: 8,
        alignSelf: "flex-start",
        backgroundColor: Colors.gray100,
        color: Colors.gray600,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3,
        fontSize: Fonts.bodySm,
    },
    presenceLine: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 7,
    },
    presentDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.success,
    },
    presentTime: {
        fontSize: Fonts.bodySm,
    },
    missedContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        backgroundColor: "#FEE2E2",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginTop: 7,
    },
    missedTitle: {
        fontSize: Fonts.caption,
    },
    missedSubtitle: {
        fontSize: Fonts.overline,
    },
});
