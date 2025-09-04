import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import React from 'react';
import { Dimensions, TouchableOpacity } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scale } from "react-native-size-matters";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GestureContext extends Record<string, number> {
  startX: number;
  startY: number;
}

export default function ChatBot() {
  // Calculate the bottom limit position
  const bottomLimit = screenHeight / 2 - 370;
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(bottomLimit); // Initialize at bottom limit
     
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
      const maxY = screenHeight / 2 - 370;
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
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View style={[animatedStyle, { position: 'absolute', top: '70%', left: '80%' }]}>
        <LinearGradient
          colors={['#ffc2d1', '#FF90BC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{borderRadius: 50}}
        >
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="p-2 shadow-lg"
            >
              <Image source={require('@/assets/images/bot/icon.png')} style={{height: scale(36), width: scale(36)}}/>
            </MotiView>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </PanGestureHandler>
  )
}