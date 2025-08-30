import { FONT } from "@/lib/scale";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

interface Props {
  title?: string
  enableBack?: string
}

export default function CustomHeader({title, enableBack}: Props) {
  return(
    <View className='pt-4 pb-4 px-4 bg-white border-b-2 border-gray-100 flex-row items-center'>
      <View className="flex-1">
        {enableBack &&     
          <TouchableOpacity activeOpacity={0.6} onPress={() => router.back()}>
            <RemixIcon name="arrow-left-s-line" size={30}/>
          </TouchableOpacity>
        }
      </View>
      <View className="w-full items-center">
        <Text className="font-funnel_bold" style={{fontSize: FONT.md}}>{title}</Text>
      </View>
      <View className="flex-1 items-end">
        <Text></Text>
      </View>
    </View>
  )
}