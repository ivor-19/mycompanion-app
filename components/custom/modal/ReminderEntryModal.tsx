import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { FONT } from '@/lib/scale';
import { useColorModeStore } from '@/stores/colorModeStore';
import { useThemeStore } from '@/stores/themeStore';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import RemixIcon from 'react-native-remix-icon';
import { scale } from 'react-native-size-matters';
import TimePicker from '../TimePicker';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onReminderCreated?: () => void;
}

const reminderTitles = [
  "Hey! You have a reminder 😊",
  "Hey there! Don't forget this ⏰",
  "Heads up! You've got something to do 💡",
  "Just a nudge — your reminder's here 🔔",
  "Time for your reminder ⏳",
  "Quick reminder for you! 🫶",
  "Friendly ping! Check this out 💬",
];

const daysOfWeek = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

// SAFEST LOGGING FUNCTION FOR PRODUCTION
function safeLog(label: string, value: any) {
  try {
    console.warn(`🔍 ${label}:`, JSON.stringify(value));
  } catch (e) {
    console.warn(`🔍 ${label} (stringified):`, String(value));
  }
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
    return false;
  }
  return true;
}

export default function ReminderSetupModal({ open, setOpen, onReminderCreated }: Props) {
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()
  
  const [reminderName, setReminderName] = useState('')
  const [hour, setHour] = useState('09')
  const [minute, setMinute] = useState('00')
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [timeUntilReminder, setTimeUntilReminder] = useState('')
  const [showHourPicker, setShowHourPicker] = useState(false)
  const [showMinutePicker, setShowMinutePicker] = useState(false)
  const [errorTitle, setErrorTitle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]) // All days

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  useEffect(() => {
    if (open) {
      registerForPushNotificationsAsync();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setReminderName('')
      setHour('09')
      setMinute('00')
      setPeriod('PM')
      setSoundEnabled(true)
      setErrorTitle(false)
      setSelectedDays([0, 1, 2, 3, 4, 5, 6])
    }
  }, [open])

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) {
        Alert.alert('Error', 'Please select at least one day');
        return;
      }
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort((a, b) => a - b));
    }
  };

  const calculateTimeUntilReminder = () => {
    if (!hour || !minute) return

    const now = new Date()
    let targetHour = parseInt(hour)
    if (period === 'PM' && targetHour !== 12) {
      targetHour += 12
    } else if (period === 'AM' && targetHour === 12) {
      targetHour = 0
    }
    const targetMinute = parseInt(minute)

    const targetTime = new Date()
    targetTime.setHours(targetHour, targetMinute, 0, 0)

    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    const diff = targetTime.getTime() - now.getTime()
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60))
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hoursUntil < 1) {
      if (minutesUntil < 1) {
        setTimeUntilReminder('Reminder in less than a minute')
      } else {
        setTimeUntilReminder(`Reminder in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`)
      }
    } else if (hoursUntil < 24) {
      setTimeUntilReminder(`Reminder in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''} and ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`)
    } else {
      const daysUntil = Math.floor(hoursUntil / 24)
      const remainingHours = hoursUntil % 24
      setTimeUntilReminder(`Reminder in ${daysUntil} day${daysUntil !== 1 ? 's' : ''} and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`)
    }
  }

  useEffect(() => {
    calculateTimeUntilReminder()
  }, [hour, minute, period])

  // ===============================================
  // ⚡⚡⚡ PRODUCTION-SAFE, FULLY LOGGED handleSave ⚡⚡⚡
  // ===============================================
  const handleSave = async () => {
    if (!reminderName.trim()) {
      setErrorTitle(true)
      return
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    setLoading(true)
    
    try {
      const hasPermission = await registerForPushNotificationsAsync();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Please grant notification permissions to set reminders.');
        setLoading(false);
        return;
      }

      let notificationHour = parseInt(hour)
      if (period === 'PM' && notificationHour !== 12) {
        notificationHour += 12
      } else if (period === 'AM' && notificationHour === 12) {
        notificationHour = 0
      }

      // DEBUG: LOG VALUES BEFORE SCHEDULING
      safeLog("Reminder Name", reminderName);
      safeLog("Selected Days", selectedDays);
      safeLog("Hour", notificationHour);
      safeLog("Minute", minute);

      const notificationIds = [];

      for (const day of selectedDays) {
        // MORE DEBUG LOGS
        safeLog("Scheduling for day", day);

        const triggerData = {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: Number(day + 1),
          hour: Number(notificationHour),
          minute: Number(minute),
          channelId: "default",
        };

        const contentData = {
          title: reminderTitles[Math.floor(Math.random() * reminderTitles.length)],
          body: `Reminder: ${reminderName.trim()}`,
          sound: soundEnabled ? "default" : undefined,
          data: {
            reminderName: String(reminderName.trim()),
            dayOfWeek: String(day),
          },
        };

        safeLog("Trigger object", triggerData);
        safeLog("Content object", contentData);

        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: contentData,
            trigger: triggerData,
          });

          safeLog("Notification Created ID", id);
          notificationIds.push(id);

        } catch (innerErr: any) {
          console.warn("❌ scheduleNotificationAsync CRASH", innerErr?.message || innerErr);
          Alert.alert("Error", innerErr?.message || "Unknown inner scheduling error.");
        }
      }

      setOpen(false)
      setErrorTitle(false)
      
      const displayHour = notificationHour % 12 || 12;
      const displayPeriod = notificationHour >= 12 ? "PM" : "AM";
      
      const dayNames = selectedDays.length === 7 
        ? "Every day"
        : selectedDays.map(d => daysOfWeek[d].label).join(', ');
      
      Alert.alert("Scheduled ✓", `Reminder set for ${dayNames} at ${displayHour}:${minute} ${displayPeriod}`);
      
      if (onReminderCreated) {
        onReminderCreated()
      }
    } catch (error:any) {
      console.warn("❌ MAIN TRY/CATCH ERROR", error?.message || error);
      Alert.alert('Error', `Failed to schedule notification: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent 
        className='items-center justify-center' 
        style={{
          width: scale(320),
          backgroundColor: mode.main, 
          borderColor: mode.neutral, 
          borderWidth: 1
        }}
      >
        <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
          <AlertDialogHeader className='w-full'> 
            <View className='gap-4'>
              {/* Title */}
              <View className='flex-row gap-2 items-center mb-2'>
                <RemixIcon name='notification-line' size={scale(18)} color={theme.accent}/>
                <Text className='font-nt_medium' style={{fontSize: FONT.sm, color: mode.textPrimary}}>Set Daily Reminder</Text>
              </View>

              {/* Time Until Reminder */}
              {timeUntilReminder && hour && minute && (
                <View className='w-full rounded-xl p-3' style={{backgroundColor: mode.card}}>
                  <View className='flex-row items-center gap-2'>
                    <RemixIcon name='alarm-line' size={scale(14)} color={theme.accent}/>
                    <Text className='font-nt_regular' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>
                      {timeUntilReminder}
                    </Text>
                  </View>
                </View>
              )}

              {/* Reminder Name */}
              <View className='gap-2'>
                <View className='justify-between flex-row'>
                  <Text className='font-nt_regular text-left' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Reminder Title</Text>
                  {errorTitle &&
                    <Text className='font-nt_regular text-left' style={{fontSize: FONT.xxs, color: 'red'}}>Reminder title is required</Text>
                  }
                </View>
                <View className='w-full border-[1px] rounded-xl px-3 py-2' style={{borderColor: mode.neutral}}>
                  <TextInput 
                    placeholder="e.g., Daily Check-in"
                    className='font-nt_regular'
                    placeholderTextColor={'gray'}
                    style={{
                      fontSize: FONT.xs,
                      color: mode.textPrimary
                    }}
                    maxLength={50}
                    value={reminderName}
                    onChangeText={setReminderName}
                  />
                </View>
              </View>

              {/* Time Picker */}
              <View className='gap-2'>
                <Text className='font-nt_regular text-left' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Time</Text>
                <View className='flex-row items-center justify-center gap-2'>
                  <TouchableOpacity className='border-[1px] rounded-xl px-4 py-3 items-center flex-row justify-between' style={{borderColor: mode.neutral, width: scale(70)}} onPress={() => setShowHourPicker(true)} >
                    <Text className='font-nt_medium' style={{fontSize: FONT.md, color: mode.textPrimary}}>
                      {hour}
                    </Text>
                    <RemixIcon name='arrow-down-s-line' size={scale(14)} color={mode.textSecondary}/>
                  </TouchableOpacity>
                  
                  <Text className='font-nt_bold' style={{fontSize: FONT.lg, color: mode.textPrimary}}>:</Text>
                  
                  <TouchableOpacity 
                    className='border-[1px] rounded-xl px-4 py-3 items-center flex-row justify-between' 
                    style={{borderColor: mode.neutral, width: scale(70)}}
                    onPress={() => setShowMinutePicker(true)}
                  >
                    <Text className='font-nt_medium' style={{fontSize: FONT.md, color: mode.textPrimary}}>
                      {minute}
                    </Text>
                    <RemixIcon name='arrow-down-s-line' size={scale(14)} color={mode.textSecondary}/>
                  </TouchableOpacity>

                  <View className='flex-row gap-1'>
                    <TouchableOpacity 
                      className='rounded-lg px-3 py-2'
                      style={{backgroundColor: period === 'AM' ? theme.accent : mode.card, borderWidth: 1, borderColor: mode.neutral}}
                      onPress={() => setPeriod('AM')}
                    >
                      <Text className='font-nt_medium' style={{fontSize: FONT.xs, color: period === 'AM' ? 'white' : mode.textSecondary}}>AM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className='rounded-lg px-3 py-2'
                      style={{backgroundColor: period === 'PM' ? theme.accent : mode.card, borderWidth: 1, borderColor: mode.neutral}}
                      onPress={() => setPeriod('PM')}
                    >
                      <Text className='font-nt_medium' style={{fontSize: FONT.xs, color: period === 'PM' ? 'white' : mode.textSecondary}}>PM</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Day Selection */}
              <View className='gap-2'>
                <Text className='font-nt_regular text-left' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>
                  Repeat On
                </Text>
                <View className='flex-row flex-wrap gap-2 justify-between'>
                  {daysOfWeek.map((day) => (
                    <TouchableOpacity
                      key={day.value}
                      onPress={() => toggleDay(day.value)}
                      className='rounded-lg '
                      style={{
                        backgroundColor: selectedDays.includes(day.value) ? theme.accent : mode.card,
                        borderWidth: 1,
                        borderColor: selectedDays.includes(day.value) ? theme.accent : mode.neutral,
                        width: scale(38),
                      }}
                    >
                      <Text
                        className='font-nt_medium text-center'
                        style={{
                          fontSize: FONT.xxs,
                          color: selectedDays.includes(day.value) ? 'white' : mode.textSecondary,
                        }}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </AlertDialogHeader>
        </ScrollView>
        
        <AlertDialogFooter className='flex-row w-full mt-4'>
          <TouchableOpacity className='flex-1 flex-row items-center justify-center py-2' onPress={() => {setOpen(false), setErrorTitle(false)}} style={{backgroundColor: mode.card, borderWidth: 1, borderColor: mode.neutral, borderRadius: 10}}>
            <Text className='text-center font-nt_medium' style={{color: mode.textPrimary, fontSize: FONT.xs}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className='flex-1 flex-row items-center justify-center' 
            style={{backgroundColor: theme.primary, borderRadius: 10}}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : 
              <Text className='text-center font-nt_medium text-white' style={{fontSize: FONT.xs}}>Create Reminder</Text>
            }
          </TouchableOpacity>
        </AlertDialogFooter>
      </AlertDialogContent>

      <TimePicker
        visible={showHourPicker}
        onClose={() => setShowHourPicker(false)}
        options={hours}
        value={hour}
        onSelect={setHour}
        title="Select Hour"
      />

      <TimePicker
        visible={showMinutePicker}
        onClose={() => setShowMinutePicker(false)}
        options={minutes}
        value={minute}
        onSelect={setMinute}
        title="Select Minute"
      />
    </AlertDialog>
  )
}