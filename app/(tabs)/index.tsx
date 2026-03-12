import HabitList from "@/components/HabitList";
import HabitSelectionModal from "@/components/HabitSelectionModal";
import { useHabitStore } from "@/store/useHabitStore";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const activeSession = useHabitStore((state) => state.activeSession);
  const habits = useHabitStore((state) => state.habits);
  const [modalVisible, setModalVisible] = useState(false);
  const [dayLogModal, setDayLogModal] = useState<{
    visible: boolean;
    habitName: string;
    minutes: number;
  }>({ visible: false, habitName: "", minutes: 0 });

  const last14Days = useMemo(() => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      dates.push(dateString);
    }

    return dates;
  }, []);

  const handleTimerPress = () => {
    if (activeSession) {
      router.push("/timer");
      return;
    }

    setModalVisible(true);
  };

  const handleDayPress = (habitId: string, date: string, minutes: number) => {
    const habit = habits.find((h) => h.id === habitId);
    setDayLogModal({
      visible: true,
      habitName: habit?.name || "Alışkanlık",
      minutes,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <HabitList dates={last14Days} onDayPress={handleDayPress} />
      </View>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleTimerPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {activeSession ? "Devam Et" : "Sayaç Başlat"}
          </Text>
        </TouchableOpacity>
      </View>

      <HabitSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <Modal
        visible={dayLogModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDayLogModal({ ...dayLogModal, visible: false })
        }
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDayLogModal({ ...dayLogModal, visible: false })}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {dayLogModal.minutes > 0
                ? `${dayLogModal.minutes} dakika`
                : "Aktivite Kaydı Yok"}
            </Text>
            <Text style={styles.modalMessage}>
              {dayLogModal.minutes > 0
                ? `${dayLogModal.habitName} yaptınız.`
                : "Bugün için bir aktivite kaydı yok."}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  content: {
    flex: 1,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "box-none",
  },
  floatingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22c55e",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
});
