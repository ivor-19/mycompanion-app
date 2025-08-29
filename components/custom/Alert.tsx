import { FONT } from "@/lib/scale";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

interface Props {
  onPress?: () => void
  mainIcon?: string
  text?: string
  subText?: string
  buttonIcon?: string

}

export default function AlertBox({onPress, mainIcon, text, subText, buttonIcon}: Props) {
  return(
    <View className="w-full items-center justify-center p-4">
      <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 w-full">
        <View className="flex-row items-center gap-3">
          <RemixIcon name={mainIcon as any} color="orange" size={24} />
          <View className="flex-1">
            <Text className="font-funnel_bold text-amber-800" style={{fontSize: FONT.xs}}>
              {text}
            </Text>
            <Text className="font-funnel_regular text-amber-700 mt-1" style={{fontSize: FONT.xxs}}>
              {subText}
            </Text>
          </View>
          <TouchableOpacity onPress={onPress}>
            <RemixIcon name={buttonIcon as any} color="orange" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}