import Card from "@/components/custom/Card";
import CustomHeader from "@/components/custom/CustomHeader";
import EmergencySheet from "@/components/custom/EmergencySheet";
import { FONT } from "@/lib/scale";
import { Image } from "expo-image";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Hotlines() {
   const [isOpen, setIsOpen] = useState(false)

  const handleAction = (action: string) => {
    console.log(`Action selected: ${action}`)
    setIsOpen(false)
  }

  const markers = [
    {
      id: 1,
      coordinate: { latitude: 14.5995, longitude: 120.9842 },
      title: "Manila",
      description: "Capital of the Philippines",
      image: require('@/assets/images/hospital.png')
    },
    {
      id: 2,
      coordinate: { latitude: 10.3157, longitude: 123.8854 },
      title: "Cebu City",
      description: "Queen City of the South",
      image: require('@/assets/images/police-station.png')
    },
    {
      id: 3,
      coordinate: { latitude: 7.0731, longitude: 125.6128 },
      title: "Davao City",
      description: "Durian Capital",
      image: require('@/assets/images/hospital.png')
    },
    {
      id: 4,
      coordinate: { latitude: 15.4818, longitude: 120.5979 },
      title: "Angeles City",
      description: "Entertainment Capital of Central Luzon",
      image: require('@/assets/images/police-station.png')
    }
  ];

  return(
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader title="Emergency Map"/>
      {/* Map Screen */}
      <View className="flex-1 w-full relative items-center">
        <Card className="flex-row items-center justify-between absolute top-2 bg-white w-[90%] rounded-full border-2 border-gray-100 z-10 py-2 px-6">
          <TextInput
            className="font-funnel_regular flex-1 text-black"
            placeholder="Search..."
            placeholderTextColor={'gray'}
            autoCapitalize="none"
            style={{fontSize: FONT.xs}}
          />
          <RemixIcon name="search-2-line" size={22} color="gray"/>
        </Card>
        <View className="w-full h-full bg-gray-300">
         <MapView
            style={{width: '100%', height: "100%"}}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 14.5995, // Center of Philippines
              longitude: 120.9842,
              latitudeDelta: 8.0, // Zoom level to show most of Philippines
              longitudeDelta: 8.0,
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
              >
                <Image source={marker.image} style={{height: 30, width: 30}}/>
              </Marker>
            ))}
          </MapView>
          
        </View>
        {/* <Image source={require('../../assets/images/map.png')} contentFit="cover" style={{height: '100%', width: '100%'}}/> */}
        <TouchableOpacity onPress={() => setIsOpen(true)} activeOpacity={0.8} className="absolute bottom-6 items-center justify-center p-2 w-[95%] bg-white rounded-2xl border-2 border-gray-100" style={{elevation: 4, shadowColor: 'gray'}}>
          <RemixIcon name="arrow-up-wide-line"/>
        </TouchableOpacity>
      </View>

    
      <EmergencySheet isOpen={isOpen} setIsOpen={setIsOpen}/>
    </SafeAreaView>
  )
}