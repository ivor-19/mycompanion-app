import Card from "@/components/custom/Card";
import CustomHeader from "@/components/custom/CustomHeader";
import EmergencySheet from "@/components/custom/hotlines/EmergencySheet";
import ViewLocationInfo from "@/components/custom/hotlines/ViewLocationInfo";
import { markers } from "@/helper/locationMarkers";
import { FONT } from "@/lib/scale";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Hotlines() {
  const [listOpen, setListOpen] = useState(false)
  const [viewLocationOpen, setViewLocationOpen] = useState(false)
  const [locationDetails, setLocationDetails] = useState({})
  const mapRef = useRef<MapView>(null)

  const isFocused = useIsFocused();

  if (!isFocused) {
    return null; // unmount map completely when not focused
  }

  const handleLocationPress = (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.01, // Zoom in closer
      longitudeDelta: 0.01,
    }, 1000); // Animation duration in ms
  }

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
            ref={mapRef}
            style={{width: '100%', height: "100%"}}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 14.5995, // Center of Philippines
              longitude: 120.9842,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude}}              
                title={marker.title}
                description={marker.address}
                onPress={() => {setViewLocationOpen(true), setLocationDetails({title: marker.title, address: marker.address})}}
              >
            
                <Image source={marker.image} style={{height: 30, width: 30}}/>
               
              </Marker>
            ))}
          </MapView>
          
        </View>
        <TouchableOpacity onPress={() => setListOpen(true)} activeOpacity={0.8} className="absolute bottom-6 items-center justify-center p-2 w-[95%] bg-white rounded-2xl border-2 border-gray-100" style={{elevation: 4, shadowColor: 'gray'}}>
          <RemixIcon name="arrow-up-wide-line"/>
        </TouchableOpacity>
      </View>

    
      <EmergencySheet isOpen={listOpen} setIsOpen={setListOpen} onLocationPress={handleLocationPress}/>
       <ViewLocationInfo isOpen={viewLocationOpen} setIsOpen={setViewLocationOpen} details={locationDetails}/>
    </SafeAreaView>
  )
}