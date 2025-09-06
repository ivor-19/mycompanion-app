import { FONT } from '@/lib/scale'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import * as Linking from "expo-linking"
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import RemixIcon from 'react-native-remix-icon'
import Separator from '../Separator'

type Details = {
  title?: string
  address?: string
  contact?: string
  hours?: string
  latitude?: number
  longitude?: number
}

interface Props {
  details: Details
  open: boolean,
  onClose: () => void,
  onLocationPress?: (latitude: number, longitude: number ) => void
}

export default function InfoBottomSheet({ details, open, onClose, onLocationPress }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['50%', '75%', '100%'], [])

  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.snapToIndex(1) // open at 75%
    } else {
      bottomSheetRef.current?.close()
    }
  }, [open])

  const handleLocatePress = async () => {
    if(details?.latitude && details?.longitude && onLocationPress){
      onLocationPress(details.latitude, details.longitude)
      bottomSheetRef.current?.close()
    }
  }

  // 👇 Backdrop component
  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close" // tap backdrop to close
    />
  ), [])

  return (
    <BottomSheet
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      enableContentPanningGesture={false}
      enablePanDownToClose={false}
      index={-1}
      onClose={onClose}
      backdropComponent={renderBackdrop} // ✅ apply backdrop
    >
      <View className='flex-1 p-4'> 
        <View className="flex-row items-center gap-2">
          <RemixIcon name="list-check-2" size={20} color="#FF90BC"/>
          <Text className="font-nt_semi flex-1" style={{fontSize: FONT.sm}}> Location Info </Text>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
            <RemixIcon name="close-line" size={20} color="#6b7280"/>
          </TouchableOpacity>
        </View>
        
        <Separator />
        
        <BottomSheetScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="p-3 gap-3">
  {/* Header */}
  <View className="flex-row items-center gap-3">
    <Image source={require('@/assets/images/hospital.png')} style={{height: 36, width: 36}}/>
    <View className="flex-1">
      <Text className="font-funnel_semi" style={{fontSize: FONT.sm}}>{details?.title}</Text>
      <Text className="font-funnel_regular text-gray-600" style={{fontSize: FONT.xs}}>{details?.address}</Text>
    </View>
  </View>

  {/* Info List */}
  <View className="bg-white rounded-xl border border-gray-200">
    {details?.hours && (
      <View className="flex-row items-center gap-2 p-3 border-b border-gray-100">
        <RemixIcon name="time-line" size={18} color="gray"/>
        <Text className="font-funnel_regular text-gray-700 flex-1" style={{fontSize: FONT.xs}}>
          {details?.hours}
        </Text>
      </View>
    )}
    {details?.contact && (
      <View className="flex-row items-center gap-2 p-3">
        <RemixIcon name="phone-line" size={18} color="gray"/>
        <Text className="font-funnel_regular text-gray-700 flex-1" style={{fontSize: FONT.xs}}>
          {details?.contact}
        </Text>
      </View>
    )}
  </View>

  {/* Actions */}
  <View className="flex-row gap-2">
    <TouchableOpacity
      onPress={handleLocatePress}
      className="flex-1 flex-row items-center justify-center gap-1 p-3 rounded-lg border border-gray-200 bg-white"
      activeOpacity={0.8}
    >
      <RemixIcon name="focus-3-fill" size={18} color="gray"/>
      <Text className="font-funnel_semi text-gray-600" style={{fontSize: FONT.xs}}>Locate</Text>
    </TouchableOpacity>

    {details?.contact && (
      <TouchableOpacity
        onPress={() => Linking.openURL(`tel:${details?.contact}`)}
        className="flex-1 flex-row items-center justify-center gap-1 p-3 rounded-lg bg-[#FF90BC]"
        activeOpacity={0.8}
      >
        <RemixIcon name="phone-fill" size={18} color="white"/>
        <Text className="font-funnel_semi text-white" style={{fontSize: FONT.xs}}>Call</Text>
      </TouchableOpacity>
    )}
  </View>
</View>

        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  )
}
