import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingBlob from "./FloatingBlob";

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export default function GradientBackground({children}: GradientBackgroundProps) {
  return(
    <SafeAreaView className="min-h-screen">
      <LinearGradient
        colors={['transparent', '#f5576c']}
        start={{ x: 0, y: 1 }} 
        end={{ x: 0, y: 0 }}   
        className="absolute top-0 w-full h-[300px] opacity-20"
        
      />
      
      <LinearGradient
        colors={['transparent', '#f5576c']}
        start={{ x: 0, y: 0 }} 
        end={{ x: 0, y: 2 }}   
        className="absolute bottom-0 w-full h-[300px] opacity-90"
        
      />

      <View>
        <FloatingBlob colors={['#f5576c70', 'transparent']} size={10} duration={10000}/>
        <FloatingBlob colors={['#6ed0d0', 'transparent']} size={30} duration={10000}/>
        <FloatingBlob colors={['#f5576c70', 'transparent']} size={20} duration={10000}/>
        <FloatingBlob colors={['#6ed0d0', 'transparent']} size={10} duration={10000}/>
        <FloatingBlob colors={['#f5576c70', 'transparent']} size={20} duration={10000}/>
        <FloatingBlob colors={['#f5576c70', 'transparent']} size={30} duration={10000}/>
        <FloatingBlob colors={['#6ed0d0', 'transparent']} size={10} duration={10000}/>
        <FloatingBlob colors={['#f5576c70', 'transparent']} size={20} duration={10000}/>
      </View>
      {children}
    </SafeAreaView>
  )
}