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
    <View className="flex-row gap-4 fixed items-center w-full justify-center bg-white p-4 border-b-[1px] border-gray-200">
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} className={`p-4 flex-1 items-center rounded-full border-2 border-gray-100 ${pathName === tab.route ? 'bg-[#f5576c]' : 'bg-white'}`} onPress={() => handleTabPress(tab.route)} activeOpacity={0.7} style={{elevation: 4, shadowColor: 'gray'}}>
          <Text className={`font-nt_semi ${pathName === tab.route ? 'text-white' : 'text-black'}`}>{tab.label}</Text>
        </TouchableOpacity>
      ))}

    </View>
  )
}