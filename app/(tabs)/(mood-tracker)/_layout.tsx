// Option 3: Updated MoodLayout
import GBackground from "@/components/custom/GBackground";
import PageLayout from "@/components/custom/layout/PageLayout";
import MoodTab from "@/components/custom/mood/MoodTab";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function MoodLayout() {
  return(
    <PageLayout headerTitle="Mood Tracker">
      <GBackground>

      <MoodTab />
      
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}}/>
          <Stack.Screen name="daily-mood" options={{headerShown: false}}/>
          <Stack.Screen name="weekly-mood" options={{headerShown: false}}/>
          <Stack.Screen name="monthly-mood" options={{headerShown: false}}/>
        </Stack> 
      </GBackground>

      <StatusBar style="auto" />
    </PageLayout>
  )
}