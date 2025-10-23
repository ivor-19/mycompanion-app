import { useColorModeStore } from "@/stores/colorModeStore";
import { View } from "react-native";

export default function Separator() {
  const { mode } = useColorModeStore()
  return(
    <View className="h-[1px] w-full my-4" style={{backgroundColor: mode.neutral}}></View>
  )
}