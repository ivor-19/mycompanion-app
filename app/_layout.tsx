import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useReminderStore } from "@/stores/reminderStore";
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initializeNotifications = useReminderStore((state) => state.initializeNotifications); // Add this
  const [fontsLoaded, error] = useFonts({
    "NataRegular": require("../assets/fonts/NataSans-Regular.ttf"),
    "NataMedium": require("../assets/fonts/NataSans-Medium.ttf"),
    "NataSemiBold": require("../assets/fonts/NataSans-SemiBold.ttf"),
    "NataBold": require("../assets/fonts/NataSans-Bold.ttf"),
    "CherryRegular": require("../assets/fonts/CherryBombOne-Regular.ttf"),
    "JerseyRegular": require("../assets/fonts/Jersey10-Regular.ttf"),

    "FunnelRegular": require("../assets/fonts/FunnelSans-Regular.ttf"),
    "FunnelSemibold": require("../assets/fonts/FunnelSans-SemiBold.ttf"),
    "FunnelMedium": require("../assets/fonts/FunnelSans-Medium.ttf"),
    "FunnelBold": require("../assets/fonts/FunnelSans-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) 
      SplashScreen.hideAsync();
      initializeNotifications(); 
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />

        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen name="onboarding" options={{ headerShown: false }}/>
            {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="support" options={{ headerShown: false }} />
        
          </Stack>
        </GestureHandlerRootView>
    
        <PortalHost />
  
    </SafeAreaProvider>
  );
}
