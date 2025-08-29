import Card from "@/components/custom/Card";
import CustomHeader from "@/components/custom/CustomHeader";
import EmergencySheet from "@/components/custom/EmergencySheet";
import { Image } from "expo-image";

import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Hotlines() {
   const [isOpen, setIsOpen] = useState(false)

  const handleAction = (action: string) => {
    console.log(`Action selected: ${action}`)
    setIsOpen(false)
  }

  return(
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader title="Emergency Map"/>
      {/* Map Screen */}
      <View className="flex-1 w-full relative items-center">
        <Card className="flex-row items-center justify-between absolute top-2 bg-white w-[90%] rounded-full border-2 border-gray-100 z-10 py-2 px-6">
          <TextInput
            className="font-funnel_regular flex-1"
            placeholder="Ask me anything..."
            autoCapitalize="none"
          />
          <RemixIcon name="search-2-line" size={22} color="gray"/>
        </Card>
        <Image source={require('../../assets/images/map.png')} contentFit="cover" style={{height: '100%', width: '100%'}}/>
        <TouchableOpacity onPress={() => setIsOpen(true)} activeOpacity={0.8} className="absolute bottom-6 items-center justify-center p-2 w-[95%] bg-white rounded-2xl border-2 border-gray-100" style={{elevation: 4, shadowColor: 'gray'}}>
          <RemixIcon name="arrow-up-wide-line"/>
        </TouchableOpacity>
      </View>

    
      <EmergencySheet isOpen={isOpen} setIsOpen={setIsOpen}/>
    </SafeAreaView>
  )
}