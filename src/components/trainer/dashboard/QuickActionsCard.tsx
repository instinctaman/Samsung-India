import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";

type QuickActionsCardProps = {
  onCreateTraining: () => void;
  onTrainingList: () => void;
  onViewReports: () => void;
  onAddTrainee: () => void;
};

export default function QuickActionsCard({
  onCreateTraining,
  onTrainingList,
  onViewReports,
  onAddTrainee,
}: QuickActionsCardProps) {
  const actions = [
    {
      title: "Create New Training",
      iconName: "add-circle" as const,
      color: "#0066FF",
      bg: "#EFF6FF",
      onPress: onCreateTraining,
    },
    {
      title: "Training List",
      iconName: "clipboard" as const,
      color: "#10B981",
      bg: "#ECFDF5",
      onPress: onTrainingList,
    },
    {
      title: "View Reports",
      iconName: "document-text" as const,
      color: "#F59E0B",
      bg: "#FFFBEB",
      onPress: onViewReports,
    },
    {
      title: "Add New Trainee",
      iconName: "people" as const,
      color: "#8B5CF6",
      bg: "#F5F3FF",
      onPress: onAddTrainee,
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Quick Actions</Text>

      <View style={styles.actionsList}>
        {actions.map((action) => (
          <Pressable
            key={action.title}
            style={[styles.actionRow, { backgroundColor: action.bg }]}
            onPress={action.onPress}
          >
            <View style={styles.leftContent}>
              <Ionicons
                name={action.iconName}
                size={16}
                color={action.color}
              />
              <Text style={styles.actionText}>{action.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={12}
              color={action.color}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 12,
    ...Shadows.card,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  actionsList: {
    gap: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "#1F2937",
  },
});
