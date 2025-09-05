import { FONT } from "@/lib/scale";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

type Details = {
  title?: string
  contact?: string
  address?: string
  latitude?: number
  longitude?: number
}

interface Props {
  details: Details
  type: 'hospital' | 'police-station'
  onLocationPress?: (latitude: number, longitude: number ) => void
}

export default function EmergencyContact({ details, type, onLocationPress }: Props) {
  const image = type === 'hospital' 
    ? require('@/assets/images/hospital.png')
    : require('@/assets/images/police-station.png');

  const handleLocationPress = () => {
    if(details?.latitude && details?.longitude && onLocationPress){
      onLocationPress(details.latitude, details.longitude)
    }
  }

  return (
    <View className="w-full rounded-xl flex-row items-center border-2 border-gray-100 bg-white p-4 gap-4" style={{elevation: 4, shadowColor: 'gray'}}>
      <Image source={image} style={{height: 50, width: 50}} />
      
      <View className="flex-1">
        <Text className="font-nt_semi text-sm leading-4">{details?.title}</Text>
        {details?.contact && <Text className="font-funnel_semi" style={{fontSize: FONT.xs}}>{details?.contact}</Text>}
        {details?.address && <Text className="font-funnel_regular" style={{fontSize: FONT.xxs}}>{details?.address}</Text>}
      </View>
      
      <View className="flex-row gap-4">
        {details?.contact &&
          <TouchableOpacity activeOpacity={0.6}  onPress={() => Linking.openURL(`tel:${details?.contact}`)}>
            <RemixIcon name="phone-fill" size={24} color="#FF90BC" />
          </TouchableOpacity>
        }
        {details?.address && details?.latitude && details?.longitude &&
          <TouchableOpacity activeOpacity={0.6} onPress={handleLocationPress}>
            <RemixIcon name="map-pin-2-fill" size={24} color="#FF90BC" />
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}