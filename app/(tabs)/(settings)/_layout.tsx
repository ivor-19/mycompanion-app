import GBackground from "@/components/custom/GBackground";
import PageLayout from "@/components/custom/layout/PageLayout";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function MoodLayout() {
  return(
    <PageLayout headerTitle="Settings">
      <GBackground>
        <Stack>
          <Stack.Screen name="settings" options={{headerShown: false}}/>
        </Stack> 
      </GBackground>

      <StatusBar style="auto" />
    </PageLayout>
  )
}