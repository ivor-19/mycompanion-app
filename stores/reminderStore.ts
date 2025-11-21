import { secureStorage } from '@/lib/secureStorage';
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
  days: string[];
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
  deleteReminder: (id: string) => void; // Changed to sync
  toggleReminder: (id: string) => Promise<void>;
  clearReminders: () => void; // Changed to sync
  initializeNotifications: () => Promise<void>;
  _addReminderToState: (reminder: Reminder) => void; // Internal sync method
  _updateReminderInState: (id: string, updates: Partial<Reminder>) => void; // Internal sync method
  _removeReminderFromState: (id: string) => void; // Internal sync method
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Initialize notification permissions
const initializeNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminder-channel', {
      name: 'Reminder Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
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
    Alert.alert(
      'Permission Required',
      'Please enable notifications to receive reminders.'
    );
    return false;
  }

  console.log('Notification permissions granted');
  return true;
};

// Convert 12-hour to 24-hour format
const convertTo24Hour = (hour: string, period: 'AM' | 'PM'): number => {
  let hour24 = parseInt(hour, 10);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return hour24;
};

// Map day names to weekday numbers (1 = Sunday, 2 = Monday, etc.)
const getDayNumber = (day: string): number => {
  const days: { [key: string]: number } = {
    'Sun': 1,
    'Sunday': 1,
    'Mon': 2,
    'Monday': 2,
    'Tue': 3,
    'Tuesday': 3,
    'Wed': 4,
    'Wednesday': 4,
    'Thu': 5,
    'Thursday': 5,
    'Fri': 6,
    'Friday': 6,
    'Sat': 7,
    'Saturday': 7,
  };
  return days[day] || 1;
};

const reminderTitles = [
  "Hey! You have a reminder 😊",
  "Hey there! Don't forget this ⏰",
  "Heads up! You've got something to do 💡",
  "Just a nudge — your reminder's here 🔔",
  "Time for your reminder ⏳",
  "Quick reminder for you! 🫶",
  "Friendly ping! Check this out 💬",
];

const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],

      initializeNotifications: async () => {
        await initializeNotificationPermissions();
      },

      // Internal sync methods that directly update state
      _addReminderToState: (reminder: Reminder) => {
        console.log('💾 Adding reminder to state (sync):', reminder.name);
        set((state) => ({
          reminders: [...state.reminders, reminder],
        }));
      },

      _updateReminderInState: (id: string, updates: Partial<Reminder>) => {
        console.log('💾 Updating reminder in state (sync):', id);
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      _removeReminderFromState: (id: string) => {
        console.log('💾 Removing reminder from state (sync):', id);
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },

      addReminder: async (name, hour, minute, period, days, soundEnabled) => {
        console.log('🔵 addReminder called');
        
        const hasPermission = await initializeNotificationPermissions();
        if (!hasPermission) {
          console.log('❌ No permission');
          return;
        }

        // Create reminder object first
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

        // Add to state IMMEDIATELY (before async operations)
        get()._addReminderToState(newReminder);
        console.log('✅ Reminder added to state');

        // Then schedule notifications asynchronously
        const notificationIds: string[] = [];
        const hour24 = convertTo24Hour(hour, period);
        const min = parseInt(minute, 10);
        const randomTitle = reminderTitles[Math.floor(Math.random() * reminderTitles.length)];

        console.log(`📅 Scheduling notifications for: ${name}`);

        try {
          for (const day of days) {
            const weekday = getDayNumber(day);
            const notificationId = await Notifications.scheduleNotificationAsync({
              content: {
                title: randomTitle,
                body: `Reminder: ${name}`,
                data: { reminderId: newReminder.id, day },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: weekday,
                hour: hour24,
                minute: min,
              },
            });

            console.log(`✅ Scheduled for ${day} - ID: ${notificationId}`);
            notificationIds.push(notificationId);
          }

          // Update with notification IDs
          get()._updateReminderInState(newReminder.id, { notificationIds });
          console.log('✅ Notification IDs updated');
        } catch (error) {
          console.error('❌ Error scheduling notifications:', error);
        }
      },

      deleteReminder: (id: string) => {
        console.log('🗑️ Deleting reminder:', id);
        const reminder = get().reminders.find((r) => r.id === id);
        
        // Remove from state first (sync)
        get()._removeReminderFromState(id);
        
        // Cancel notifications asynchronously (don't await)
        if (reminder?.notificationIds) {
          reminder.notificationIds.forEach(async (notifId) => {
            try {
              await Notifications.cancelScheduledNotificationAsync(notifId);
            } catch (error) {
              console.error('Error canceling notification:', error);
            }
          });
        }
      },

      toggleReminder: async (id: string) => {
        const reminder = get().reminders.find((r) => r.id === id);
        if (!reminder) return;

        if (reminder.isEnabled) {
          // Disable: update state first
          get()._updateReminderInState(id, { isEnabled: false, notificationIds: [] });
          
          // Cancel notifications asynchronously
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
          // Enable: schedule first, then update state
          const notificationIds: string[] = [];
          const hour24 = convertTo24Hour(reminder.hour, reminder.period);
          const min = parseInt(reminder.minute, 10);
          const randomTitle = reminderTitles[Math.floor(Math.random() * reminderTitles.length)];

          try {
            for (const day of reminder.days) {
              const weekday = getDayNumber(day);
              const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                  title: randomTitle,
                  body: `Reminder: ${reminder.name}`,
                  data: { reminderId: reminder.id, day },
                },
                trigger: {
                  type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                  weekday: weekday,
                  hour: hour24,
                  minute: min,
                },
              });
              notificationIds.push(notificationId);
            }
            
            // Update state after successful scheduling
            get()._updateReminderInState(id, { isEnabled: true, notificationIds });
          } catch (error) {
            console.error('Error scheduling notifications:', error);
          }
        }
      },

      clearReminders: () => {
        const reminders = get().reminders;
        
        // Clear state first (sync)
        set({ reminders: [] });
        
        // Cancel notifications asynchronously
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
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => {
        console.log('🌊 Hydration starting...');
        return (state, error) => {
          if (error) {
            console.error('❌ Hydration failed:', error);
          } else {
            console.log('✅ Hydration complete. Reminders:', state?.reminders?.length || 0);
          }
        };
      },
    }
  )
);

export { useReminderStore };

