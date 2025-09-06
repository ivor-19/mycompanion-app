import GBackground from "@/components/custom/GBackground";
import MoodCard from "@/components/custom/mood/MoodCard";
import Calendar from "@/components/ui/calendar";
import { FONT } from "@/lib/scale";
import { useMoodStore } from "@/stores/moodStore";
import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function MonthlyMood() {
  const { moods, deleteMood } = useMoodStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDeleteMood = async (id: string) => {
    deleteMood(id);
  };

  const handleDatePress = (date: string) => {
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const clearFilter = () => {
    setSelectedDate(null);
  };

  const filteredMoods = selectedDate 
    ? moods.filter(mood => mood.date === selectedDate)
    : [];

  const formatSelectedDate = (dateString: string) => {
    return dateString;
  };

    const isFocused = useIsFocused();
  
    if (!isFocused) {
      return null; // unmount map completely when not focused
    }

  return (
    <GBackground>
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <View className="gap-2 flex-col justify-between">
          <Calendar 
            maxMoodsPerDay={3}
            onDatePress={handleDatePress}
            selectedDate={selectedDate}
            onMonthChange={clearFilter}
          />
          
          {selectedDate &&   
            <View className="bg-white rounded-3xl p-5 mx-4 mb-4" style={{elevation: 2, shadowColor: 'gray'}}>
              {/* Header with filter info */}
              <View className="flex-row items-center justify-between">
                <Text className="font-funnel_semi" style={{fontSize: FONT.xs}}> Moods for {formatSelectedDate(selectedDate)} </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={clearFilter} className="flex-row items-center gap-1 bg-gray-100 px-3 py-1 rounded-full" >
                  <Text className="font-nt_regular text-gray-600" style={{fontSize: FONT.xxs}}> Clear filter </Text>
                  <RemixIcon name="close-line" size={14} color="#666"/>
                </TouchableOpacity>
              </View>

              <ScrollView className="gap-2" style={{maxHeight: 500}} nestedScrollEnabled showsVerticalScrollIndicator={true}>
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
                      <View key={index}>
                        <MoodCard 
                          moodData={mood}
                          handleDeleteMood={() => handleDeleteMood(mood.id)}
                        />
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