import Card from "@/components/custom/Card";
import GBackground from "@/components/custom/GBackground";
import MoodCard from "@/components/custom/mood/MoodCard";
import MoodEntryModal from "@/components/custom/mood/MoodEntryModal";
import { getEmojiByMood } from "@/helper/moodEmoji";
import { FONT } from "@/lib/scale";
import { useMoodStore } from "@/stores/moodStore";
import { useTimeStore } from "@/stores/timeStore";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const emotions = [
  { moodText: 'Happy', colors: ['#FFFDE4', '#FFE259', '#FFA751'] },
  { moodText: 'Sad', colors: ['#89F7FE', '#66A6FF', '#0052D4'] },
  { moodText: 'Angry', colors: ['#FF512F', '#F09819', '#DD2476'] }, 
  { moodText: 'Anxious', colors: ['#F0E68C', '#DDA0DD', '#9370DB'] },
  { moodText: 'Neutral', colors: ['#2C3E50', '#4CA1AF', '#BBD2C5'] }, 
  { moodText: 'Excited', colors: ['#FF61D2', '#FE9090', '#FFD194'] }, 
] as const ;

export default function DailyMood() {
  const [open, setOpen] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');

  const { currentTime, currentDay, currentDate } = useTimeStore();
  const { moods, deleteMood } = useMoodStore();


  const handlePress = async (emotion: any) => {
    setSelectedEmotion(emotion.moodText) // Extract just the moodText string
    setOpen(true)
  }

  const handleDeleteMood = async (id: string) => {
   deleteMood(id)
  }

    const isFocused = useIsFocused();
  
    if (!isFocused) {
      return null; // unmount map completely when not focused
    }

  return (
    <GBackground>
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-4">       
          <Card className="w-full items-center px-4 py-6 rounded-3xl bg-white shadow-lg">
            <Text className="font-nt_semi text-gray-800 mb-2" style={{fontSize: FONT.sm}}> How are you feeling today?</Text>
            <View className="bg-orange-50 rounded-full px-6 py-3 mb-4">
              <Text className="font-nt_semi text-orange-800" style={{fontSize: FONT.xs}}> {currentDay}, {currentDate}, {currentTime} </Text>
            </View>      
            <View className="flex-row flex-wrap w-full gap-2 justify-center">
              {emotions.map((emotion, index) => (
                <LinearGradient
                  key={index}
                  colors={emotion.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-24 h-28 border border-gray-200"
                  style={{borderRadius: 20, overflow: 'hidden'}}
                >                                                     
                  <TouchableOpacity className="w-full h-full items-center justify-center gap-3" activeOpacity={0.7} onPress={() => handlePress(emotion)}>
                    <Image source={getEmojiByMood(emotion.moodText)} contentFit="contain" style={{width: 40, height: 40}} />
                    <Text className="font-funnel_bold text-white" style={{fontSize: FONT.xs, textShadowColor: 'black',   textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1,}}> {emotion.moodText} </Text>
                  </TouchableOpacity>                                                  
                </LinearGradient>
              ))}
            </View>
            <Text className="font-nt_regular mt-2 text-gray-600" style={{fontSize: FONT.xxs}}>Choose your current mood</Text>
          </Card>   
          <Card className="w-full px-6 py-4 rounded-3xl bg-white shadow-lg gap-4">
            <Text className="font-nt_semi" style={{fontSize: FONT.sm}}>Recent Entries</Text>
            <ScrollView className="gap-2" style={{maxHeight: 500}} nestedScrollEnabled>
              {moods.length === 0 ? (
                <View className="py-8 items-center justify-center">
                  <Text className="font-nt_regular text-gray-500" style={{fontSize: FONT.xs}}>
                    No mood entries yet.
                  </Text>
                </View>

              ):(
                <>
                  {moods.map((mood, index) => (
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
          </Card>       
        </View>
        <MoodEntryModal open={open} setOpen={setOpen} moodText={selectedEmotion}/>    
      </ScrollView>  
    </GBackground>
  )
}