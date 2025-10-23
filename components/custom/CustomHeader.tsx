import { FONT } from "@/lib/scale";
import { useColorModeStore } from "@/stores/colorModeStore";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

interface Props {
  title?: string
  enableBack?: string
}

export default function CustomHeader({title, enableBack}: Props) {
  const { mode } = useColorModeStore()

  return(
    <View className='pt-4 pb-4 px-4 flex-row items-center' style={{backgroundColor: mode.main, borderBottomWidth: 1, borderColor: mode.neutral}}>
      <View className="flex-1">
        {enableBack &&     
          <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/home')}>
            <RemixIcon name="arrow-left-s-line" size={30}/>
          </TouchableOpacity>
        }
      </View>
      <View className="w-full items-center">
        <Text className="font-funnel_bold" style={{fontSize: FONT.md, color: mode.textPrimary}}>{title}</Text>
      </View>
      <View className="flex-1 items-end">
        <Text></Text>
      </View>
    </View>
  )
}