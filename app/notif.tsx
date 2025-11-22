import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Configure notification behavior in foreground
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
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => setNotification(notification)
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => console.log('User tapped notification:', response)
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const increaseHour = () => setHour((h) => (h + 1) % 24);
  const decreaseHour = () => setHour((h) => (h - 1 + 24) % 24);
  const increaseMinute = () => setMinute((m) => (m + 1) % 60);
  const decreaseMinute = () => setMinute((m) => (m - 1 + 60) % 60);

  const formatTime = () => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${period}`;
  };

  async function scheduleCustomDaily() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Reminder 📌",
        body: "Your scheduled notification!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: "default",
      },
    });

    Alert.alert("Scheduled ✓", `Daily notification set for ${formatTime()}`);
  }

  async function scheduleNotificationNow() {
    await Notifications.scheduleNotificationAsync({
      content: { title: "Hey! 👋", body: "This is a local notification!" },
      trigger: null,
    });
  }

  async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert("Cancelled", "All scheduled notifications were removed.");
  }

  async function viewScheduledNotifications() {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    if (scheduled.length === 0) {
      Alert.alert("No Scheduled Notifications", "There are no notifications scheduled.");
      return;
    }

    const message = scheduled
      .map((notif, i) => {
        const trigger = notif.trigger as any;
        const data = notif.content.data as { selectedDays?: number[], reminderName?: string };
        const selectedDays = data?.selectedDays;
        
        if (trigger.type === "daily") {
          const h = trigger.hour || 0;
          const m = trigger.minute || 0;
          const period = h >= 12 ? "PM" : "AM";
          const displayH = h % 12 || 12;
          const timeStr = `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
          
          // Format day display
          let dayDisplay = 'Daily';
          if (selectedDays && Array.isArray(selectedDays)) {
            if (selectedDays.length === 7) {
              dayDisplay = 'Daily';
            } else if (selectedDays.length === 5 && 
                      selectedDays.includes(1) && 
                      selectedDays.includes(2) && 
                      selectedDays.includes(3) && 
                      selectedDays.includes(4) && 
                      selectedDays.includes(5)) {
              dayDisplay = 'Weekdays (Mon-Fri)';
            } else if (selectedDays.length === 2 && 
                      selectedDays.includes(0) && 
                      selectedDays.includes(6)) {
              dayDisplay = 'Weekends (Sat-Sun)';
            } else {
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              dayDisplay = selectedDays.map(d => dayNames[d]).join(', ');
            }
          }
          
          return `${i + 1}. ${notif.content.body}\n   ${dayDisplay} at ${timeStr}`;
        }
        return `${i + 1}. ${notif.content.body}`;
      })
    .join("\n\n");

    Alert.alert(`Scheduled (${scheduled.length})`, message);
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        <Text className="text-2xl font-bold mb-4 text-center text-gray-800">
          Expo Local Notifications
        </Text>

        <Text className="text-xs text-gray-600 text-center mb-5 px-2 italic">
          ✔ Using DAILY triggers — stable in production
        </Text>

        {/* Time Picker */}
        <View className="bg-white p-5 rounded-lg mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-3 text-gray-800">Set Custom Time:</Text>

          <View className="flex-row items-center justify-center my-5">
            <View className="items-center mx-4">
              <TouchableOpacity className="bg-blue-500 px-6 py-2 rounded-lg" onPress={increaseHour}>
                <Text className="text-white text-xl font-bold">+</Text>
              </TouchableOpacity>
              <Text className="text-4xl font-bold my-2 text-gray-800">
                {hour.toString().padStart(2, "0")}
              </Text>
              <TouchableOpacity className="bg-blue-500 px-6 py-2 rounded-lg" onPress={decreaseHour}>
                <Text className="text-white text-xl font-bold">-</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-4xl font-bold text-gray-800">:</Text>

            <View className="items-center mx-4">
              <TouchableOpacity className="bg-blue-500 px-6 py-2 rounded-lg" onPress={increaseMinute}>
                <Text className="text-white text-xl font-bold">+</Text>
              </TouchableOpacity>
              <Text className="text-4xl font-bold my-2 text-gray-800">
                {minute.toString().padStart(2, "0")}
              </Text>
              <TouchableOpacity className="bg-blue-500 px-6 py-2 rounded-lg" onPress={decreaseMinute}>
                <Text className="text-white text-xl font-bold">-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-2xl text-center my-3 text-gray-700 font-semibold">
            {formatTime()}
          </Text>

          <TouchableOpacity className="bg-green-500 p-4 rounded-lg mt-2" onPress={scheduleCustomDaily}>
            <Text className="text-white text-center text-base font-bold">
              Schedule Daily at {formatTime()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <TouchableOpacity className="bg-purple-500 p-4 rounded-lg mb-3" onPress={scheduleNotificationNow}>
          <Text className="text-white text-center text-base font-semibold">Send Notification Now</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-orange-500 p-4 rounded-lg mb-3" onPress={viewScheduledNotifications}>
          <Text className="text-white text-center text-base font-semibold">View Scheduled Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-500 p-4 rounded-lg mb-3" onPress={cancelAllNotifications}>
          <Text className="text-white text-center text-base font-semibold">Cancel All Notifications</Text>
        </TouchableOpacity>

        {notification && (
          <View className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <Text className="font-bold mb-2 text-base text-blue-700">Last Notification:</Text>
            <Text className="font-semibold text-sm text-gray-800 mb-1">
              {notification.request.content.title}
            </Text>
            <Text className="text-sm text-gray-600">{notification.request.content.body}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }

  if (status !== "granted") {
    Alert.alert("Permission Error", "Failed to get push notification permissions!");
  }
}