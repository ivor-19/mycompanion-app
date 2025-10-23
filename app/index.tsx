import GBackground from "@/components/custom/GBackground";
import { secureStorage } from "@/lib/secureStorage";
import { useColorModeStore } from "@/stores/colorModeStore";
import { useThemeStore } from "@/stores/themeStore";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { scale } from "react-native-size-matters";

export default function Index() {
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()
  const handleContinue = async () => {
    try {
      const hasOnboarded = await secureStorage.getItem("hasOnboarded")
      if(hasOnboarded === "true"){
        router.replace('/home')
      }
      else{
        router.replace('/onboarding')
      }
    } catch (error) {
      console.error('Error has occured: ', error)
      router.replace('/onboarding')
    }

  }

  return(
    <View className="min-h-screen">
      <GBackground showBubbles bubbleCount={8}>
        <View className="h-full w-full flex flex-col items-center z-10 p-4" style={{paddingVertical: 80}}>
          <View className="flex-2">
            <Text className="font-cb" style={{fontSize: scale(30), color: theme.primary}}>MY COMPANION</Text>
          </View>
          <View className="flex-1 items-center justify-center gap-4">
            {/* <Image source={require('../assets/icons/logo.png')} contentFit="contain" style={{height: 140, width: 140}}/>  */}
            <Text className="font-nt_bold text-2xl" style={{color: mode.textPrimary}}>Your Mind, Your Space</Text>
            <Text className="font-funnel_regular text-sm text-center" style={{color: mode.textSecondary}}>A safe space in your pocket, where guidance{'\n'} and care are always with you. </Text>
          </View>
          <View className="flex-2 w-full items-center justify-center gap-4">
            <TouchableOpacity className="w-[80%] items-center justify-center rounded-full py-6" onPress={handleContinue} activeOpacity={0.8} style={{backgroundColor: theme.primary, elevation: 4, shadowOpacity: 0.15, shadowColor: 'gray' }}>
              <Text className="font-nt_semi text-white">Continue</Text>
            </TouchableOpacity>
            {/* <Button text="Continue with Google" fontStyle="font-nt_semi" style="bg-white h-20" icon={require('../assets/icons/google.png')}/>*/}
            <Text className="text-xs font-nt_regular" style={{color: mode.textSecondary}}>version 2.0</Text>
          </View>
        </View>
      </GBackground>
    </View>
  )
}