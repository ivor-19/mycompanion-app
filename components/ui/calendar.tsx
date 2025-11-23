import { getEmojiByMood } from '@/helper/moodEmoji';
import { FONT } from '@/lib/scale';
import { useColorModeStore } from '@/stores/colorModeStore';
import { useMoodStore } from '@/stores/moodStore';
import { useThemeStore } from '@/stores/themeStore';
import React, { ReactElement, useState } from 'react';
import { Image as RNImage, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import RemixIcon from 'react-native-remix-icon';
import { scale } from 'react-native-size-matters';

interface CalendarProps {
  initialDate?: Date;
  headerTextStyle?: TextStyle;
  dayTextStyle?: TextStyle;
  containerStyle?: ViewStyle;
  showNavigationButtons?: boolean;
  maxMoodsPerDay?: number;
  onDatePress?: (dateString: string) => void;
  selectedDate?: string | null;
  onMonthChange?: () => void; 
}

const Calendar: React.FC<CalendarProps> = ({ 
  initialDate = new Date(),
  headerTextStyle = {},
  dayTextStyle = {},
  containerStyle = {},
  showNavigationButtons = true,
  maxMoodsPerDay = 3,
  onMonthChange,
  onDatePress,
  selectedDate = null
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  const { moods } = useMoodStore();
  const { mode } = useColorModeStore()
  const { theme } = useThemeStore()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: number): void => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);

    if (onMonthChange) {
      onMonthChange();
    }
  };

  const getMoodsForDate = (day: number) => {
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    const dateString = `${day} ${currentMonth} ${currentYear}`;
    
    return moods.filter(mood => mood.date === dateString).slice(0, maxMoodsPerDay);
  };

  const getDateString = (day: number) => {
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    return `${day} ${currentMonth} ${currentYear}`;
  };

  const handleDatePress = (day: number) => {
    if (onDatePress) {
      const dateString = getDateString(day);
      onDatePress(dateString);
    }
  };

  const renderCalendarDays = (): ReactElement[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: ReactElement[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <Text style={{fontSize: FONT.xs}}></Text>
        </View>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday: boolean = 
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      const moodsForDate = getMoodsForDate(day);
      const hasMultipleMoods = moodsForDate.length > 1;
      const dateString = getDateString(day);
      const isSelected = selectedDate === dateString;

      days.push(
        <TouchableOpacity 
          key={day} 
          style={styles.dayCell} 
          className='my-1'
          activeOpacity={0.7}
          onPress={() => handleDatePress(day)}
        >
          {/* Show multiple moods if they exist for this date */}
          {moodsForDate.length > 0 && (
            <View className='items-center mb-2'>
              <View className='flex-row items-center justify-center' style={styles.emojiContainer}>
                {moodsForDate.map((mood, index) => {
                  try {
                    const emojiSource = getEmojiByMood(mood.moodText);
                    
                    if (!emojiSource) {
                      console.warn('No emoji source for mood:', mood.moodText);
                      return null;
                    }
                    
                    // Try using React Native Image instead of Expo Image for better compatibility
                    return (
                      <RNImage 
                        key={`emoji-${day}-${index}-${mood.moodText}`}
                        source={emojiSource}
                        style={[
                          styles.moodEmoji,
                          hasMultipleMoods && styles.smallMoodEmoji,
                          index > 0 && styles.overlappingEmoji
                        ]}
                        resizeMode="contain"
                        onError={(error) => {
                          console.error('Image load error for mood:', mood.moodText, error.nativeEvent.error);
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', mood.moodText);
                        }}
                      />
                    );
                  } catch (error) {
                    console.error('Error rendering emoji:', error);
                    return null;
                  }
                })}
              </View>
              
              {/* Show count indicator if there are more moods than displayed */}
              {(() => {
                const totalMoodsForDate = moods.filter(mood => 
                  mood.date === `${day} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                ).length;
                const remainingMoods = totalMoodsForDate - maxMoodsPerDay;
                
                return remainingMoods > 0 && (
                  <Text className='flex-row text-center font-funnel_regular mt-1' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>
                    +{remainingMoods}
                  </Text>
                );
              })()}
            </View>
          )}
          
          <Text
            style={[
              {
                fontFamily: "nt_regular",
                color: mode.textSecondary
              },
              (isToday && isSelected) && {
                backgroundColor: theme.primary + '20',
                borderRadius: 9999,
                paddingVertical: 8,
                paddingHorizontal: 16,
                fontFamily: "nt_semi",
                color: theme.textPrimary,
              },
              (isToday && !isSelected) && {
                backgroundColor: theme.primary + '20',
                borderRadius: 9999,
                paddingVertical: 8,
                paddingHorizontal: 16,
                fontFamily: "nt_semi",
                color: theme.primary,
              },
              (!isToday && isSelected) && {
                backgroundColor: mode.neutral,
                borderRadius: 9999,
                paddingVertical: 8,
                paddingHorizontal: 16,
                fontFamily: "nt_semi",
                color: theme.textPrimary,
              },
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <View style={{backgroundColor: mode.card, padding: scale(14), borderRadius: 8, margin: 10, elevation: 5, }}>
      {/* Header with month/year and navigation */}
      <View className='flex-row justify-between items-center mb-6'>
        {showNavigationButtons && (
          <TouchableOpacity onPress={() => navigateMonth(-1)} activeOpacity={0.7}>
            <RemixIcon name='arrow-left-s-line' size={scale(24)} color={mode.textPrimary}/>
          </TouchableOpacity>
        )}
        
        <Text className='font-funnel_semi' style={{fontSize: FONT.md, color: mode.textPrimary}}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        
        {showNavigationButtons && (
          <TouchableOpacity onPress={() => navigateMonth(1)} activeOpacity={0.7}>
            <RemixIcon name='arrow-right-s-line' size={scale(24)} color={mode.textPrimary}/>
          </TouchableOpacity>
        )}
      </View>

      {/* Day names header */}
      <View className='flex-row'>
        {dayNames.map((day: string) => (
          <View key={day} className='flex-1 items-center'>
            <Text className='font-funnel_regular' style={{fontSize: FONT.xs, color: mode.textSecondary}}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className='flex-wrap flex-row'>
        {renderCalendarDays()}
      </View>
      <Text className='text-center font-funnel_regular' style={{fontSize: FONT.xxs, color: mode.textSecondary}}>
        Select a date to see mood entries
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(18),
    minWidth: scale(18),
  },
  moodEmoji: {
    height: scale(16),
    width: scale(16),
    resizeMode: 'contain',
  },
  smallMoodEmoji: {
    height: scale(13),
    width: scale(13),
    resizeMode: 'contain',
  },
  overlappingEmoji: {
    marginLeft: scale(-5),
  },
});

export default Calendar;