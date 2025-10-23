import { FONT } from "@/lib/scale";
import { useColorModeStore } from "@/stores/colorModeStore";
import { useThemeStore } from "@/stores/themeStore";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { scale } from "react-native-size-matters";

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
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()
  const image = type === 'hospital' 
    ? require('@/assets/images/hospital.png')
    : require('@/assets/images/police-station.png');

  const handleLocationPress = () => {
    if(details?.latitude && details?.longitude && onLocationPress){
      onLocationPress(details.latitude, details.longitude)
    }
  }

  return (
    <View className="w-full rounded-xl flex-row items-center p-4 gap-4" style={{elevation: 4, shadowColor: 'gray', backgroundColor: mode.main, borderWidth: 1, borderColor: mode.neutral}}>
      {/* <Image source={image} style={{height: 50, width: 50}} /> */}
      
      <View className="flex-1 gap-2">
        <Text className="font-nt_semi text-sm leading-4" style={{color: mode.textPrimary}}>{details?.title}</Text>
        <View>
          {details?.contact && 
            <View className="flex-row items-start">
              <RemixIcon name="phone-fill" size={scale(10)} color="gray" />
              <Text className="ml-1 font-funnel_regular text-gray-600" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>{details?.contact}</Text>
            </View>
          }
          {details?.address && 
            <View className="flex-row items-start">
              <RemixIcon name="map-pin-2-fill" size={scale(10)} color="gray" />
              <Text className="ml-1 font-funnel_regular text-gray-600" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>{details?.address}</Text>
            </View>
          }
        </View>
      </View>
      
      <View className="flex-row">
        {details?.contact &&
          <TouchableOpacity activeOpacity={0.6}  onPress={() => Linking.openURL(`tel:${details?.contact}`)}>
            <RemixIcon name="phone-fill" size={scale(18)} color={theme.primary} />
          </TouchableOpacity>
        }
        {details?.address && details?.latitude && details?.longitude &&
          <TouchableOpacity activeOpacity={0.6} onPress={handleLocationPress}>
            <RemixIcon name="map-pin-2-fill" size={scale(18)} color={theme.primary} />
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}