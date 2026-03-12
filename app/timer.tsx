import { useHabitStore } from "@/store/useHabitStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatMsToHHMMSS = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export default function TimerPage() {
  const router = useRouter();
  const [displayTime, setDisplayTime] = useState("00:00:00");

  const activeSession = useHabitStore((state) => state.activeSession);
  const habits = useHabitStore((state) => state.habits);
  const pauseSession = useHabitStore((state) => state.pauseSession);
  const resumeSession = useHabitStore((state) => state.resumeSession);
  const finishSession = useHabitStore((state) => state.finishSession);
  const getCurrentDuration = useHabitStore((state) => state.getCurrentDuration);

  useEffect(() => {
    if (!activeSession) {
      router.replace("/(tabs)");
      return;
    }

    const interval = setInterval(() => {
      const currentMs = getCurrentDuration();
      const formatted = formatMsToHHMMSS(currentMs);
      setDisplayTime(formatted);
    }, 100);

    return () => clearInterval(interval);
  }, [activeSession?.status]);

  if (!activeSession) {
    return null;
  }

  const currentHabit = habits.find((h) => h.id === activeSession.habitId);
  const isPaused = activeSession.status === "paused";

  const handlePauseResume = () => {
    if (isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  };

  const handleFinish = () => {
    finishSession();
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.timerContainer}>
        <Text style={styles.habitName}>
          {currentHabit?.name || "Alışkanlık"}
        </Text>
        <Text style={styles.timerDisplay}>{displayTime}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePauseResume}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isPaused ? "Devam Et" : "Mola"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Bitir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  habitName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 32,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: "300",
    color: "#f9fafb",
    fontVariant: ["tabular-nums"],
    letterSpacing: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#22c55e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
