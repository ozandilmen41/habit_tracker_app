import { StyleSheet, Text, View } from "react-native";

const HEADER_HEIGHT = 70;

interface CalendarHeaderProps {
  dates: string[];
}

const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  return days[date.getDay()];
};

const getDayNumber = (dateString: string): string => {
  return dateString.split("-")[2];
};

export default function CalendarHeader({ dates }: CalendarHeaderProps) {
  return (
    <View style={styles.container}>
      {dates.map((date) => (
        <View key={date} style={styles.dateCell}>
          <Text style={styles.dayNumber}>{getDayNumber(date)}</Text>
          <Text style={styles.dayName}>{getDayName(date)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: HEADER_HEIGHT,
    backgroundColor: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    justifyContent: "center",
  },
  dateCell: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 2,
  },
  dayName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9ca3af",
  },
});
