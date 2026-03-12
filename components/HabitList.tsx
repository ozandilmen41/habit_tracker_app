import { useHabitStore } from "@/store/useHabitStore";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CalendarHeader from "./CalendarHeader";
import HabitDataRow from "./HabitDataRow";
import HabitNameCell from "./HabitNameCell";

const HEADER_HEIGHT = 70;
const ROW_HEIGHT = 60;

interface HabitListProps {
  dates: string[];
  onDayPress?: (habitId: string, date: string, minutes: number) => void;
}

export default function HabitList({ dates, onDayPress }: HabitListProps) {
  const habits = useHabitStore((state) => state.habits);

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Henüz alışkanlık yok</Text>
        <Text style={styles.emptySubtitle}>
          Başlamak için aşağıdaki sayaç butonuna basın
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <View style={styles.headerSpacer} />
        {habits.map((habit) => (
          <HabitNameCell key={habit.id} habit={habit} />
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rightColumn}
      >
        <View>
          <CalendarHeader dates={dates} />
          {habits.map((habit) => (
            <HabitDataRow
              key={habit.id}
              habit={habit}
              dates={dates}
              onDayPress={onDayPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  leftColumn: {
    width: 130,
    backgroundColor: "#1f2937",
  },
  headerSpacer: {
    height: HEADER_HEIGHT,
    backgroundColor: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  rightColumn: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
