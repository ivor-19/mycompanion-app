import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

interface Props {
  name: string;
  contact?: string;
  type: 'hospital' | 'police-station';
  address?: string;
}

export default function EmergencyContact({ name, contact, type, address }: Props) {
  const image = type === 'hospital' 
    ? require('@/assets/images/hospital.png')
    : require('@/assets/images/police-station.png');

  return (
    <View className="w-full rounded-xl flex-row items-center border-2 border-gray-100 bg-white p-4 gap-4" style={{elevation: 4, shadowColor: 'gray'}}>
      <Image source={image} style={{height: 50, width: 50}} />
      
      <View className="flex-1">
        <Text className="font-nt_semi text-sm leading-4">{name}</Text>
        {contact && <Text className="font-funnel_regular text-xs">{contact}</Text>}
        {address && <Text className="font-funnel_regular text-xs">{address}</Text>}
      </View>
      
      <View className="flex-row gap-4">
        {contact &&
          <TouchableOpacity activeOpacity={0.6}>
            <RemixIcon name="map-pin-2-fill" size={24} color="#f5576c" />
          </TouchableOpacity>
        }
        {address && 
          <TouchableOpacity activeOpacity={0.6}>
            <RemixIcon name="map-pin-2-fill" size={24} color="#f5576c" />
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}