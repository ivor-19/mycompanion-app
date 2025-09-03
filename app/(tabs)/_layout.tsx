import ChatBot from "@/components/custom/ChatBot";
import { Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { scale } from "react-native-size-matters";

export default function TabsLayout() {

  return (
    <>
     <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarLabelStyle: { margin: 6 },
          tabBarItemStyle: { padding: 12 },
          tabBarStyle: {
            borderTopWidth: 2,
            borderColor: '#F2F2F2',
            height: 120,
          },
          tabBarActiveTintColor: '#FF90BC',
          tabBarInactiveTintColor: '#E3E3E3',
          tabBarButton: (props) => {
            const { ref, ...pressableProps } = props as any;
            return <Pressable {...pressableProps} android_ripple={null} />;
          },
        }}
      >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ borderRadius: 50, padding: focused ? 10 : 0, }} >
              <RemixIcon name={focused ? 'home-6-fill' : 'home-6-line'} color={color} size={focused ? scale(28) : scale(22)} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="(mood-tracker)"
        options={{
          title: 'Mood Tracker',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ borderRadius: 50, padding: focused ? 10 : 0, }} >
              <RemixIcon name={focused ? 'emoji-sticker-fill' : 'emoji-sticker-line'} color={color} size={focused ? scale(28) : scale(22)} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="hotlines"
        options={{
          title: 'Hotlines',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ borderRadius: 50, padding: focused ? 10 : 0, }} >
              <RemixIcon name={focused ? 'map-pin-fill' : 'map-pin-line'} color={color} size={focused ? scale(28) : scale(22)} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ borderRadius: 50, padding: focused ? 10 : 0, }} >
              <RemixIcon name={focused ? 'settings-3-fill' : 'settings-3-line'} color={color} size={focused ? scale(28) : scale(22)} />
            </View>
          ),
        }}
      />
    </Tabs>

      <ChatBot />
    </>
  );
}
