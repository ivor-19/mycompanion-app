import { FONT } from "@/lib/scale";
import { LinearGradient } from "expo-linear-gradient";
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
    <View className="flex-row fixed items-center w-full justify-evenly p-2 bg-transparent">
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} onPress={() => handleTabPress(tab.route)} disabled={pathName === tab.route} activeOpacity={0.7} className="flex-1">
          <LinearGradient
            colors={            
              pathName === tab.route
                ? ['#ffc2d1', '#FF90BC'] // gradient when selected
                : ['#ffffff', '#ffffff'] // plain white when not selected
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`p-2 items-center border-2 border-gray-100 ${
              tab.label === 'Daily'
                ? 'rounded-l-2xl'
                : tab.label === 'Weekly'
                ? ''
                : 'rounded-r-2xl'
            }`}
          >
          
              <Text className={`font-nt_semi ${pathName === tab.route ? 'text-white' : 'text-black'}`} style={{fontSize: FONT.xs}}>{tab.label}</Text>
        
          </LinearGradient>
        </TouchableOpacity>
      ))}

    </View>
  )
}