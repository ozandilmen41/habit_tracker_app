import { useHabitStore } from "@/store/useHabitStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HabitDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // O(1) lookup - MEMORY.md kuralına uygun
  const habits = useHabitStore((state) => state.habits);
  const logs = useHabitStore((state) => state.logs);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  const habit = habits.find((h) => h.id === id);

  // İstatistik hesaplamaları (useMemo ile optimize) - Hooks early return'den önce olmalı
  const stats = useMemo(() => {
    if (!habit)
      return { totalMinutes: "0", recordedDays: 0, avgMinutes: "0", streak: 0 };
    const habitLogs = logs[habit.id] || {};
    const entries = Object.entries(habitLogs);

    // Toplam süre (dakika)
    const totalMinutes = entries.reduce(
      (sum, [_, minutes]) => sum + minutes,
      0,
    );

    // Kaydedilen gün sayısı (0'dan büyük olanlar)
    const recordedDays = entries.filter(([_, minutes]) => minutes > 0).length;

    // Günlük ortalama (dakika)
    const avgMinutes =
      recordedDays > 0 ? (totalMinutes / recordedDays).toFixed(0) : "0";

    // Mevcut Seri (Streak) - Bugünden geriye doğru aralıksız gün sayısı
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      const minutes = habitLogs[dateString] || 0;

      if (minutes > 0) {
        streak++;
      } else {
        break; // Aralıksız seri kırıldı
      }
    }

    return {
      totalMinutes: totalMinutes.toFixed(0),
      recordedDays,
      avgMinutes,
      streak,
    };
  }, [logs, habit]);

  // Son 7 günlük veri (Bar Chart için)
  const last7Days = useMemo(() => {
    if (!habit) return [];

    const days = [];
    const today = new Date();
    const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      const minutes = logs[habit.id]?.[dateString] || 0;
      const dayName = dayNames[date.getDay()];

      days.push({ date: dateString, minutes, dayName });
    }

    return days;
  }, [logs, habit]);

  // Son 30 günlük veri (Heatmap için)
  const last30Days = useMemo(() => {
    if (!habit) return [];

    const days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      const minutes = logs[habit.id]?.[dateString] || 0;
      const isCompleted = minutes >= habit.dailyTargetMinutes;
      const hasActivity = minutes > 0;
      const dayNumber = date.getDate();

      days.push({
        date: dateString,
        minutes,
        isCompleted,
        hasActivity,
        dayNumber,
      });
    }

    return days;
  }, [logs, habit]);

  // Habit bulunamazsa
  if (!habit) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Alışkanlık bulunamadı</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Alışkanlığı sil
  const handleDelete = () => {
    Alert.alert(
      "Alışkanlığı Sil",
      `"${habit.name}" alışkanlığını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            deleteHabit(habit.id);
            router.replace("/");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.targetText}>
            Günlük Hedef: {habit.dailyTargetMinutes} Dakika
          </Text>
        </View>

        {/* Gelişmiş İstatistik Kartları - 4 Kart Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Toplam Süre</Text>
            <Text style={styles.statUnit}>Dakika</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.recordedDays}</Text>
            <Text style={styles.statLabel}>Toplam Gün</Text>
            <Text style={styles.statUnit}>Gün</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgMinutes}</Text>
            <Text style={styles.statLabel}>Günlük Ortalama</Text>
            <Text style={styles.statUnit}>Dakika/Gün</Text>
          </View>

          <View style={[styles.statCard, styles.streakCard]}>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Mevcut Seri</Text>
            <Text style={styles.statUnit}>Gün</Text>
          </View>
        </View>

        {/* Son 7 Gün Bar Grafiği */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Son 7 Gün Aktivite</Text>
          <View style={styles.barChartContainer}>
            {last7Days.map((day) => {
              const maxMinutes = Math.max(
                ...last7Days.map((d) => d.minutes),
                habit.dailyTargetMinutes,
              );
              const heightPercent =
                maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
              const barColor =
                day.minutes >= habit.dailyTargetMinutes ? "#22c55e" : "#3b82f6";

              return (
                <View key={day.date} style={styles.barColumn}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{day.dayName}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Detaylı 30 Günlük Takvim Ağı (Heatmap) */}
        <View style={styles.heatmapSection}>
          <Text style={styles.sectionTitle}>Son 30 Gün Takvimi</Text>
          <View style={styles.heatmapGrid}>
            {last30Days.map((day) => {
              let backgroundColor = "#e5e7eb"; // Boş (açık gri)
              let textColor = "#6b7280"; // Koyu gri

              if (day.hasActivity) {
                if (day.isCompleted) {
                  backgroundColor = "#22c55e"; // Yeşil
                  textColor = "#fff"; // Beyaz
                } else {
                  backgroundColor = "#3b82f6"; // Mavi
                  textColor = "#fff"; // Beyaz
                }
              }

              return (
                <View
                  key={day.date}
                  style={[styles.heatmapCell, { backgroundColor }]}
                >
                  <Text style={[styles.heatmapCellText, { color: textColor }]}>
                    {day.dayNumber}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendSquare, { backgroundColor: "#22c55e" }]}
              />
              <Text style={styles.legendText}>Hedef Tamamlandı</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendSquare, { backgroundColor: "#3b82f6" }]}
              />
              <Text style={styles.legendText}>Kısmi</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendSquare, { backgroundColor: "#e5e7eb" }]}
              />
              <Text style={styles.legendText}>Boş</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Tehlikeli Alan</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Alışkanlığı Sil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#22c55e",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  backLink: {
    marginBottom: 16,
  },
  backLinkText: {
    fontSize: 16,
    color: "#22c55e",
    fontWeight: "500",
  },
  habitName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 8,
  },
  targetText: {
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  streakCard: {
    backgroundColor: "#1f2937",
    borderColor: "#22c55e",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#d1d5db",
    fontWeight: "600",
    textAlign: "center",
  },
  statUnit: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
    marginTop: 2,
  },
  chartSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 16,
  },
  barChartContainer: {
    flexDirection: "row",
    height: 120,
    alignItems: "flex-end",
    gap: 8,
    paddingVertical: 16,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
  },
  heatmapSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  heatmapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  heatmapCell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heatmapCellText: {
    fontSize: 14,
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSquare: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  dangerZone: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dc2626",
    marginBottom: 16,
  },
  deleteButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#dc2626",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
  },
});
