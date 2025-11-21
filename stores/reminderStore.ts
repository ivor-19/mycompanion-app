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
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  clearReminders: () => Promise<void>;
  initializeNotifications: () => Promise<void>;
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
  "Hey there! Don’t forget this ⏰",
  "Heads up! You’ve got something to do 💡",
  "Just a nudge — your reminder’s here 🔔",
  "Time for your reminder ⏳",
  "Quick reminder for you! 🫶",
  "Friendly ping! Check this out 💬",
];

const randomTitle = reminderTitles[Math.floor(Math.random() * reminderTitles.length)];

const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],

      initializeNotifications: async () => {
        await initializeNotificationPermissions();
      },

      addReminder: async (name, hour, minute, period, days, soundEnabled) => {
        const hasPermission = await initializeNotificationPermissions();
        if (!hasPermission) return;

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

        // Schedule notifications
        const notificationIds: string[] = [];
        const hour24 = convertTo24Hour(hour, period);
        const min = parseInt(minute, 10);

        console.log(`📅 Scheduling: ${name}`);
        console.log(`⏰ Time: ${hour24}:${min} (24-hour)`);
        console.log(`📆 Days:`, days);

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

          console.log(`✅ Scheduled for ${day} (weekday ${weekday}) - ID: ${notificationId}`);
          notificationIds.push(notificationId);
        }

        newReminder.notificationIds = notificationIds;

        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));

      },

      deleteReminder: async (id: string) => {
        const reminder = get().reminders.find((r) => r.id === id);
        
        if (reminder?.notificationIds) {
          for (const notifId of reminder.notificationIds) {
            await Notifications.cancelScheduledNotificationAsync(notifId);
          }
        }

        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },

      toggleReminder: async (id: string) => {
        const reminder = get().reminders.find((r) => r.id === id);
        if (!reminder) return;

        if (reminder.isEnabled) {
          // Disable: cancel notifications
          if (reminder.notificationIds) {
            for (const notifId of reminder.notificationIds) {
              await Notifications.cancelScheduledNotificationAsync(notifId);
            }
          }
          
          set((state) => ({
            reminders: state.reminders.map((r) =>
              r.id === id ? { ...r, isEnabled: false, notificationIds: [] } : r
            ),
          }));
        } else {
          // Enable: reschedule
          const notificationIds: string[] = [];
          const hour24 = convertTo24Hour(reminder.hour, reminder.period);
          const min = parseInt(reminder.minute, 10);

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
          
          set((state) => ({
            reminders: state.reminders.map((r) =>
              r.id === id ? { ...r, isEnabled: true, notificationIds } : r
            ),
          }));
        }
      },

      clearReminders: async () => {
        const reminders = get().reminders;
        for (const reminder of reminders) {
          if (reminder.notificationIds) {
            for (const notifId of reminder.notificationIds) {
              await Notifications.cancelScheduledNotificationAsync(notifId);
            }
          }
        }
        
        set({ reminders: [] });
      },
    }),
    {
      name: 'reminder-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export { useReminderStore };

