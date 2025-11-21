import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Reminder = {
  id: string;
  name: string;
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
  days: string[]; // ["Mon", "Tue", ...]
  soundEnabled: boolean;
  isEnabled: boolean;
  createdAt: string;
  notificationIds?: string[];
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
  ) => Promise<void>;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => Promise<void>;
  clearReminders: () => void;
  initializeNotifications: () => Promise<void>;
  _addReminderToState: (reminder: Reminder) => void;
  _updateReminderInState: (id: string, updates: Partial<Reminder>) => void;
  _removeReminderFromState: (id: string) => void;
}

// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Permissions
const initializeNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission Required', 'Please enable notifications to receive reminders.');
    return false;
  }

  console.log('Notification permissions granted');
  return true;
};

// Convert 12h → 24h
const convertTo24Hour = (hour: string, period: 'AM' | 'PM'): number => {
  let hour24 = parseInt(hour, 10);
  if (period === 'PM' && hour24 !== 12) hour24 += 12;
  if (period === 'AM' && hour24 === 12) hour24 = 0;
  return hour24;
};

// Maps day name → index 1-7 (1 = Sunday, 7 = Saturday)
const getDayNumber = (day: string): number => {
  const map: Record<string, number> = {
    Sun: 1, Sunday: 1,
    Mon: 2, Monday: 2,
    Tue: 3, Tuesday: 3,
    Wed: 4, Wednesday: 4,
    Thu: 5, Thursday: 5,
    Fri: 6, Friday: 6,
    Sat: 7, Saturday: 7,
  };
  return map[day] ?? 1;
};

// Titles
const reminderTitles = [
  "Hey! You have a reminder 😊",
  "Hey there! Don't forget this ⏰",
  "Heads up! You've got something to do 💡",
  "Just a nudge — your reminder's here 🔔",
  "Time for your reminder ⏳",
  "Quick reminder for you! 🫶",
  "Friendly ping! Check this out 💬",
];

// Main store
const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],

      initializeNotifications: async () => {
        await initializeNotificationPermissions();
      },

      _addReminderToState: (reminder) => {
        console.log('💾 Adding reminder to state:', reminder.name);
        set((state) => ({ reminders: [...state.reminders, reminder] }));
      },

      _updateReminderInState: (id, updates) => {
        console.log('💾 Updating reminder in state:', id);
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },

      _removeReminderFromState: (id) => {
        console.log('💾 Removing reminder from state:', id);
        set((state) => ({ reminders: state.reminders.filter((r) => r.id !== id) }));
      },

      // ADD REMINDER - Using DAILY trigger (production-reliable)
      addReminder: async (name, hour, minute, period, days, soundEnabled) => {
        console.log('🔵 addReminder called');
        
        const hasPermission = await initializeNotificationPermissions();
        if (!hasPermission) {
          console.log('❌ No permission');
          return;
        }

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

        console.log('📝 Created reminder object:', newReminder.id);

        // Add to state immediately
        get()._addReminderToState(newReminder);
        console.log('✅ Reminder added to state');

        // Schedule notification using DAILY trigger
        const hour24 = convertTo24Hour(hour, period);
        const min = parseInt(minute, 10);
        const selectedDays = days.map(getDayNumber);
        const randomTitle = reminderTitles[Math.floor(Math.random() * reminderTitles.length)];

        console.log(`📅 Scheduling notification for: ${name} at ${hour24}:${min}`);

        try {
          // Use DAILY trigger - will fire every day at the specified time
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: randomTitle,
              body: `Reminder: ${name}`,
              data: { 
                reminderId: newReminder.id, 
                selectedDays: selectedDays // Store which days should actually trigger
              },
              sound: soundEnabled ? 'default' : undefined,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: hour24,
              minute: min,
            },
          });

          console.log(`✅ Scheduled DAILY notification - ID: ${notificationId}`);
          
          // Update with notification ID
          get()._updateReminderInState(newReminder.id, { notificationIds: [notificationId] });
          console.log('✅ Notification ID updated');
        } catch (error) {
          console.error('❌ Error scheduling notification:', error);
        }
      },

      deleteReminder: (id) => {
        console.log('🗑️ Deleting reminder:', id);
        const reminder = get().reminders.find((r) => r.id === id);
        
        // Remove from state first
        get()._removeReminderFromState(id);
        
        // Cancel notifications
        if (reminder?.notificationIds) {
          reminder.notificationIds.forEach(async (notifId) => {
            try {
              await Notifications.cancelScheduledNotificationAsync(notifId);
              console.log('✅ Cancelled notification:', notifId);
            } catch (error) {
              console.error('Error canceling notification:', error);
            }
          });
        }
      },

      toggleReminder: async (id) => {
        const reminder = get().reminders.find((r) => r.id === id);
        if (!reminder) return;

        if (reminder.isEnabled) {
          // DISABLE
          console.log('⏸️ Disabling reminder:', id);
          get()._updateReminderInState(id, { isEnabled: false, notificationIds: [] });
          
          if (reminder.notificationIds) {
            reminder.notificationIds.forEach(async (notifId) => {
              try {
                await Notifications.cancelScheduledNotificationAsync(notifId);
              } catch (error) {
                console.error('Error canceling notification:', error);
              }
            });
          }
        } else {
          // ENABLE
          console.log('▶️ Enabling reminder:', id);
          const hour24 = convertTo24Hour(reminder.hour, reminder.period);
          const min = parseInt(reminder.minute, 10);
          const selectedDays = reminder.days.map(getDayNumber);
          const randomTitle = reminderTitles[Math.floor(Math.random() * reminderTitles.length)];

          try {
            const notificationId = await Notifications.scheduleNotificationAsync({
              content: {
                title: randomTitle,
                body: `Reminder: ${reminder.name}`,
                data: { 
                  reminderId: reminder.id, 
                  selectedDays: selectedDays 
                },
                sound: reminder.soundEnabled ? 'default' : undefined,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: hour24,
                minute: min,
              },
            });
            
            get()._updateReminderInState(id, { isEnabled: true, notificationIds: [notificationId] });
            console.log('✅ Reminder re-enabled');
          } catch (error) {
            console.error('Error re-enabling notification:', error);
          }
        }
      },

      clearReminders: () => {
        console.log('🧹 Clearing all reminders');
        const reminders = get().reminders;
        
        set({ reminders: [] });
        
        reminders.forEach((reminder) => {
          if (reminder.notificationIds) {
            reminder.notificationIds.forEach(async (notifId) => {
              try {
                await Notifications.cancelScheduledNotificationAsync(notifId);
              } catch (error) {
                console.error('Error canceling notification:', error);
              }
            });
          }
        });
      },
    }),
    {
      name: 'reminder-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        console.log('🌊 Hydration starting...');
        return (state, error) => {
          if (error) console.error('❌ Hydration failed:', error);
          else console.log('✅ Hydration complete.');
        };
      },
    }
  )
);

export { useReminderStore };
