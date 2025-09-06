import GBackground from "@/components/custom/GBackground";
import WeeklyMoodGraph from "@/components/custom/mood/WeeklyMoodGraph";
import { useMoodStore } from "@/stores/moodStore";
import { ScrollView } from "react-native";


export default function WeeklyMood() {
  const { moods } = useMoodStore()

   const moodsWithImages = moods.map(mood => ({
    ...mood,
    images: mood.images || [] // Provide empty array if images is undefined
  }));

  return(
    <GBackground>
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <WeeklyMoodGraph moodsData={moodsWithImages}/>
      </ScrollView>
    </GBackground>
    
   
  )
}