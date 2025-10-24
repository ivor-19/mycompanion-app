import { secureStorage } from '@/lib/secureStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Reminder = {
  id: string;
  name: string;
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
  days: string[];
  soundEnabled: boolean;
  isEnabled: boolean;
  createdAt: string;
};

interface ReminderStore {
  reminders: Reminder[];
  addReminder: (
    name: string,
    hour: string,
    minute: string,
    period: 'AM' | 'PM',
    days: string[],
    soundEnabled: boolean
  ) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  clearReminders: () => void;
}

const useReminderStore = create<ReminderStore>()(
  persist(
    (set) => ({
      reminders: [],

      addReminder: (name, hour, minute, period, days, soundEnabled) => {
        const newReminder: Reminder = {
          id: Date.now().toString(),
          name,
          hour,
          minute,
          period,
          days,
          soundEnabled,
          isEnabled: true,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));
      },

      deleteReminder: (id: string) =>
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        })),

      toggleReminder: (id: string) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id
              ? { ...reminder, isEnabled: !reminder.isEnabled }
              : reminder
          ),
        })),

      clearReminders: () => set({ reminders: [] }),
    }),
    {
      name: 'reminder-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export { useReminderStore };
