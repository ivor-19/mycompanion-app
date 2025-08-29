// Option 3: Updated MoodLayout
import PageLayout from "@/components/custom/layout/PageLayout";
import MoodTab from "@/components/custom/MoodTab";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function MoodLayout() {
  return(
    <PageLayout headerTitle="Mood Tracker">
      <MoodTab />
      
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}}/>
          <Stack.Screen name="daily-mood" options={{headerShown: false}}/>
          <Stack.Screen name="weekly-mood" options={{headerShown: false}}/>
          <Stack.Screen name="monthly-mood" options={{headerShown: false}}/>
        </Stack> 

      <StatusBar style="auto" />
    </PageLayout>
  )
}