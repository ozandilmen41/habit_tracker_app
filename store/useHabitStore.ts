import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Habit {
  id: string;
  name: string;
  createdAt: number;
  dailyTargetMinutes: number;
  color?: string;
}

export type HabitLogs = Record<string, Record<string, number>>;

export interface ActiveSession {
  habitId: string;
  startTime: number | null;
  accumulatedTime: number;
  status: "idle" | "running" | "paused";
}

interface HabitStore {
  habits: Habit[];
  logs: HabitLogs;
  activeSession: ActiveSession | null;

  addHabit: (name: string, dailyTargetMinutes: number, color?: string) => void;
  deleteHabit: (id: string) => void;
  setLog: (habitId: string, date: string, durationMinutes: number) => void;
  deleteLog: (habitId: string, date: string) => void;
  getLog: (habitId: string, date: string) => number | undefined;

  startSession: (habitId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  finishSession: () => void;
  getCurrentDuration: () => number;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: {},
      activeSession: null,

      addHabit: (name: string, dailyTargetMinutes: number, color?: string) => {
        const newHabit: Habit = {
          id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          createdAt: Date.now(),
          dailyTargetMinutes,
          color,
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      deleteHabit: (id: string) => {
        set((state) => {
          const newLogs = { ...state.logs };
          delete newLogs[id];

          return {
            habits: state.habits.filter((h) => h.id !== id),
            logs: newLogs,
            activeSession:
              state.activeSession?.habitId === id ? null : state.activeSession,
          };
        });
      },

      setLog: (habitId: string, date: string, durationMinutes: number) => {
        set((state) => ({
          logs: {
            ...state.logs,
            [habitId]: {
              ...state.logs[habitId],
              [date]: durationMinutes,
            },
          },
        }));
      },

      deleteLog: (habitId: string, date: string) => {
        set((state) => {
          const habitLogs = { ...state.logs[habitId] };
          delete habitLogs[date];

          return {
            logs: {
              ...state.logs,
              [habitId]: habitLogs,
            },
          };
        });
      },

      getLog: (habitId: string, date: string) => {
        return get().logs[habitId]?.[date];
      },

      startSession: (habitId: string) => {
        set({
          activeSession: {
            habitId,
            startTime: Date.now(),
            accumulatedTime: 0,
            status: "running",
          },
        });
      },

      pauseSession: () => {
        const { activeSession } = get();
        if (
          !activeSession ||
          activeSession.status !== "running" ||
          activeSession.startTime === null
        ) {
          return;
        }

        const elapsed = Date.now() - activeSession.startTime;

        set({
          activeSession: {
            ...activeSession,
            startTime: null,
            accumulatedTime: activeSession.accumulatedTime + elapsed,
            status: "paused",
          },
        });
      },

      resumeSession: () => {
        const { activeSession } = get();
        if (!activeSession || activeSession.status !== "paused") {
          return;
        }

        set({
          activeSession: {
            ...activeSession,
            startTime: Date.now(),
            status: "running",
          },
        });
      },

      finishSession: () => {
        const { activeSession, setLog } = get();
        if (!activeSession) {
          return;
        }

        const totalMs = get().getCurrentDuration();
        const minutes = Math.round(totalMs / (1000 * 60));

        const today = new Date().toISOString().split("T")[0];

        setLog(activeSession.habitId, today, minutes);

        set({ activeSession: null });
      },

      getCurrentDuration: () => {
        const { activeSession } = get();
        if (!activeSession) {
          return 0;
        }

        if (
          activeSession.status === "running" &&
          activeSession.startTime !== null
        ) {
          return (
            activeSession.accumulatedTime +
            (Date.now() - activeSession.startTime)
          );
        }

        return activeSession.accumulatedTime;
      },
    }),
    {
      name: "habit-tracker-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
