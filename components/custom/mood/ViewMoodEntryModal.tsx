import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { getEmojiByMood } from '@/helper/moodEmoji';
import { FONT } from '@/lib/scale';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, View } from 'react-native';
import RemixIcon from 'react-native-remix-icon';
import { scale } from 'react-native-size-matters';

type MoodsData = {
  moodText: string,
  date: string,
  day: string,
  time: string,
  note: string,
  images?: string[],
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  moodData?: MoodsData
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ViewMoodEntryModal({ open, setOpen, moodData }: Props) {
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!moodData) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
  }

  const openFullScreenImage = (imageUri: string, index: number) => {
    setFullScreenImage(imageUri);
    setCurrentImageIndex(index);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!moodData.images || moodData.images.length === 0) return;
    
    let newIndex = currentImageIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : moodData.images.length - 1;
    } else {
      newIndex = currentImageIndex < moodData.images.length - 1 ? currentImageIndex + 1 : 0;
    }
    
    setCurrentImageIndex(newIndex);
    setFullScreenImage(moodData.images[newIndex]);
  };

  return(
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent 
          className='items-center justify-center' 
          style={{
            width: scale(320),
            maxHeight: 'auto'
          }}
        >
          <AlertDialogHeader className='w-full'> 
            <View className='items-center gap-2' style={{ width: '100%' }}>
              <Image source={getEmojiByMood(moodData.moodText)} style={{height: 50, width: 50}}/>
              <AlertDialogTitle className='font-funnel_semi'>{moodData.moodText}</AlertDialogTitle>
              <View className="bg-orange-50 rounded-full px-6 py-3 mb-4">
                <Text className="font-nt_semi text-orange-800" style={{fontSize: FONT.xs}}>
                  {moodData.day}, {moodData.date}, {moodData.time}
                </Text>
              </View> 
            </View>
            
            <View className='gap-2'>
              <View className='flex-row gap-2 items-center'>
                <RemixIcon name='booklet-fill' size={16} color='#FF90BC'/>
                <Text className='font-nt_regular' style={{fontSize: FONT.xs}}>Note</Text>
              </View>
              <View className='w-full border-[1px] rounded-xl border-gray-300 p-3' style={{minHeight: 80}}>
                <Text className='font-nt_regular text-left text-gray-700' style={{fontSize: FONT.xs}}> {moodData.note} </Text>
              </View>
              
              {/* Photos section */}
              <View className='gap-2'>
                <View className='flex-row gap-2 items-center justify-between'>
                  <View className='flex-row gap-2 items-center'>
                    <RemixIcon name='image-fill' size={16} color='#FF90BC'/>
                    <Text className='font-nt_regular' style={{fontSize: FONT.xs}}>Captured Photo/s</Text>
                  </View>
                  {(moodData.images ?? []).length > 0 && 
                    <Text className='font-nt_regular' style={{fontSize: FONT.xs}}>{moodData.images?.length} Photo{(moodData.images ?? []).length > 1 ? 's' : ''}</Text>
                  }
                </View>
                <View className='w-full border-2 border-dashed rounded-xl border-gray-300 p-3 items-center' style={{minHeight: 60}}>
                  {(moodData.images ?? []).length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 8, paddingVertical: 10 }} >    
                      {moodData?.images?.map((imageUri, index) => (
                        <Pressable key={index} className='relative' onPress={() => openFullScreenImage(imageUri, index)} >
                          <Image 
                            source={{ uri: imageUri }} 
                            style={{ width: scale(70), height: scale(70), borderRadius: 12, backgroundColor: '#f3f4f6' }} 
                            contentFit="cover" 
                          />
                   
                          <View className='absolute inset-0 rounded-xl' style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />
                        </Pressable>
                      ))}
                    </ScrollView>
                  ):(
                    <Text className='font-nt_regular text-gray-500 text-center' style={{fontSize: FONT.xxs}}> No photos attached </Text>
                  )}
                </View>
              </View>
            </View>
          </AlertDialogHeader>
          
          <AlertDialogFooter className='flex-row w-full'>
            <AlertDialogAction className='flex-1 flex-row items-center justify-center bg-[#FF90BC]' onPress={handleClose} >
              <Text className='text-center font-nt_medium text-white'>Close</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Full Screen Image Modal */}
      <Modal visible={!!fullScreenImage} transparent={true} animationType="fade" statusBarTranslucent={true} onRequestClose={closeFullScreenImage} >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
          {/* Header with close button and image counter */}
          <View className='absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-4' style={{ paddingTop: 50, height: 100 }}>
            <Pressable onPress={closeFullScreenImage} className='p-2'>
              <RemixIcon name='close-line' size={24} color='white' />
            </Pressable>
            {moodData.images && moodData.images.length > 1 && (
              <Text className='text-white font-nt_regular' style={{ fontSize: FONT.sm }}> {currentImageIndex + 1} / {moodData.images.length} </Text>
            )}
          </View>

          {/* Main image container */}
          <View className='flex-1 justify-center items-center'>
            {fullScreenImage && (
              <Image
                source={{ uri: fullScreenImage }}
                style={{
                  width: screenWidth,
                  height: screenHeight * 0.8,
                }}
                contentFit="contain"
                onError={() => {
                  // Handle image loading error
                  console.log('Failed to load image');
                }}
              />
            )}
          </View>

          {/* Navigation arrows (only show if multiple images) */}
          {moodData.images && moodData.images.length > 1 && (
            <>
              <Pressable className='absolute left-4 top-1/2 p-3 rounded-full' style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', transform: [{ translateY: -20 }] }} onPress={() => navigateImage('prev')} > <RemixIcon name='arrow-left-s-line' size={24} color='white' /> </Pressable>

              <Pressable className='absolute right-4 top-1/2 p-3 rounded-full' style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', transform: [{ translateY: -20 }] }} onPress={() => navigateImage('next')} >
                <RemixIcon name='arrow-right-s-line' size={24} color='white' />
              </Pressable>
            </>
          )}

          <Pressable className='absolute bottom-0 left-0 right-0 p-4' onPress={closeFullScreenImage} style={{ height: 100 }} >
            <Text className='text-white text-center font-nt_regular' style={{ fontSize: FONT.xs }}> Tap to close </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  )
}