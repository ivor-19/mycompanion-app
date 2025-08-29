import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FloatingBlobProps {
  size?: number;
  colors: [string, string, ...string[]]; // At least 2 colors required
  duration?: number;
  opacity?: number;
  initialPosition?: { translateX: number; translateY: number };
}

const FloatingBlob: React.FC<FloatingBlobProps> = ({
  size = 120,
  colors,
  duration = 4000,
  opacity = 1,
  initialPosition
}) => {
  // Generate random animation values
  const generateRandomValues = () => {
    const padding = size;
    const maxX = screenWidth - size - padding;
    const maxY = screenHeight - size - padding;
    
    return {
      translateX: Math.random() * maxX,
      translateY: Math.random() * maxY,
      scale: 0.8 + Math.random() * 0.6,
      rotate: `${Math.random() * 360}deg`,
      borderRadius: size / 2 + Math.random() * 20 - 10,
    };
  };

  // Generate initial position if not provided
  const getInitialPosition = () => {
    if (initialPosition) return initialPosition;
    
    const padding = size;
    const maxX = screenWidth - size - padding;
    const maxY = screenHeight - size - padding;
    
    return {
      translateX: Math.random() * maxX,
      translateY: Math.random() * maxY,
    };
  };

  // Generate random duration for varied animation speeds
  const getRandomDuration = () => {
    return duration + Math.random() * 2000 - 1000;
  };

  // Initialize with first target position immediately
  const [animationConfig, setAnimationConfig] = useState(() => generateRandomValues());

  useEffect(() => {
    const animateToNext = () => {
      const newConfig = generateRandomValues();
      setAnimationConfig(newConfig);
      
      // Schedule next animation
      setTimeout(animateToNext, getRandomDuration());
    };

    // Start first animation cycle immediately
    setTimeout(animateToNext, getRandomDuration());
  }, []);

  return (
    <MotiView
      from={{
        ...getInitialPosition(),
        scale: 0.5,
        rotate: '0deg',
      }}
      animate={animationConfig}
      transition={{
        type: 'timing',
        duration: getRandomDuration(),
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        opacity: opacity,
        shadowColor: colors[0],
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
        }}
      />
    </MotiView>
  );
};

export default FloatingBlob;