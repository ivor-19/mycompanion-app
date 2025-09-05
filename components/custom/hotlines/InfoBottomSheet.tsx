import { FONT } from '@/lib/scale'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import * as Linking from "expo-linking"
import { useEffect, useMemo, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import RemixIcon from 'react-native-remix-icon'
import Separator from '../Separator'

type Details = {
  title?: string
  address?: string
  contact?: string
  hours?: string
}

interface Props {
  details: Details
  open: boolean,
  onClose: () => void,
}


export default function InfoBottomSheet({ details, open, onClose }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['50%', '75%', '100%'], [])

  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.snapToIndex(1) // for example, 75%
    } else {
      bottomSheetRef.current?.close()
    }
  }, [open])
  

  return (
    <BottomSheet snapPoints={snapPoints} ref={bottomSheetRef} enableContentPanningGesture={false} enablePanDownToClose={false} index={-1} onClose={onClose}>
      <View className='flex-1 p-4'> 
        <View className="flex-row items-center gap-2">
          <RemixIcon name="list-check-2" size={20} color="#FF90BC"/>
          <Text className="font-nt_semi flex-1" style={{fontSize: FONT.sm}}> Location Info </Text>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
            <RemixIcon name="close-line" size={20} color="#6b7280"/>
          </TouchableOpacity>
        </View>
        
        <Separator />
        
        <BottomSheetScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} >
          <View className='gap-4 p-4'>
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
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  )
}