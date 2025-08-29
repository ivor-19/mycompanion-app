import { router } from "expo-router";
import { MotiView } from "moti";
import React from 'react';
import { Dimensions, TouchableOpacity, View } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import RemixIcon from "react-native-remix-icon";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GestureContext extends Record<string, unknown> {
  startX: number;
  startY: number;
}

export default function ChatBot() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // Track if we're dragging to prevent navigation on drag
  const isDragging = useSharedValue(false);

  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      isDragging.value = false;
    },
    onActive: (event, context) => {
      // Mark as dragging if moved significantly
      if (Math.abs(event.translationX) > 10 || Math.abs(event.translationY) > 10) {
        isDragging.value = true;
      }
      
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      // Limit horizontal movement to left-2 and right-2 equivalent (8px from edges)
      const margin = 8; // Tailwind left-2/right-2 is 8px
      const maxX = screenWidth / 20 - margin;
      const minX = -screenWidth / 2 - margin;
      
      if (translateX.value > maxX) {
        translateX.value = withSpring(maxX);
      } else if (translateX.value < minX) {
        translateX.value = withSpring(minX);
      }
      
      // Keep within vertical bounds  
      const maxY = screenHeight / 2 - 450;
      const minY = -screenHeight / 2 + 100;
      
      if (translateY.value > maxY) {
        translateY.value = withSpring(maxY);
      } else if (translateY.value < minY) {
        translateY.value = withSpring(minY);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handlePress = () => {
    // Only navigate if we weren't dragging
    if (!isDragging.value) {
      router.push('/support');
    }
  };

  return(
    <View className="absolute bottom-48 right-10">
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={animatedStyle}>
          <MotiView
            from={{
              translateY: 0,
            }}
            animate={{
              translateY: [-8, 8],
            }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
              repeatReverse: true,
            }}
          >
            <TouchableOpacity 
              onPress={handlePress}
              className="items-center justify-center p-4 bg-[#f5576c] border-2 border-gray-100" 
              style={{elevation: 4, shadowColor: 'gray', borderRadius: 50}} 
              activeOpacity={0.6}
            >
              <RemixIcon name="chat-voice-ai-fill" color="white"/>
            </TouchableOpacity>
          </MotiView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}