import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, View } from 'react-native';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Notif() {
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Request permissions on mount
    registerForPushNotificationsAsync();

    // Listener for when notification is received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification: Notifications.Notification) => {
        setNotification(notification);
      }
    );

    // Listener for when user interacts with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response: Notifications.NotificationResponse) => {
        console.log('User tapped notification:', response);
      }
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // Schedule an immediate notification
  async function scheduleNotificationNow(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hey! 👋",
        body: 'This is a local notification!',
        data: { customData: 'goes here' },
      },
      trigger: null, // null means immediate
    });
  }

  // Schedule notification at specific time using WEEKLY trigger (more reliable)
  async function scheduleNotificationDelayed(): Promise<void> {
    const now = new Date();
    const targetHour = 16;
    const targetMinute = 50;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Scheduled Notification ⏰",
        body: 'This notification was scheduled for 4:50 PM',
        data: { scheduledAt: Date.now() },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: now.getDay() + 1, // 1 = Sunday, 2 = Monday, etc.
        hour: targetHour,
        minute: targetMinute,
      },
    });
    
    Alert.alert(
      'Notification Scheduled',
      `Notification scheduled for today at ${targetHour}:${targetMinute}. Close the app to test!`
    );
  }

  async function scheduleNotificationDelayed2(): Promise<void> {
    const now = new Date();
    const targetHour = 22;
    const targetMinute = 28;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Scheduled Notification ⏰",
        body: 'This notification was scheduled for 10:28 PM',
        data: { scheduledAt: Date.now() },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: now.getDay() + 1,
        hour: targetHour,
        minute: targetMinute,
      },
    });
    
    Alert.alert(
      'Notification Scheduled',
      `Notification scheduled for today at ${targetHour}:${targetMinute}. Close the app to test!`
    );
  }

  // Schedule daily notification using WEEKLY trigger for all 7 days
  async function scheduleDailyNotification(): Promise<void> {
    // Cancel existing daily notifications first
    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of allScheduled) {
      if (notif.content.title === "Good Morning! 🌅") {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }

    // Schedule for all 7 days of the week
    const notificationIds: string[] = [];
    for (let weekday = 1; weekday <= 7; weekday++) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Good Morning! 🌅",
          body: 'Time to check in with your companion',
          data: { type: 'daily-reminder', weekday },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekday, // 1 = Sunday through 7 = Saturday
          hour: 9,
          minute: 0,
        },
      });
      notificationIds.push(id);
    }

    Alert.alert(
      'Daily Notification Set',
      `You will receive a notification every day at 9:00 AM (${notificationIds.length} notifications scheduled)`
    );
  }

  // Cancel all scheduled notifications
  async function cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('All Notifications Cancelled', 'All scheduled notifications have been removed.');
  }

  // View all scheduled notifications
  async function viewScheduledNotifications(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', scheduled);
    
    if (scheduled.length === 0) {
      Alert.alert('No Scheduled Notifications', 'There are no notifications scheduled.');
    } else {
      const notificationList = scheduled.map((notif, index) => {
        const trigger = notif.trigger as any;
        let timeString = 'Unknown time';
        
        if (trigger.type === 'weekly') {
          const hour = trigger.hour ?? 0;
          const minute = trigger.minute ?? 0;
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
          timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
          
          if (trigger.weekday) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = days[trigger.weekday - 1] || 'Unknown';
            timeString = `${dayName} at ${timeString}`;
          }
        } else if (trigger.type === 'timeInterval') {
          const seconds = trigger.seconds || 0;
          timeString = `In ${Math.round(seconds / 60)} minutes`;
        }
        
        return `${index + 1}. ${notif.content.title}\n   ${timeString}\n   Type: ${trigger.type}`;
      }).join('\n\n');
      
      Alert.alert(
        `Scheduled (${scheduled.length})`,
        notificationList,
        [{ text: 'OK' }],
        { cancelable: true }
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Local Notifications</Text>
      
      <Text style={styles.infoText}>
        Note: In production, DAILY triggers don't work reliably on Android.
        This version uses WEEKLY triggers which work in both dev and production.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Send Notification Now"
          onPress={scheduleNotificationNow}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Schedule at 4:50 PM"
          onPress={scheduleNotificationDelayed}
          color="#2196F3"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Schedule at 10:28 PM"
          onPress={scheduleNotificationDelayed2}
          color="#2196F3"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Schedule Daily (9:00 AM)"
          onPress={scheduleDailyNotification}
          color="#4CAF50"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="View Scheduled Notifications"
          onPress={viewScheduledNotifications}
          color="#FF9800"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel All Notifications"
          onPress={cancelAllNotifications}
          color="#F44336"
        />
      </View>

      {notification && (
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>Last Notification:</Text>
          <Text style={styles.notificationText}>
            {notification.request.content.title}
          </Text>
          <Text style={styles.notificationBody}>
            {notification.request.content.body}
          </Text>
        </View>
      )}
    </View>
  );
}

async function registerForPushNotificationsAsync(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
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
    Alert.alert('Permission Error', 'Failed to get push notification permissions!');
    return;
  }

  console.log('Notification permissions granted');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginVertical: 8,
  },
  notificationInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    color: '#1976D2',
  },
  notificationText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
  },
});