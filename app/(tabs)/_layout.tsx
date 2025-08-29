import ChatBot from "@/components/custom/ChatBot";
import { Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function TabsLayout() {

  return (
    <>
      <Tabs screenOptions={{
        tabBarShowLabel: false, 
        tabBarLabelStyle: { margin: 6 }, 
        tabBarItemStyle: { padding: 12 }, 
        tabBarStyle: {
          height: 70, 
          marginHorizontal: 8, 
          bottom: 60, 
          borderRadius: 28,
          backgroundColor: '#f5576c'

        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#EEEEEE',
        tabBarButton: (props) => { // Disable riffle effect
          const { ref, ...pressableProps } = props as any;
          return (
           <Pressable {...pressableProps} android_ripple={null} />
          );
        },
        //  tabBarBackground: '#f5576c'
        //  tabBarBackground: () => (
        //   <LinearGradient
        //     colors={['#f5576c', '#FFCCDD']} 
        //     start={{ x: 0, y: 0 }}
        //     end={{ x: 1, y: 1 }}
        //     style={{
        //       flex: 1,
        //       borderRadius: 28,
        //     }}
        //   />
        // ),
      }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View className={`${focused && 'p-3 bg-[#f53d56]'}`} style={{borderRadius: 50}}>
                <RemixIcon name={focused ? 'home-fill' : 'home-line'} color={color} size={24}/>
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="(mood-tracker)"
          options={{
            title: 'Mood Tracker',
            headerShown: false,
             tabBarIcon: ({ color, focused }) => (
              <View className={`${focused && 'p-3 bg-[#f53d56]'}`} style={{borderRadius: 50}}>
                <RemixIcon name={focused ? 'pulse-fill' : 'pulse-line'} color={color} size={24}/>
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="hotlines"
          options={{
            title: 'Hotlines',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View className={`${focused && 'p-3 bg-[#f53d56]'}`} style={{borderRadius: 50}}>
                <RemixIcon name={focused ? 'map-pin-fill' : 'map-pin-line'} color={color} size={24}/>
              </View>
            )
          }}
        />
      </Tabs>  
      <ChatBot />
    </>
  );
}
