import { getEmojiByMood } from '@/helper/moodEmoji';
import { FONT } from '@/lib/scale';
import { useMoodStore } from '@/stores/moodStore';
import { Image } from 'expo-image';
import React, { ReactElement, useState } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import RemixIcon from 'react-native-remix-icon';

interface CalendarProps {
  initialDate?: Date;
  headerTextStyle?: TextStyle;
  dayTextStyle?: TextStyle;
  containerStyle?: ViewStyle;
  showNavigationButtons?: boolean;
  maxMoodsPerDay?: number; // New prop to limit how many moods to show
  onDatePress?: (dateString: string) => void; // Callback when date is pressed
  selectedDate?: string | null; // Currently selected date
  onMonthChange?: () => void; 
}

const Calendar: React.FC<CalendarProps> = ({ 
  initialDate = new Date(),
  headerTextStyle = {},
  dayTextStyle = {},
  containerStyle = {},
  showNavigationButtons = true,
  maxMoodsPerDay = 3, // Default to show max 3 moods per day
  onMonthChange,
  onDatePress,
  selectedDate = null
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  const { moods } = useMoodStore();

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

  // Updated function to get ALL moods for a specific date
  const getMoodsForDate = (day: number) => {
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    
    // Format the date to match your mood date format: "21 August 2025"
    const dateString = `${day} ${currentMonth} ${currentYear}`;
    
    // Find ALL moods that match this date and limit to maxMoodsPerDay
    return moods.filter(mood => mood.date === dateString).slice(0, maxMoodsPerDay);
  };

  // Function to get formatted date string for a day
  const getDateString = (day: number) => {
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    return `${day} ${currentMonth} ${currentYear}`;
  };

  // Function to handle date press
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
          <Text style={styles.emptyDay}></Text>
        </View>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday: boolean = 
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      // Get ALL moods for this specific date
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
            <View style={styles.moodContainer}>
              <View style={styles.moodRow}>
                {moodsForDate.map((mood, index) => (
                  <Image 
                    key={`${mood.date}-${index}`}
                    source={getEmojiByMood(mood.moodText)} 
                    style={[
                      styles.moodEmoji,
                      hasMultipleMoods && styles.smallMoodEmoji,
                      index > 0 && styles.overlappingEmoji
                    ]}
                  />
                ))}
              </View>
              
              {/* Show count indicator if there are more moods than displayed */}
              {(() => {
                const totalMoodsForDate = moods.filter(mood => 
                  mood.date === `${day} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                ).length;
                const remainingMoods = totalMoodsForDate - maxMoodsPerDay;
                
                return remainingMoods > 0 && (
                  <Text style={styles.moodCount}>+ {remainingMoods} more</Text>
                );
              })()}
            </View>
          )}
          
          <Text   className={`font-nt_regular
            ${isToday && isSelected ? 'bg-[#FFF3E0] rounded-full py-2 px-4 font-nt_semi text-orange-600'
            : isToday ? 'bg-[#E3F2FD] rounded-full py-2 px-4 font-nt_semi text-blue-600'
            : isSelected ? 'bg-[#FFF3E0] rounded-full py-2 px-4 font-nt_semi text-orange-600'
            : ''}`}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header with month/year and navigation */}
      <View style={styles.header}>
        {showNavigationButtons && (
          <TouchableOpacity onPress={() => navigateMonth(-1)}>
            <RemixIcon name='arrow-left-s-line' size={30}/>
          </TouchableOpacity>
        )}
        
        <Text className='font-nt_semi' style={{fontSize: FONT.md}}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        
        {showNavigationButtons && (
          <TouchableOpacity onPress={() => navigateMonth(1)}>
            <RemixIcon name='arrow-right-s-line' size={30}/>
          </TouchableOpacity>
        )}
      </View>

      {/* Day names header */}
      <View style={styles.dayNamesRow}>
        {dayNames.map((day: string) => (
          <View key={day} style={styles.dayNameCell}>
            <Text className='font-nt_regular' style={{fontSize: FONT.xs}}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {renderCalendarDays()}
      </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDay: {
    fontSize: 16,
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    height: 20,
    width: 20,
  },
  smallMoodEmoji: {
    height: 16,
    width: 16,
  },
  overlappingEmoji: {
    marginLeft: -6, // Overlap emojis slightly when there are multiple
  },
  moodCount: {
    fontSize: 9,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 1,
    textAlign: 'center',
  },
});

export default Calendar;