import Card from "@/components/custom/Card";
import GBackground from "@/components/custom/GBackground";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const emotions = [
  { id: 1, mood: 'Happy', image: require('@/assets/icons/emojis/happy.png'), colors: ['#FFFDE4', '#FFE259', '#FFA751'] },
  { id: 2, mood: 'Sad', image: require('@/assets/icons/emojis/sad.png'), colors: ['#89F7FE', '#66A6FF', '#0052D4'] },
  { id: 3, mood: 'Angry', image: require('@/assets/icons/emojis/angry.png'), colors: ['#FF512F', '#F09819', '#DD2476'] }, 
  { id: 4, mood: 'Anxious', image: require('@/assets/icons/emojis/anxious.png'), colors: ['#F0E68C', '#DDA0DD', '#9370DB'] },
  { id: 5, mood: 'Sleepy', image: require('@/assets/icons/emojis/sleepy.png'), colors: ['#2C3E50', '#4CA1AF', '#BBD2C5'] }, 
  { id: 6, mood: 'Excited', image: require('@/assets/icons/emojis/excited.png'), colors: ['#FF61D2', '#FE9090', '#FFD194'] }, 
] as const ;

export default function DailyMood() {
  return (
    <GBackground>
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 ">       
          <Card className="w-full items-center px-4 py-6 rounded-3xl bg-white shadow-lg">
            <Text className="font-nt_semi text-xl text-gray-800 mb-4"> How are you feeling today?</Text>
            <View className="bg-orange-50 rounded-full px-6 py-3 mb-8">
              <Text className="font-nt_semi text-orange-800"> Thursday, August 28, 2025 </Text>
            </View>      
            <View className="flex-row flex-wrap w-full gap-4 justify-center">
              {emotions.map((emotion, index) => (
                <LinearGradient
                  key={index}
                  colors={emotion.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-24 h-28 border border-gray-200"
                  style={{borderRadius: 20, overflow: 'hidden'}}
                >                                                     
                  <TouchableOpacity className="w-full h-full items-center justify-center gap-3" activeOpacity={0.7} >
                    <Image source={emotion.image} contentFit="contain" style={{width: 40, height: 40}} />
                    <Text className="font-funnel_bold text-sm text-white" style={{textShadowColor: 'black',   textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1,}}> {emotion.mood} </Text>
                  </TouchableOpacity>                                     
                </LinearGradient>
              ))}
            </View>
          </Card>   
          <Card className="w-full px-8 py-6 rounded-3xl bg-white shadow-lg gap-4">
            <Text className="font-nt_semi text-lg">Recent Entries</Text>
            <View className="flex-1 gap-2">
              <TouchableOpacity activeOpacity={0.8} className="bg-white">
                <Card className="bg-white rounded-2xl py-6 flex-row items-center justify-center gap-4">
                  <View className="items-center justify-center h-8 w-8 rounded-full" style={{elevation: 6, shadowColor: 'gray'}}>
                    <Image source={require('@/assets/icons/emojis/happy.png')} contentFit="contain" style={{height: 30, width: 30}}/>
                  </View>
                  <View className="flex-1">
                    <Text className="font-nt_semi text-lg">2 days ago</Text>
                    <Text className="font-nt_regular text-sm">Had a great day at work</Text>
                  </View>  
                  <View className="border-[1px] border-gray-300 rounded-2xl px-4 py-2">
                    <Text className="font-nt_regular text-sm">Happy</Text>
                  </View>  
                </Card>
              </TouchableOpacity>
             
            </View>
          </Card>       
        </View>
      </ScrollView>  
    </GBackground>
  )
}