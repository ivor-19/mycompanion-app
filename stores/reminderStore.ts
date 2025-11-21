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

// Helper function to schedule notifications for a reminder
const scheduleNotificationsForReminder = async (
  reminder: Omit<Reminder, 'notificationIds'>
): Promise<string[]> => {
  const notificationIds: string[] = [];
  const hour24 = convertTo24Hour(reminder.hour, reminder.period);
  const min = parseInt(reminder.minute, 10);
  const randomTitle = reminderTitles[Math.floor(Math.random() * reminderTitles.length)];

  console.log(`📅 Scheduling notifications for: ${reminder.name}`);
  console.log(`⏰ Time: ${hour24}:${min} (from ${reminder.hour}:${reminder.minute} ${reminder.period})`);

  for (const day of reminder.days) {
    const weekday = getDayNumber(day);
    console.log(`📆 Scheduling for ${day} (weekday: ${weekday})`);
    
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

    console.log(`✅ Scheduled for ${day} - ID: ${notificationId}`);
    notificationIds.push(notificationId);
  }

  return notificationIds;
};

const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],

      initializeNotifications: async () => {
        await initializeNotificationPermissions();
      },

      addReminder: async (name, hour, minute, period, days, soundEnabled) => {
        console.log('🔵 addReminder called');
        
        const hasPermission = await initializeNotificationPermissions();
        if (!hasPermission) {
          console.log('❌ No permission');
          return;
        }

        // Create the reminder object WITHOUT notificationIds first
        const newReminder: Omit<Reminder, 'notificationIds'> = {
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

        try {
          // Schedule all notifications FIRST
          const notificationIds = await scheduleNotificationsForReminder(newReminder);
          
          // Verify scheduling
          const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
          console.log('📋 Total scheduled notifications:', allScheduled.length);
          console.log('📋 Our notification IDs:', notificationIds);

          // THEN add to state with complete data in ONE operation
          const completeReminder: Reminder = {
            ...newReminder,
            notificationIds,
          };

          set((state) => ({
            reminders: [...state.reminders, completeReminder],
          }));

          console.log('✅ Reminder added to state with notification IDs');
        } catch (error) {
          console.error('❌ Error scheduling notifications:', error);
          Alert.alert('Error', 'Failed to schedule reminder. Please try again.');
        }
      },

      deleteReminder: async (id: string) => {
        console.log('🗑️ Deleting reminder:', id);
        const reminder = get().reminders.find((r) => r.id === id);
        
        // Cancel notifications first
        if (reminder?.notificationIds) {
          await Promise.all(
            reminder.notificationIds.map((notifId) =>
              Notifications.cancelScheduledNotificationAsync(notifId).catch((error) => {
                console.error('Error canceling notification:', error);
              })
            )
          );
        }

        // Then remove from state
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },

      toggleReminder: async (id: string) => {
        const reminder = get().reminders.find((r) => r.id === id);
        if (!reminder) return;

        if (reminder.isEnabled) {
          // Disable: cancel notifications first
          if (reminder.notificationIds) {
            await Promise.all(
              reminder.notificationIds.map((notifId) =>
                Notifications.cancelScheduledNotificationAsync(notifId).catch((error) => {
                  console.error('Error canceling notification:', error);
                })
              )
            );
          }

          // Then update state
          set((state) => ({
            reminders: state.reminders.map((r) =>
              r.id === id ? { ...r, isEnabled: false, notificationIds: [] } : r
            ),
          }));
        } else {
          // Enable: schedule notifications first
          try {
            const notificationIds = await scheduleNotificationsForReminder(reminder);
            
            // Then update state
            set((state) => ({
              reminders: state.reminders.map((r) =>
                r.id === id ? { ...r, isEnabled: true, notificationIds } : r
              ),
            }));
          } catch (error) {
            console.error('Error scheduling notifications:', error);
          }
        }
      },

      clearReminders: async () => {
        const reminders = get().reminders;
        
        // Cancel all notifications first
        await Promise.all(
          reminders.flatMap((reminder) =>
            reminder.notificationIds?.map((notifId) =>
              Notifications.cancelScheduledNotificationAsync(notifId).catch((error) => {
                console.error('Error canceling notification:', error);
              })
            ) || []
          )
        );

        // Then clear state
        set({ reminders: [] });
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

