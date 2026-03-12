import { Habit } from "@/store/useHabitStore";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DaySlot from "./DaySlot";

interface HabitRowProps {
  habit: Habit;
  dates: string[];
}

export default function HabitRow({ habit, dates }: HabitRowProps) {
  const handlePress = () => {
    console.log("Detaya gidilecek:", habit.name);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.leftColumn}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.habitName} numberOfLines={2}>
          {habit.name}
        </Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.slotsContainer}>
          {dates.map((date) => (
            <DaySlot key={date} habitId={habit.id} date={date} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  leftColumn: {
    width: 100,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  habitName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  scrollView: {
    flex: 1,
  },
  slotsContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingRight: 16,
  },
});
