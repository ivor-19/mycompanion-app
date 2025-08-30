import { FONT } from "@/lib/scale";
import { router, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function MoodTab() {
  const pathName = usePathname()

  const tabs = [
    {label: 'Daily', route: '/daily-mood'},
    {label: 'Weekly', route: '/weekly-mood'},
    {label: 'Monthly', route: '/monthly-mood'},
  ]

  const handleTabPress = (route: any) => {
    router.push(route)
  }

  return(
    <View className="flex-row fixed items-center w-full justify-evenly bg-white p-2 border-b-[1px] border-gray-200">
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} className={`p-2 flex-1 items-center border-2 border-gray-100 ${tab.label === 'Daily' ? 'rounded-l-2xl' : tab.label === 'Weekly' ? '' : 'rounded-r-2xl'} ${pathName === tab.route ? 'bg-[#f5576c]' : 'bg-white'}`} onPress={() => handleTabPress(tab.route)} activeOpacity={0.7} style={{elevation: 4, shadowColor: 'gray'}}>
          <Text className={`font-nt_semi ${pathName === tab.route ? 'text-white' : 'text-black'}`} style={{fontSize: FONT.xs}}>{tab.label}</Text>
        </TouchableOpacity>
      ))}

    </View>
  )
}