import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AppText from "@/components/ui/AppText";
import ScreenBanner from "@/components/ui/ScreenBanner";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { TrainingAgendaItem } from "@/api/training";
import { useTrainerAgendaList } from "@/hooks/useTrainerAgendaList";

const CONFERENCE_STATUS_PRESENTATION: Record<
  string,
  { label: string; color: string; background: string }
> = {
  Scheduled: {
    label: "UPCOMING",
    color: Colors.mainColour1,
    background: "#E3ECFF",
  },
  Ongoing: { label: "LIVE NOW", color: Colors.danger, background: "#FCE4E4" },
  Completed: {
    label: "COMPLETED",
    color: Colors.gray600,
    background: Colors.gray100,
  },
};

const APPROVAL_STATUS_PRESENTATION: Record<
  string,
  {
    label: string;
    color: string;
    background: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  Pending: {
    label: "PENDING",
    color: "#B45309",
    background: "#FEF3E2",
    icon: "hourglass-outline",
  },
  Approved: {
    label: "APPROVED",
    color: Colors.success,
    background: "#DCFCE7",
    icon: "checkmark-circle-outline",
  },
  Rejected: {
    label: "REJECTED",
    color: Colors.danger,
    background: "#FCE4E4",
    icon: "close-circle-outline",
  },
};

export default function TrainingListScreen() {
  const router = useRouter();
  const { items, loading, refreshing, refresh } = useTrainerAgendaList(false);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScreenBanner backgroundColor={Colors.mainColour1}>
        <View style={styles.bannerRow}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </Pressable>
          <View>
            <AppText
              style={styles.bannerTitle}
              color={Colors.white}
              weight={FontWeight.semiBold}
            >
              Training List
            </AppText>
            <AppText style={styles.bannerSubtitle} color={Colors.white}>
              All your sessions, with or without approval
            </AppText>
          </View>
        </View>
      </ScreenBanner>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[Colors.mainColour1]}
            tintColor={Colors.mainColour1}
          />
        }
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.mainColour1} />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="layers-outline" size={36} color={Colors.gray400} />
            <AppText style={styles.emptyTitle} weight={FontWeight.medium}>
              No Trainings Yet
            </AppText>
            <AppText style={styles.emptySubtitle} color={Colors.gray600}>
              Sessions you create will show up here, approved or not.
            </AppText>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((item) => (
              <TrainingCard
                key={item.conferenceUid}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/session_dashboard",
                    params: { conferenceUid: item.conferenceUid },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TrainingCard({
  item,
  onPress,
}: {
  item: TrainingAgendaItem;
  onPress: () => void;
}) {
  const conferencePresentation = CONFERENCE_STATUS_PRESENTATION[
    item.conferenceStatus
  ] ?? {
    label: item.conferenceStatus,
    color: Colors.gray600,
    background: Colors.gray100,
  };
  const approvalPresentation = APPROVAL_STATUS_PRESENTATION[
    item.approvalStatus
  ] ?? {
    label: item.approvalStatus,
    color: Colors.gray600,
    background: Colors.gray100,
    icon: "ellipse-outline" as const,
  };

  return (
    <Pressable
      style={[styles.card, { borderColor: conferencePresentation.color }]}
      onPress={onPress}
    >
      <View style={styles.cardHeaderRow}>
        <View style={styles.chipRow}>
          <View
            style={[
              styles.statusChip,
              { backgroundColor: conferencePresentation.background },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: conferencePresentation.color },
              ]}
            />
            <AppText
              style={[
                styles.statusChipText,
                { color: conferencePresentation.color },
              ]}
              weight={FontWeight.bold}
            >
              {conferencePresentation.label}
            </AppText>
          </View>
          <View
            style={[
              styles.statusChip,
              { backgroundColor: approvalPresentation.background },
            ]}
          >
            <Ionicons
              name={approvalPresentation.icon}
              size={11}
              color={approvalPresentation.color}
            />
            <AppText
              style={[
                styles.statusChipText,
                { color: approvalPresentation.color },
              ]}
              weight={FontWeight.bold}
            >
              {approvalPresentation.label}
            </AppText>
          </View>
        </View>
        <View style={styles.codeRow}>
          <Ionicons
            name="finger-print-outline"
            size={13}
            color={Colors.gray400}
          />
          <AppText style={styles.codeText} color={Colors.gray600}>
            {item.conferenceUid.slice(0, 10).toUpperCase()}
          </AppText>
        </View>
      </View>

      <AppText style={styles.cardTitle} weight={FontWeight.bold}>
        {item.title}
      </AppText>

      <View style={styles.metaGrid}>
        <MetaItem
          icon="calendar-outline"
          label="Date"
          value={item.conferenceDate ?? "--"}
        />
        <MetaItem
          icon="time-outline"
          label="Time"
          value={item.conferenceTime ?? "--"}
        />
        <MetaItem
          icon="school-outline"
          label="Type"
          value={item.trainingType ?? "--"}
        />
        <MetaItem
          icon="location-outline"
          label="State"
          value={item.state ?? "--"}
        />
        <MetaItem
          icon="business-outline"
          label="Hub"
          value={item.trainingHub ?? "Not Assigned"}
        />
        <MetaItem
          icon="people-outline"
          label="Batch"
          value={item.batchSize ?? "--"}
        />
      </View>
    </Pressable>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color={Colors.mainColour1} />
      <View style={styles.metaTextWrap}>
        <AppText style={styles.metaLabel} color={Colors.gray600}>
          {label}
        </AppText>
        <AppText
          style={styles.metaValue}
          weight={FontWeight.medium}
          numberOfLines={1}
        >
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  bannerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bannerTitle: { fontSize: Fonts.h3 },
  bannerSubtitle: { fontSize: Fonts.overline, marginTop: 2, opacity: 0.9 },

  content: { padding: 16, flexGrow: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 60,
  },
  emptyTitle: { fontSize: Fonts.body, marginTop: 4 },
  emptySubtitle: {
    fontSize: Fonts.bodySm,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },

  list: { gap: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    borderWidth: 1.5,
    padding: 14,
    ...Shadows.raised,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6,
  },
  chipRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusChipText: { fontSize: Fonts.overline, letterSpacing: 0.3 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  codeText: { fontSize: Fonts.overline },

  cardTitle: { marginTop: 10, fontSize: Fonts.body },

  metaGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "46%",
  },
  metaTextWrap: { flex: 1 },
  metaLabel: { fontSize: Fonts.overline },
  metaValue: { fontSize: Fonts.overline, marginTop: 1 },
});
