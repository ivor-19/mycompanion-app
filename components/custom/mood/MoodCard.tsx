import { getEmojiByMood } from "@/helper/moodEmoji";
import { FONT } from "@/lib/scale";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import Card from "../Card";
import { MoodBadge } from "./MoodBadge";
import ViewMoodEntryModal from "./ViewMoodEntryModal";

type MoodsData = {
  moodText: string,
  date: string,
  day: string,
  time: string,
  note: string,
}

interface Props {
  moodData: MoodsData
  handleDeleteMood: () => void
}

export default function MoodCard({ moodData, handleDeleteMood }: Props) {
  const [open, setOpen] = useState(false)

  return(
    <>
      <TouchableOpacity activeOpacity={0.8} className="bg-white mt-2 border border-gray-100 rounded-2xl" onPress={() => setOpen(true)}>
        <Card className="bg-white rounded-2xl py-6 flex-row items-center justify-center gap-4">                
          <View className="items-center justify-center h-8 w-8 rounded-full" style={{elevation: 6, shadowColor: 'gray'}}>
            <Image source={getEmojiByMood(moodData.moodText)} contentFit="contain" style={{height: 30, width: 30}}/>
          </View>                                        
          <View className="flex-1">
            <Text className="font-nt_semi" style={{fontSize: FONT.xs}}>{moodData.date}</Text>
            <Text className="font-nt_regular mb-1" style={{fontSize: FONT.xxs}} numberOfLines={2}>{moodData.note}</Text>
            <MoodBadge mood={moodData.moodText}/>
          </View>  
          <TouchableOpacity activeOpacity={0.7} onPress={handleDeleteMood}>
            <RemixIcon name="delete-bin-fill" size={20} color="#BA1849"/>
          </TouchableOpacity>
        </Card>
      </TouchableOpacity>


      <ViewMoodEntryModal open={open} setOpen={setOpen} moodData={moodData}/>
    </>
  )
}