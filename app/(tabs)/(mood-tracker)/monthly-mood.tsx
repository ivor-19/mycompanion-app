import GBackground from "@/components/custom/GBackground";
import MoodCard from "@/components/custom/mood/MoodCard";
import Calendar from "@/components/ui/calendar";
import { FONT } from "@/lib/scale";
import { useColorModeStore } from "@/stores/colorModeStore";
import { useMoodStore } from "@/stores/moodStore";
import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { scale } from "react-native-size-matters";

export default function MonthlyMood() {
  const { moods, deleteMood } = useMoodStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { mode } = useColorModeStore()

  const handleDeleteMood = async (id: string) => {
    deleteMood(id);
  };

  // Normalize date format for comparison - matches both "23 November 2025" and "November 23, 2025"
  const normalizeDateString = (dateStr: string): string => {
    try {
      // Remove commas and trim
      const cleanedStr = dateStr.replace(/,/g, '').trim();
      const parts = cleanedStr.split(' ');
      
      const months = { 
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 
        'May': 4, 'June': 5, 'July': 6, 'August': 7, 
        'September': 8, 'October': 9, 'November': 10, 'December': 11 
      };
      
      // Try "day month year" format (e.g., "23 November 2025") - Calendar format
      if (parts.length === 3 && !isNaN(parseInt(parts[0]))) {
        const day = parseInt(parts[0]);
        const monthName = parts[1];
        const year = parseInt(parts[2]);
        
        const monthIndex = months[monthName as keyof typeof months];
        if (monthIndex !== undefined && !isNaN(day) && !isNaN(year)) {
          // Return in "day month year" format to match calendar
          return `${day} ${monthName} ${year}`;
        }
      }
      
      // Try "month day year" format (e.g., "November 23 2025")
      if (parts.length === 3 && isNaN(parseInt(parts[0]))) {
        const monthName = parts[0];
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        
        const monthIndex = months[monthName as keyof typeof months];
        if (monthIndex !== undefined && !isNaN(day) && !isNaN(year)) {
          // Convert to "day month year" format to match calendar
          return `${day} ${monthName} ${year}`;
        }
      }
      
      // Fallback to native Date parsing and convert to calendar format
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const day = date.getDate();
        const monthName = Object.keys(months).find(key => months[key as keyof typeof months] === date.getMonth());
        const year = date.getFullYear();
        return `${day} ${monthName} ${year}`;
      }
      
      // If all parsing fails, return original
      return dateStr;
    } catch (error) {
      console.log('Date normalization error for:', dateStr, error);
      return dateStr;
    }
  };

  const handleDatePress = (date: string) => {
    console.log('Selected date from calendar:', date);
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const clearFilter = () => {
    setSelectedDate(null);
  };

  // Filter moods with normalized date comparison
  const filteredMoods = selectedDate 
    ? moods.filter(mood => {
        const normalizedMoodDate = normalizeDateString(mood.date);
        const normalizedSelectedDate = normalizeDateString(selectedDate);
        console.log(`Comparing: ${normalizedMoodDate} === ${normalizedSelectedDate}`, normalizedMoodDate === normalizedSelectedDate);
        return normalizedMoodDate === normalizedSelectedDate;
      })
    : [];

  // Log for debugging
  console.log('Selected date:', selectedDate);
  console.log('Filtered moods count:', filteredMoods.length);
  console.log('All moods dates:', moods.map(m => m.date));

  const formatSelectedDate = (dateString: string) => {
    try {
      const normalized = normalizeDateString(dateString);
      // normalized is now in "day month year" format, just add comma for display
      const parts = normalized.split(' ');
      if (parts.length === 3) {
        return `${parts[1]} ${parts[0]}, ${parts[2]}`; // "November 23, 2025"
      }
    } catch (error) {
      console.log('Format error:', error);
    }
    return dateString;
  };

  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <GBackground>
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <View className="gap-2 flex-col justify-between pb-24">
          <Calendar 
            maxMoodsPerDay={3}
            onDatePress={handleDatePress}
            selectedDate={selectedDate}
            onMonthChange={clearFilter}
          />
          
          {selectedDate &&   
            <View className="rounded-3xl p-5 mx-4 mb-4" style={{elevation: 2, shadowColor: 'gray', backgroundColor: mode.card}}>
              {/* Header with filter info */}
              <View className="flex-row items-center justify-between">
                <Text className="font-funnel_semi" style={{fontSize: FONT.xs, color: mode.textPrimary}}> Moods for {formatSelectedDate(selectedDate)} </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={clearFilter} className="flex-row items-center gap-1 px-3 py-1 rounded-full" style={{backgroundColor: mode.neutral}}>
                  <Text className="font-nt_regular text-gray-600" style={{fontSize: FONT.xxs, color: mode.textSecondary}}> Clear filter </Text>
                  <RemixIcon name="close-line" size={scale(12)} color={mode.textSecondary}/>
                </TouchableOpacity>
              </View>

              <ScrollView className="gap-2 py-4" style={{maxHeight: 500}} nestedScrollEnabled showsVerticalScrollIndicator={true}>
                {!selectedDate ? (
                  <View></View>
                ) : filteredMoods.length === 0 ? (
                  <View className="py-8 items-center justify-center">
                    <Text className="font-nt_regular text-gray-500" style={{fontSize: FONT.xs}}>
                      No mood entries for {formatSelectedDate(selectedDate)}.
                    </Text>
                  </View>
                ) : (
                  <>
                    {filteredMoods.map((mood, index) => (
                      <View key={index} className="">
                        <MoodCard moodData={mood} />
                      </View>
                    ))}
                  </>          
                )}
              </ScrollView>
            </View>    
          }
        </View>
      </ScrollView>
    </GBackground>
  );
}