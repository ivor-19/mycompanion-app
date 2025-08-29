import Button from "@/components/custom/Button";
import GBackground from "@/components/custom/GBackground";
import PageLayout from "@/components/custom/layout/PageLayout";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function Home() {
  return (
    <PageLayout>
      <GBackground>
        <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
          <View className="min-h-screen items-center w-full gap-4">
            <View className="bg-white min-h-48 rounded-b-[30px] pt-4 px-6 pb-6 flex-col gap-4 w-full" style={{elevation: 4, shadowColor: 'gray'}}>
              <View className="flex-row justify-between">
                <View className="justify-center">
                  <Text className="font-funnel_bold text-2xl">My Companion</Text>
                  <Text className="font-funnel_regular text-xs">A Mobile-Based Psychological Support Sytem</Text>
                </View>
                <View className="flex-row gap-2 items-center">
                  <RemixIcon name="shield-check-fill" size={16} color="#6ed0d0"/>
                  <Text className="font-funnel_regular text-xs">Secure & Private</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="h-16 w-16" style={{borderRadius: '100%'}}>
                  <Image source={require('../../assets/images/bot/head-nobg.png')} contentFit="contain" style={{width: '100%', height: '100%', borderRadius: 60}}/> 
                </View>
                <View>
                  <Text className="font-funnel_semi">Welcome Back!</Text>
                  <Text className="font-funnel_regular">How are you feeling today?</Text>
                </View>
              </View>
            
            </View>
            <LinearGradient
              colors={['#f5576c', '#FF9A8B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 30 }}
              className="h-80 p-6 w-[95%] flex-row items-center"
            >
              {/* Left side: Avatar */}
              <View className="w-[40%] h-full flex items-center justify-end ">
                <Image
                  source={require('../../assets/images/bot/full-body.png')}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>

              {/* Right side: Text + Button */}
              <View className="w-[60%] flex-col justify-center items-end gap-4 ">
                <View className="flex-col gap-2"> 
                  <Text className="font-cb text-white text-[26px] leading-7 text-right">A SAFE SPACE FOR YOUR THOUGHTS</Text>
                  <Text className="font-funnel_regular text-right text-white text-[14px] leading-5 opacity-90">
                    Begin your journey to better mental wellness today
                  </Text>
                </View>
                <Button text="Chat Now" style="h-12 w-[8em] bg-[#f5576c]" fontStyle="text-sm text-white" onPress={() => router.push('/home')}/>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </GBackground>
    </PageLayout>
  );
}

