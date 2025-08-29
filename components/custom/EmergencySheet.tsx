import {
  ActionSheet,
  ActionSheetClose,
  ActionSheetContent,
  ActionSheetExpand,
  ActionSheetHeader
} from "@/components/ui/action-sheet";
import { ScrollView, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import EmergencyContact from "./EmergencyContact";

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; 
}

export default function EmergencySheet({isOpen, setIsOpen}: Props) {
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
            <EmergencyContact name="DOH – National Center for Mental Health (NCMH) Crisis Hotline" contact="1553 (toll-free, landline or cellphone, nationwide)" type="hospital"/>
            <EmergencyContact name="Harborview Police Department" contact="9039-452-2323" type="police-station"/>
            <EmergencyContact name="Harborview Police Department" contact="9039-452-2323" type="police-station"/>
            <EmergencyContact name="Harborview Police Department" contact="9039-452-2323" type="police-station"/>
            <EmergencyContact name="Harborview Police Department" contact="9039-452-2323" type="police-station"/>
            <EmergencyContact name="Harborview Police Department" contact="9039-452-2323" type="police-station"/>
            <EmergencyContact name="Harborview Police Department" contact="9039-452-2323" type="police-station"/>
          </View>
        </ScrollView>
      </ActionSheetContent>
    </ActionSheet>
  )
}