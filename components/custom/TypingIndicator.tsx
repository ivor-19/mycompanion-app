import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface TypingIndicatorProps {
  dotColors?: string[]; // array of colors to cycle through
  dotSize?: number;
  animationSpeed?: number;
  style?: object;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  dotColors = ["#007AFF", "#FF6B6B", "#4ECDC4"], // default 3 colors
  dotSize = 8,
  animationSpeed = 600,
  style,
}) => {
  const animValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: animationSpeed,
            useNativeDriver: false, // color animation can't use native driver
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: animationSpeed,
            useNativeDriver: false,
          }),
        ])
      );
    };

    const animations = animValues.map((anim, i) =>
      createAnimation(anim, i * animationSpeed)
    );

    Animated.parallel(animations).start();

    return () => {
      animations.forEach((a) => a.stop && a.stop());
    };
  }, [animValues, animationSpeed]);

  const getDotStyle = (animValue: Animated.Value, color: string) => ({
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    marginHorizontal: 3,
    backgroundColor: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#D3D3D3", color], // gray → color
    }),
  });

  return (
    <View style={[styles.container, style]}>
      {animValues.map((anim, i) => (
        <Animated.View key={i} style={getDotStyle(anim, dotColors[i % dotColors.length])} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TypingIndicator;
