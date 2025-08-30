import Card from "@/components/custom/Card";
import GBackground from "@/components/custom/GBackground";
import MoodEntryModal from "@/components/custom/modal/MoodEntryModal";
import { FONT } from "@/lib/scale";
import { useMoodStore } from "@/stores/moodStore";
import { useTimeStore } from "@/stores/timeStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

const emotions = [
  { mood: 'Happy', emoji: require('@/assets/icons/emojis/happy.png'), colors: ['#FFFDE4', '#FFE259', '#FFA751'] },
  { mood: 'Sad', emoji: require('@/assets/icons/emojis/sad.png'), colors: ['#89F7FE', '#66A6FF', '#0052D4'] },
  { mood: 'Angry', emoji: require('@/assets/icons/emojis/angry.png'), colors: ['#FF512F', '#F09819', '#DD2476'] }, 
  { mood: 'Anxious', emoji: require('@/assets/icons/emojis/anxious.png'), colors: ['#F0E68C', '#DDA0DD', '#9370DB'] },
  { mood: 'Sleepy', emoji: require('@/assets/icons/emojis/sleepy.png'), colors: ['#2C3E50', '#4CA1AF', '#BBD2C5'] }, 
  { mood: 'Excited', emoji: require('@/assets/icons/emojis/excited.png'), colors: ['#FF61D2', '#FE9090', '#FFD194'] }, 
] as const ;

export default function DailyMood() {
  const [open, setOpen] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<any>(null);

  const { currentTime, currentDay, currentDate } = useTimeStore();
  const { moods, deleteMood } = useMoodStore();

  const handlePress = async (emotion: any) => {
    setSelectedEmotion(emotion)
    setOpen(true)
  }

  const handleDeleteMood = async (id: string) => {
   deleteMood(id)
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
                    <Image source={emotion.emoji} contentFit="contain" style={{width: 40, height: 40}} />
                    <Text className="font-funnel_bold text-white" style={{fontSize: FONT.xs, textShadowColor: 'black',   textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1,}}> {emotion.mood} </Text>
                  </TouchableOpacity>                                                  
                </LinearGradient>
              ))}
            </View>
          </Card>   
          <Card className="w-full px-6 py-4 rounded-3xl bg-white shadow-lg gap-4">
            <Text className="font-nt_semi" style={{fontSize: FONT.sm}}>Recent Entries</Text>
            <View className="flex-1 gap-2">
              {moods.length === 0 ? (
                <View className="py-8 items-center justify-center">
                  <Text className="font-nt_regular text-gray-500" style={{fontSize: FONT.xs}}>
                    No mood entries yet.
                  </Text>
                </View>

              ):(
                <>
                  {moods.map((mood, index) => (
                    <TouchableOpacity activeOpacity={0.8} className="bg-white" key={index}>
                      <Card className="bg-white rounded-2xl py-6 flex-row items-center justify-center gap-4">                
                        <View className="items-center justify-center h-8 w-8 rounded-full" style={{elevation: 6, shadowColor: 'gray'}}>
                          <Image source={mood.emoji} contentFit="contain" style={{height: 30, width: 30}}/>
                        </View>                                        
                        <View className="flex-1">
                          <Text className="font-nt_semi" style={{fontSize: FONT.xs}}>{mood.date}</Text>
                          <Text className="font-nt_regular" style={{fontSize: FONT.xs}}>{mood.note}</Text>
                          <View className="border-[1px] border-gray-300 rounded-2xl py-1 mt-1 max-w-20 items-center justify-center">
                            <Text className="font-nt_regular" style={{fontSize: FONT.xxs}}>{mood.mood}</Text>
                          </View> 
                        </View>  
                        <TouchableOpacity activeOpacity={0.7} onPress={() => handleDeleteMood(mood.id)}>
                          <RemixIcon name="delete-bin-fill" size={20} color="#BA1849"/>
                        </TouchableOpacity>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </>          
              )}
            </View>
          </Card>       
        </View>
        <MoodEntryModal open={open} setOpen={setOpen} emotions={selectedEmotion}/>    
      </ScrollView>  
    </GBackground>
  )
}