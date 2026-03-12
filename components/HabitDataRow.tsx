import { Habit } from "@/store/useHabitStore";
import { StyleSheet, View } from "react-native";
import DaySlot from "./DaySlot";

const ROW_HEIGHT = 60;

interface HabitDataRowProps {
  habit: Habit;
  dates: string[];
  onDayPress?: (habitId: string, date: string, minutes: number) => void;
}

export default function HabitDataRow({
  habit,
  dates,
  onDayPress,
}: HabitDataRowProps) {
  return (
    <View style={styles.container}>
      {dates.map((date) => (
        <DaySlot
          key={date}
          habitId={habit.id}
          date={date}
          dailyTargetMinutes={habit.dailyTargetMinutes}
          onPress={onDayPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
});
