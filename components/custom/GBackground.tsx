import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import FloatingBlob from "./FloatingBlob";

interface Props {
  children: React.ReactNode;
  showBubbles?: boolean;
  bubbleCount?: number;
}

export default function GBackground({ children, showBubbles, bubbleCount = 2 }: Props) {
  const bubbleColors = ['#f5576c70', '#6ed0d0'];
  const bubbleSizes = [10, 20, 30];
  
  const generateBubbles = () => {
    const bubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
      const colorIndex = i % bubbleColors.length;
      const sizeIndex = i % bubbleSizes.length;
      
      bubbles.push(
        <FloatingBlob 
          key={i}
          colors={[bubbleColors[colorIndex], 'transparent']} 
          size={bubbleSizes[sizeIndex]} 
          duration={10000}
        />
      );
    }
    return bubbles;
  };

  return (
    <LinearGradient
      colors={["#FCF5FF", "#FAF0FF", "#F8BDE3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 w-full"
    >
      {showBubbles && (
        <View className="flex-1 relative">
          {generateBubbles()}
        </View>
      )}
      {children}
    </LinearGradient>
  );
}