import Button from "@/components/custom/Button";
import GradientBackground from "@/components/custom/GradientBackground";
import TextLogo from "@/components/custom/TextLogo";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return(
     <GradientBackground>
      <View className="h-full w-full flex flex-col items-center z-10 p-4">
        <View className="flex-2">
          <TextLogo />
        </View>
        <View className="flex-1 items-center justify-center gap-4">
          {/* <Image source={require('../assets/icons/logo.png')} contentFit="contain" style={{height: 140, width: 140}}/>  */}
          <Text className="font-nt_bold text-2xl">Your Mind, Your Space</Text>
          <Text className="font-funnel_regular text-sm text-gray-600 text-center">A safe space in your pocket, where guidance{'\n'} and care are always with you. </Text>
        </View>
        <View className="flex-2 w-full items-center justify-center gap-4">
          <Button text="Continue" fontStyle="font-nt_semi" style="bg-white h-20" onPress={() => router.replace('/home')}/>
          {/* <Button text="Continue with Google" fontStyle="font-nt_semi" style="bg-white h-20" icon={require('../assets/icons/google.png')}/>*/}
          <Text className="text-xs text-gray-600 font-nt_regular">version 1.0</Text>
        </View>
      </View>
      
    </GradientBackground>
  )
}