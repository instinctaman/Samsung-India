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

export default function PendingTrainingsScreen() {
  const router = useRouter();
  const { items, loading, refreshing, refresh } = useTrainerAgendaList(true);

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
              Pending Trainings
            </AppText>
            <AppText style={styles.bannerSubtitle} color={Colors.white}>
              Awaiting admin approval
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
            <Ionicons
              name="hourglass-outline"
              size={36}
              color={Colors.gray400}
            />
            <AppText style={styles.emptyTitle} weight={FontWeight.medium}>
              No Pending Trainings
            </AppText>
            <AppText style={styles.emptySubtitle} color={Colors.gray600}>
              Everything you&apos;ve scheduled has already been reviewed by an
              admin.
            </AppText>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((item) => (
              <PendingCard
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

function PendingCard({
  item,
  onPress,
}: {
  item: TrainingAgendaItem;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.statusChip}>
          <Ionicons name="hourglass-outline" size={11} color="#B45309" />
          <AppText
            style={styles.statusChipText}
            color="#B45309"
            weight={FontWeight.bold}
          >
            PENDING
          </AppText>
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
    borderColor: "#FDE7C4",
    padding: 14,
    ...Shadows.raised,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF3E2",
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
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
