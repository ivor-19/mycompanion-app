import Button from "@/components/custom/Button";
import GBackground from "@/components/custom/GBackground";
import TextLogo from "@/components/custom/TextLogo";
import { secureStorage } from "@/lib/secureStorage";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
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
            <TextLogo />
          </View>
          <View className="flex-1 items-center justify-center gap-4">
            {/* <Image source={require('../assets/icons/logo.png')} contentFit="contain" style={{height: 140, width: 140}}/>  */}
            <Text className="font-nt_bold text-2xl">Your Mind, Your Space</Text>
            <Text className="font-funnel_regular text-sm text-gray-600 text-center">A safe space in your pocket, where guidance{'\n'} and care are always with you. </Text>
          </View>
          <View className="flex-2 w-full items-center justify-center gap-4">
            <Button text="Continue" fontStyle="font-nt_semi" style="bg-white h-20" onPress={handleContinue}/>
            {/* <Button text="Continue with Google" fontStyle="font-nt_semi" style="bg-white h-20" icon={require('../assets/icons/google.png')}/>*/}
            <Text className="text-xs text-gray-600 font-nt_regular">version 1.0</Text>
          </View>
        </View>
      </GBackground>
    </View>
  )
}