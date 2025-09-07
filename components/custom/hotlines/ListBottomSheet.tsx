import { markers } from '@/helper/locationMarkers'
import { FONT } from '@/lib/scale'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import RemixIcon from 'react-native-remix-icon'
import { scale } from 'react-native-size-matters'
import Separator from '../Separator'
import EmergencyContact from './EmergencyContact'

interface Props {
  onLocationPress: (latitude: number, longitude: number) => void
}

export default function ListBottomSheet({ onLocationPress }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['5%', '50%', '75%', '100%'], [])
  const [searchText, setSearchText] = useState('')
  const [filteredMarkers, setFilteredMarkers] = useState(markers)

  const handleLocationPress = (latitude: number, longitude: number) => {
    closeSheet()
    onLocationPress(latitude, longitude)
  }

  const closeSheet = () => {
    bottomSheetRef.current?.snapToIndex(0)
    setSearchText('')
    setFilteredMarkers(markers)
  }

  const handleSearchPress = () => {
    bottomSheetRef.current?.snapToIndex(3)
  }

  const handleSearchChange = (text: string) => {
    setSearchText(text)
    
    if (text.trim() === '') {
      setFilteredMarkers(markers)
    } else {
      const filtered = markers.filter(marker => 
        marker.title?.toLowerCase().includes(text.toLowerCase()) ||
        marker.address?.toLowerCase().includes(text.toLowerCase()) ||
        marker.contact?.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredMarkers(filtered)
    }
  }

  const clearSearch = () => {
    setSearchText('')
    setFilteredMarkers(markers)
  }

  // 👇 Add custom backdrop
  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={0}
      appearsOnIndex={1}
      pressBehavior="close" // tap backdrop to close
    />
  ), [])

  return (
    <BottomSheet 
      snapPoints={snapPoints} 
      ref={bottomSheetRef} 
      enableContentPanningGesture={false}
      index={0}
      handleIndicatorStyle={{ backgroundColor: '#000' }}
      backgroundStyle={{ backgroundColor: '#fff' }}
      backdropComponent={renderBackdrop} // ✅ apply backdrop
    >
      <View className='flex-1 p-4'> 
        <View className="flex-row items-center gap-2 mb-4">
          <RemixIcon name="list-check-2" size={scale(18)} color="#FF90BC"/>
          <Text className="font-nt_semi flex-1" style={{fontSize: FONT.sm}}>
            Available Clinics ({filteredMarkers.length})
          </Text>
          <TouchableOpacity onPress={closeSheet}>
            <RemixIcon name="close-line" size={scale(18)} color="#6b7280"/>
          </TouchableOpacity>
        </View>
        
        <Separator />
        
        <BottomSheetScrollView 
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="flex-row items-center bg-white w-full rounded-full border-2 border-gray-100 py px-4 mb-6 shadow-sm">
            <RemixIcon name="search-2-line" size={scale(16)} color="#6b7280" />
            <TextInput
              className="font-funnel_regular flex-1 text-black ml-3"
              placeholder="Search clinics, hospitals..."
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              style={{fontSize: FONT.xs}}
              value={searchText}
              onChangeText={handleSearchChange}
              onPressIn={handleSearchPress}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch} className="ml-2">
                <RemixIcon name="close-circle-fill" size={scale(16)} color="#6b7280"/>
              </TouchableOpacity>
            )}
          </View>     
          
          {filteredMarkers.length > 0 ? (
            <View className='gap-4'>
              {filteredMarkers.map((marker, index) => (
                <View key={`${marker.id || index}`}>
                  <EmergencyContact 
                    details={marker} 
                    type="hospital"
                    onLocationPress={handleLocationPress}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <RemixIcon name="search-line" size={48} color="#d1d5db" />
              <Text className="text-gray-500 font-funnel_regular mt-4" style={{fontSize: FONT.sm}}>
                No clinics found
              </Text>
              <Text className="text-gray-400 font-funnel_regular text-center mt-2" style={{fontSize: FONT.xs}}>
                Try searching with different keywords
              </Text>
              {searchText.length > 0 && (
                <TouchableOpacity 
                  onPress={clearSearch}
                  className="mt-4 bg-pink-100 px-4 py-2 rounded-full"
                >
                  <Text className="text-pink-600 font-funnel_medium" style={{fontSize: FONT.xs}}>
                    Clear Search
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  )
}
