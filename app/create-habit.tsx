import { useHabitStore } from "@/store/useHabitStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateHabitPage() {
  const router = useRouter();
  const [habitName, setHabitName] = useState("");
  const [dailyTarget, setDailyTarget] = useState("60");
  const addHabit = useHabitStore((state) => state.addHabit);

  const handleCreate = () => {
    if (habitName.trim().length === 0) {
      Alert.alert("Hata", "Lütfen bir alışkanlık adı girin.");
      return;
    }

    const targetMinutes = parseFloat(dailyTarget);
    if (isNaN(targetMinutes) || targetMinutes <= 0) {
      Alert.alert("Hata", "Lütfen geçerli bir günlük hedef girin.");
      return;
    }

    addHabit(habitName.trim(), targetMinutes);
    Alert.alert("Başarılı", "Alışkanlık oluşturuldu!", [
      {
        text: "Tamam",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Yeni Alışkanlık</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Alışkanlık Adı</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Kitap Okuma, Spor, Meditasyon"
          value={habitName}
          onChangeText={setHabitName}
          autoFocus
        />

        <Text style={styles.label}>Günlük Hedef (Dakika)</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: 60"
          value={dailyTarget}
          onChangeText={setDailyTarget}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>Oluştur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>İptal</Text>
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d1d5db",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#4b5563",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#f9fafb",
    backgroundColor: "#1f2937",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "500",
  },
});
