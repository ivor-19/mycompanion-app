import { ActionSheet, ActionSheetClose, ActionSheetContent, ActionSheetExpand, ActionSheetHeader } from "@/components/ui/action-sheet";
import { FONT } from "@/lib/scale";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

type Details = {
  title?: string
  address?: string
  contact?: string
  hours?: string
}

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; 
  details?: Details
}

export default function ViewLocationInfo({isOpen, setIsOpen, details}: Props) {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null; // unmount map completely when not focused
  }

  return(
    <ActionSheet open={isOpen} onOpenChange={setIsOpen}>
      <ActionSheetContent>
        <ActionSheetHeader>
          <View className="flex-row gap-2">
            {/* <RemixIcon name="phone-fill" size={20} color="#f5576c"/> */}
            <Text className="font-nt_semi" style={{fontSize: FONT.md}}>Location Details</Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <ActionSheetExpand />
            <ActionSheetClose onClose={() => setIsOpen(false)} />
          </View>
          
        </ActionSheetHeader>

        <ScrollView contentContainerStyle={{flexGrow: 1, gap: 30, padding: 10}}>
          <View className="flex-row gap-4 items-center">
            <Image source={require('@/assets/images/hospital.png')} style={{height: 40, width: 40}}/>
            <View className="w-[80%]">
              <Text className="font-funnel_semi" style={{fontSize: FONT.md}}>{details?.title}</Text>
              <Text className="font-funnel_regular" style={{fontSize: FONT.xs}}>{details?.address}</Text>
            </View>
          </View>
        
          <View className='pb-20 gap-2'>
            {details?.hours &&   
              <View className="flex-row items-center gap-2 p-6 border border-gray-200 rounded-2xl bg-white">
                <RemixIcon name="time-line" size={20}/>
                <View className="flex-1">
                  <Text className="font-funnel_semi" style={{fontSize: FONT.sm}}>Hours</Text>
                  <Text className="font-funnel_regular" style={{fontSize: FONT.xs}}>{details?.hours}</Text>
                </View>
              </View>
            }
            {details?.contact &&
              <>
                <View className="flex-row items-center gap-2 p-6 border border-gray-200 rounded-2xl bg-white">
                  <RemixIcon name="phone-line" size={20}/>
                  <View className="flex-1">
                    <Text className="font-funnel_semi" style={{fontSize: FONT.sm}}>Contact number</Text>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xs}}>{details?.contact}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${details?.contact}`)} className="flex-row gap-2 items-center justify-center p-4 rounded-xl border border-gray-200 bg-[#FF90BC] mb-10" activeOpacity={0.8}>
                  <RemixIcon name="phone-fill" size={24} color="white"/>
                  <Text className="font-funnel_semi text-white" style={{fontSize: FONT.sm}}>Call</Text>
                </TouchableOpacity>
              </>
            }
          </View>          
        </ScrollView>
      </ActionSheetContent>
    </ActionSheet>
  )
}