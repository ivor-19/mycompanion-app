import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, View } from 'react-native';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // shows alert (Android + iOS)
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // required for iOS 17+
    shouldShowList: true,   // required for iOS 17+
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
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
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

  // Schedule a notification after 5 seconds
  async function scheduleNotificationDelayed(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Delayed Notification ⏰",
        body: 'This was scheduled 10 seconds ago',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
        repeats: false,
      },
    });
  }

  // Schedule a daily notification at specific time


  // Cancel all scheduled notifications
  async function cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('Success', 'All notifications cancelled');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Local Notifications</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Send Notification Now"
          onPress={scheduleNotificationNow}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Schedule in 10 Seconds"
          onPress={scheduleNotificationDelayed}
        />
      </View>

      

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel All Notifications"
          onPress={cancelAllNotifications}
          color="red"
        />
      </View>

      {notification && (
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>Last Notification:</Text>
          <Text>{notification.request.content.title}</Text>
          <Text>{notification.request.content.body}</Text>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 8,
  },
  notificationInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});