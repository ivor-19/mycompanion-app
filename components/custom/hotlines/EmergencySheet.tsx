import {
  ActionSheet,
  ActionSheetClose,
  ActionSheetContent,
  ActionSheetExpand,
  ActionSheetHeader
} from "@/components/ui/action-sheet";
import { markers } from "@/helper/locationMarkers";
import { FONT } from "@/lib/scale";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, Text, TextInput, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import Card from "../Card";
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
            <RemixIcon name="list-check-2" size={20} color="#FF90BC"/>
            <Text className="font-nt_semi" style={{fontSize: FONT.sm}}>Available Clinic</Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <ActionSheetExpand />
            <ActionSheetClose onClose={() => setIsOpen(false)} />
          </View>
          
        </ActionSheetHeader>

        <ScrollView contentContainerStyle={{flexGrow: 1}}>
           <Card className="flex-row items-center justify-between bg-white w-full rounded-full border-2 border-gray-100 z-10 py-2 px-6 mb-6">
            <TextInput
              className="font-funnel_regular flex-1 text-black"
              placeholder="Search..."
              placeholderTextColor={'gray'}
              autoCapitalize="none"
              style={{fontSize: FONT.xs}}
            />
            <RemixIcon name="search-2-line" size={22} color="gray"/>
          </Card>
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