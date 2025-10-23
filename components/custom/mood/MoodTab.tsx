import { FONT } from "@/lib/scale";
import { useColorModeStore } from "@/stores/colorModeStore";
import { useThemeStore } from "@/stores/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function MoodTab() {
  const pathName = usePathname()
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()

  const tabs = [
    {label: 'Daily', route: '/daily-mood'},
    {label: 'Weekly', route: '/weekly-mood'},
    {label: 'Monthly', route: '/monthly-mood'},
  ]

  const handleTabPress = (route: any) => {
    router.push(route)
  }

  return(
    <View className="flex-row fixed items-center w-full justify-evenly p-2 bg-transparent" style={{borderRadius: 50, gap: 6}}>
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} onPress={() => handleTabPress(tab.route)} disabled={pathName === tab.route} activeOpacity={0.7} className="flex-1" style={{ borderRadius: 50}}>
          <LinearGradient
            colors={            
              pathName === tab.route
                ? theme.gradient // gradient when selected
                : mode.background // plain white when not selected
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`p-2 items-center rounded-full`}
            style={{borderWidth: 1, borderColor: mode.neutral, borderRadius: 50, }}
          >
          
              <Text className={`font-nt_semi ${pathName === tab.route ? mode.textPrimary : mode.name === 'dark' ? 'text-white' : mode.textPrimary}`} style={{fontSize: FONT.xs}}>{tab.label}</Text>
        
          </LinearGradient>
        </TouchableOpacity>
      ))}

    </View>
  )
}