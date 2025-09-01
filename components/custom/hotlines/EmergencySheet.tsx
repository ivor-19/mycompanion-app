import {
  ActionSheet,
  ActionSheetClose,
  ActionSheetContent,
  ActionSheetExpand,
  ActionSheetHeader
} from "@/components/ui/action-sheet";
import { markers } from "@/helper/locationMarkers";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import EmergencyContact from "./EmergencyContact";

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onLocationPress: (latitude: number, longitude: number) => void
}

export default function EmergencySheet({isOpen, setIsOpen, onLocationPress}: Props) {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null; // unmount map completely when not focused
  }

  const handleLocationPress = (latitude: number, longitude: number) => {
    setIsOpen(false); // Close the sheet
    onLocationPress(latitude, longitude); // Navigate to the location
  };

  return(
    <ActionSheet open={isOpen} onOpenChange={setIsOpen}>
      <ActionSheetContent>
        <ActionSheetHeader>
          <View className="flex-row gap-2">
            <RemixIcon name="phone-fill" size={20} color="#f5576c"/>
            <Text className="font-nt_semi text-sm">Emergency Hotlines</Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <ActionSheetExpand />
            <ActionSheetClose onClose={() => setIsOpen(false)} />
          </View>
          
        </ActionSheetHeader>

        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View className='pb-20 gap-4'>
            {markers.map((marker, index) => (
              <View key={index}>
                <EmergencyContact 
                  details={marker} 
                  type="hospital"
                  onLocationPress={handleLocationPress}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </ActionSheetContent>
    </ActionSheet>
  )
}