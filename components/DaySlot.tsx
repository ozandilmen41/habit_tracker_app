import { useHabitStore } from "@/store/useHabitStore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DaySlotProps {
  habitId: string;
  date: string;
  dailyTargetMinutes: number;
  onPress?: (habitId: string, date: string, minutes: number) => void;
}

export default function DaySlot({
  habitId,
  date,
  dailyTargetMinutes,
  onPress,
}: DaySlotProps) {
  const logs = useHabitStore((state) => state.logs);

  // O(1) lookup - ASLA filter/find kullanma!
  const minutes = logs[habitId]?.[date] || 0;

  // Durum tespiti
  const hasActivity = minutes > 0;
  const isCompleted = minutes >= dailyTargetMinutes;

  const handlePress = () => {
    if (onPress) {
      onPress(habitId, date, minutes);
    }
  };

  // Yapılmadı: Açık gri çarpı
  if (!hasActivity) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.emptyMark}>×</Text>
      </TouchableOpacity>
    );
  }

  // Yapıldı: Mavi/Yeşil daire + süre
  const circleColor = isCompleted ? "#22c55e" : "#3b82f6";
  const backgroundColor = isCompleted ? "#22c55e" : "#fff";
  const textColor = isCompleted ? "#fff" : "#3b82f6";

  // Format: Tam sayıysa ondalık gösterme (60.0 → 60)
  const displayMinutes =
    minutes % 1 === 0 ? minutes.toFixed(0) : minutes.toFixed(1);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.circle,
          {
            borderColor: circleColor,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        <Text style={[styles.hoursText, { color: textColor }]}>
          {displayMinutes}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  hoursText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emptyMark: {
    fontSize: 18,
    color: "#e5e7eb",
    fontWeight: "300",
  },
});
