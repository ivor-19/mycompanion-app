import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  style?: string
  fontStyle?: string
  text?: string
  icon?: any
  onPress?: () => void
}

export default function Button({ style, fontStyle, text, icon, onPress}: Props) {
  return(
    <TouchableOpacity onPress={onPress} className={`relative w-[80%] items-center justify-center rounded-full ${style}`} activeOpacity={0.8} style={{elevation: 4, shadowOpacity: 0.15, shadowColor: 'gray' }}>
      <View className="absolute left-6">
        <Image source={icon} contentFit="cover" style={{height: 20, width: 20}}/>
      </View>
      <Text className={`font-funnel_regular ${fontStyle}`}>{text}</Text>
    </TouchableOpacity>
  )
}