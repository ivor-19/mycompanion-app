import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { FONT } from '@/lib/scale';
import { useColorModeStore } from '@/stores/colorModeStore';
import { useReminderStore } from '@/stores/reminderStore';
import { useThemeStore } from '@/stores/themeStore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import RemixIcon from 'react-native-remix-icon';
import { scale } from 'react-native-size-matters';
import TimePicker from '../TimePicker';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ReminderSetupModal({ open, setOpen }: Props) {
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()
  const { addReminder } = useReminderStore()
  
  const [reminderName, setReminderName] = useState('')
  const [hour, setHour] = useState('09')
  const [minute, setMinute] = useState('00')
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM')
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [timeUntilReminder, setTimeUntilReminder] = useState('')
  const [showHourPicker, setShowHourPicker] = useState(false)
  const [showMinutePicker, setShowMinutePicker] = useState(false)

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayMap: { [key: string]: number } = {
    'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
  }

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setReminderName('')
      setHour('09')
      setMinute('00')
      setPeriod('PM')
      setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
      setSoundEnabled(true)
    }
  }, [open])

  const calculateTimeUntilReminder = () => {
    if (!hour || !minute) return

    const now = new Date()
    const currentDay = now.getDay()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Convert 12-hour format to 24-hour
    let targetHour = parseInt(hour)
    if (period === 'PM' && targetHour !== 12) {
      targetHour += 12
    } else if (period === 'AM' && targetHour === 12) {
      targetHour = 0
    }
    const targetMinute = parseInt(minute)

    // If no days selected, return
    if (selectedDays.length === 0) {
      setTimeUntilReminder('No days selected')
      return
    }

    // Find the next occurrence
    let minDaysUntil = Infinity
    let nextReminderDate = new Date(now)

    for (const day of selectedDays) {
      const targetDay = dayMap[day]
      let daysUntil = targetDay - currentDay

      // If target day is today
      if (daysUntil === 0) {
        // Check if time has passed
        if (currentHour > targetHour || (currentHour === targetHour && currentMinute >= targetMinute)) {
          // Move to next week
          daysUntil = 7
        }
      } else if (daysUntil < 0) {
        // Target day is earlier in the week, add 7 to get next week
        daysUntil += 7
      }

      if (daysUntil < minDaysUntil) {
        minDaysUntil = daysUntil
      }
    }

    // Calculate the exact time difference
    nextReminderDate.setDate(now.getDate() + minDaysUntil)
    nextReminderDate.setHours(targetHour, targetMinute, 0, 0)

    const diff = nextReminderDate.getTime() - now.getTime()
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
  }, [hour, minute, period, selectedDays])

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleSave = () => {
    // Validation
    if (!reminderName.trim()) {
      Alert.alert('Error', 'Please enter a reminder name')
      return
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day')
      return
    }

    // Save reminder
    addReminder(
      reminderName.trim(),
      hour,
      minute,
      period,
      selectedDays,
      soundEnabled
    )

    // Close modal
    setOpen(false)
    
    // Show success message
    Alert.alert('Success', 'Reminder created successfully!')
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
                <Text className='font-nt_medium' style={{fontSize: FONT.sm, color: mode.textPrimary}}>Set Reminder</Text>
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
                <Text className='font-nt_regular' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Reminder Name</Text>
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
                <Text className='font-nt_regular' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Time</Text>
                <View className='flex-row items-center justify-center gap-2'>
                  {/* Hour Dropdown */}
                  <TouchableOpacity 
                    className='border-[1px] rounded-xl px-4 py-3 items-center flex-row justify-between' 
                    style={{borderColor: mode.neutral, width: scale(70)}}
                    onPress={() => setShowHourPicker(true)}
                  >
                    <Text className='font-nt_medium' style={{fontSize: FONT.md, color: mode.textPrimary}}>
                      {hour}
                    </Text>
                    <RemixIcon name='arrow-down-s-line' size={scale(14)} color={mode.textSecondary}/>
                  </TouchableOpacity>
                  
                  <Text className='font-nt_bold' style={{fontSize: FONT.lg, color: mode.textPrimary}}>:</Text>
                  
                  {/* Minute Dropdown */}
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

                  {/* AM/PM */}
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

              {/* Days Selection */}
              <View className='gap-2'>
                <Text className='font-nt_regular' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Repeat</Text>
                <View className='flex-row flex-wrap gap-2'>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => toggleDay(day)}
                      className='px-3 py-2 rounded-lg'
                      style={{
                        backgroundColor: selectedDays.includes(day) ? theme.accent : mode.card,
                        borderWidth: 1,
                        borderColor: selectedDays.includes(day) ? theme.accent : mode.neutral
                      }}
                    >
                      <Text 
                        className='font-nt_medium' 
                        style={{
                          fontSize: FONT.xxs, 
                          color: selectedDays.includes(day) ? 'white' : mode.textSecondary
                        }}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sound Toggle */}
              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-2'>
                  <RemixIcon name='volume-up-line' size={scale(16)} color={theme.accent}/>
                  <Text className='font-nt_regular' style={{fontSize: FONT.xs, color: mode.textPrimary}}>Sound & Vibration</Text>
                </View>
                <TouchableOpacity 
                  className='w-12 h-6 rounded-full justify-center px-0.5'
                  style={{backgroundColor: soundEnabled ? theme.accent : mode.neutral}}
                  onPress={() => setSoundEnabled(!soundEnabled)}
                >
                  <View 
                    className='w-5 h-5 rounded-full bg-white'
                    style={{alignSelf: soundEnabled ? 'flex-end' : 'flex-start'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </AlertDialogHeader>
        </ScrollView>
        
        <AlertDialogFooter className='flex-row w-full mt-4'>
          <AlertDialogCancel className='flex-1 flex-row items-center justify-center' style={{backgroundColor: mode.card, borderWidth: 1, borderColor: mode.neutral}}>
            <Text className='text-center font-nt_medium' style={{color: mode.textPrimary}}>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction 
            className='flex-1 flex-row items-center justify-center' 
            style={{backgroundColor: theme.primary}}
            onPress={handleSave}
          >
            <Text className='text-center font-nt_medium text-white'>Create Reminder</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

      {/* Hour Picker Modal */}
      <TimePicker
        visible={showHourPicker}
        onClose={() => setShowHourPicker(false)}
        options={hours}
        value={hour}
        onSelect={setHour}
        title="Select Hour"
      />

      {/* Minute Picker Modal */}
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