import EmergencySheet from "@/components/custom/hotlines/EmergencySheet";
import ViewLocationInfo from "@/components/custom/hotlines/ViewLocationInfo";
import PageLayout from "@/components/custom/layout/PageLayout";
import { markers } from "@/helper/locationMarkers";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import RemixIcon from "react-native-remix-icon";

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
    <PageLayout headerTitle="Clinic Locations">
   
      {/* Map Screen */}
      <View className="flex-1 w-full relative items-center">
        <View className="min-h-screen w-full bg-gray-300">
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
    </PageLayout>
  )
}