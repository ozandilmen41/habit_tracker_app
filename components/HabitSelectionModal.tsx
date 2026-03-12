import { useHabitStore } from "@/store/useHabitStore";
import { useRouter } from "expo-router";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface HabitSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HabitSelectionModal({
  visible,
  onClose,
}: HabitSelectionModalProps) {
  const router = useRouter();
  const habits = useHabitStore((state) => state.habits);
  const startSession = useHabitStore((state) => state.startSession);

  const handleHabitSelect = (habitId: string) => {
    startSession(habitId);
    onClose();
    router.push("/timer");
  };

  const handleCreateNew = () => {
    onClose();
    router.push("/create-habit");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Hangi aktiviteye başlıyoruz?</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleCreateNew}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.listContainer}
            showsVerticalScrollIndicator={false}
          >
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitCard}
                onPress={() => handleHabitSelect(habit.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  addButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
    lineHeight: 24,
  },
  listContainer: {
    maxHeight: 400,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    color: "#3b82f6",
    marginLeft: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
  },
});
