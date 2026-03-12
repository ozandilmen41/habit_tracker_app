import { Habit, useHabitStore } from "@/store/useHabitStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CircularProgress from "./CircularProgress";

const ROW_HEIGHT = 60;

interface HabitNameCellProps {
  habit: Habit;
}

export default function HabitNameCell({ habit }: HabitNameCellProps) {
  const router = useRouter();
  const logs = useHabitStore((state) => state.logs);

  const handlePress = () => {
    router.push(`/habit/${habit.id}`);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayMinutes = logs[habit.id]?.[today] || 0;
  const targetMinutes = habit.dailyTargetMinutes;
  const rawProgress = targetMinutes > 0 ? todayMinutes / targetMinutes : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <CircularProgress progress={rawProgress} size={32} strokeWidth={3} />

      <View style={styles.textContainer}>
        <Text style={styles.habitName} numberOfLines={2} ellipsizeMode="tail">
          {habit.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 130,
    height: ROW_HEIGHT,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    backgroundColor: "#1f2937",
  },
  textContainer: {
    marginLeft: 6,
    flex: 1,
  },
  habitName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f9fafb",
    flexShrink: 1,
  },
});
