import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { getEmojiByMood } from '@/helper/moodEmoji';
import { FONT } from '@/lib/scale';
import { useMoodStore } from '@/stores/moodStore';
import { useTimeStore } from '@/stores/timeStore';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Keyboard, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import RemixIcon from 'react-native-remix-icon';
import { scale } from 'react-native-size-matters';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  moodText: string
}

export default function MoodEntryModal({ open, setOpen, moodText }: Props) {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { currentTime, currentDay, currentDate } = useTimeStore()
  const { addMood } = useMoodStore()
  const [note, setNote] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Request permissions on component mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and photo library permissions to add images to your mood entries.',
        [{ text: 'OK' }]
      );
    }
  };

  // const showImagePickerOptions = () => {
  //   Alert.alert(
  //     'Add Photo',
  //     'Choose how you want to add a photo',
  //     [
  //       {
  //         text: 'Camera',
  //         onPress: takePhoto,
  //       },
  //       {
  //         text: 'Photo Library',
  //         onPress: pickFromGallery,
  //       },
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //     ]
  //   );
  // };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using MediaTypeOptions for compatibility
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage = result.assets[0].uri;
        setSelectedImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using MediaTypeOptions for compatibility
        // Removed allowsEditing since it conflicts with allowsMultipleSelection
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5 - selectedImages.length, // Limit total images to 5
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // Ensure max 5 images
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert('Error', 'Failed to select images');
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveMood = async () => {
    try {
      addMood(
        moodText,
        currentDate,
        currentDay,
        currentTime,
        note || 'No note added',
        selectedImages 
      )

      // Reset form
      setNote('')
      setSelectedImages([])
      setOpen(false)
    } catch (error) {
      console.error("Error occurred: ", error)
      Alert.alert('Error', 'Failed to save mood entry')
    }
  }

  const handleCancel = () => {
    setNote('')
    setSelectedImages([])
    setOpen(false)
  }
  
  return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent 
        className='items-center justify-center' 
        style={{
          width: scale(320),
          marginBottom: keyboardHeight > 0 ? keyboardHeight / 2 : 0,
          maxHeight: keyboardHeight > 0 ? '70%' : 'auto'
        }}
      >
        <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" >
          <AlertDialogHeader className='w-full'> 
            <View className='items-center gap-2' style={{ width: '100%' }}>
              <Image source={getEmojiByMood(moodText)} style={{height: 50, width: 50}}/>
              <AlertDialogTitle className='font-funnel_semi'>{moodText}</AlertDialogTitle>
              <View className="bg-orange-50 rounded-full px-6 py-3 mb-4">
                <Text className="font-nt_semi text-orange-800" style={{fontSize: FONT.xs}}> {currentDay}, {currentDate}, {currentTime}</Text>
              </View> 
            </View>
            
            <View className='gap-2'>
              <View className='flex-row gap-2 items-center'>
                <RemixIcon name='heart-fill' size={16} color='#FF90BC'/>
                <Text className='font-nt_regular' style={{fontSize: FONT.xs}}>What's on your mind?</Text>
              </View>
              <View className='w-full border-[1px] rounded-xl border-gray-300 p-2' style={{minHeight: 80}}>
                <TextInput 
                  multiline
                  placeholder="Share your thoughts..."
                  className='font-nt_regular text-black'
                  placeholderTextColor={'gray'}
                  style={{
                    minHeight: 60,
                    textAlignVertical: 'top',
                    fontSize: FONT.xs,
                  }}
                  maxLength={500}
                  value={note}
                  onChangeText={setNote}
                  returnKeyType="done"
                />
              </View>
              
              <View className='gap-2'>
                <View className='flex-row gap-2 items-center'>
                  <RemixIcon name='bard-fill' size={16} color='#FFCF36'/>
                  <Text className='font-nt_regular' style={{fontSize: FONT.xs}}>Capture the moment</Text>
                </View>
                
                {/* Image Selection Area */}
                <View className='gap-3'>
                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <View className='bg-gray-50 rounded-xl p-3'>
                      <View className='flex-row items-center justify-between mb-3'>
                        <View className='flex-row items-center gap-2'>
                          <RemixIcon name='image-line' size={14} color='#6b7280'/>
                          <Text className='font-nt_medium text-gray-700' style={{fontSize: FONT.xs}}> {selectedImages.length} of 5 photo{selectedImages.length > 1 ? 's' : ''} </Text>
                        </View>
                        <TouchableOpacity onPress={() => setSelectedImages([])} className='px-2 py-1 bg-red-50 rounded-full' >
                          <Text className='font-nt_regular text-red-600' style={{fontSize: FONT.xxs}}> Clear all </Text>
                        </TouchableOpacity>
                      </View>
                      
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 8, paddingVertical: 10 }} >
                        {selectedImages.map((imageUri, index) => (
                          <View key={index} className='relative'>
                            <Image source={{ uri: imageUri }} style={{ width: scale(70), height: scale(70), borderRadius: 12, backgroundColor: '#f3f4f6' }} contentFit="cover" />
                            <TouchableOpacity
                              className='absolute -top-2 -right-2 bg-red-500 rounded-full items-center justify-center shadow-sm'
                              style={{ width: 24, height: 24 }}
                              onPress={() => removeImage(index)}
                              activeOpacity={0.8}
                            >
                              <RemixIcon name='close-line' size={14} color='white'/>
                            </TouchableOpacity>
                          </View>
                        ))}
                        
                        {/* Show remaining slots visually */}
                        {selectedImages.length < 5 && Array.from({ length: 5 - selectedImages.length }).map((_, index) => (
                          <View key={`empty-${index}`} className='border-[2px] border-dashed border-gray-300 rounded-xl items-center justify-center bg-gray-100' style={{ width: scale(70), height: scale(70) }} >
                            <RemixIcon name='add-line' size={20} color='#9ca3af'/>
                            <Text className='font-nt_regular text-gray-400 text-center' style={{fontSize: scale(8), lineHeight: scale(10)}}>
                              {selectedImages.length + index + 1}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {/* Camera and Gallery Actions - Always visible */}
                  <View className='flex-row gap-3'>
                    <TouchableOpacity 
                      className={`flex-1 border-[2px] rounded-xl p-4 items-center justify-center ${
                        selectedImages.length >= 5 
                          ? 'border-gray-200 bg-gray-100' 
                          : 'border-blue-200 bg-blue-50'
                      }`}
                      onPress={takePhoto}
                      activeOpacity={selectedImages.length >= 5 ? 0.5 : 0.7}
                      disabled={selectedImages.length >= 5}
                    >
                      <View className='items-center gap-2'>
                        <View className={`p-3 rounded-full ${ selectedImages.length >= 5 ? 'bg-gray-200' : 'bg-blue-100' }`}>
                          <RemixIcon name='camera-line' size={24} color={selectedImages.length >= 5 ? '#9ca3af' : '#3b82f6'} />
                        </View>
                        <View className='items-center'>
                          <Text className={`font-nt_semi ${ selectedImages.length >= 5 ? 'text-gray-400' : 'text-blue-700' }`} style={{fontSize: FONT.xs}} > Camera </Text>
                          <Text className={`font-nt_regular ${ selectedImages.length >= 5 ? 'text-gray-400' : 'text-blue-600' }`} style={{fontSize: FONT.xxs, lineHeight: scale(14)}} >
                            {selectedImages.length >= 5 ? 'Full' : 'Take photo'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      className={`flex-1 border-[2px] rounded-xl p-4 items-center justify-center ${
                        selectedImages.length >= 5 
                          ? 'border-gray-200 bg-gray-100' 
                          : 'border-purple-200 bg-purple-50'
                      }`}
                      onPress={pickFromGallery}
                      activeOpacity={selectedImages.length >= 5 ? 0.5 : 0.7}
                      disabled={selectedImages.length >= 5}
                    >
                      <View className='items-center gap-2'>
                        <View className={`p-3 rounded-full ${ selectedImages.length >= 5 ? 'bg-gray-200' : 'bg-purple-100' }`}>
                          <RemixIcon name='image-line' size={24} color={selectedImages.length >= 5 ? '#9ca3af' : '#8b5cf6'} />
                        </View>
                        <View className='items-center'>
                          <Text className={`font-nt_semi ${ selectedImages.length >= 5 ? 'text-gray-400' : 'text-purple-700' }`} style={{fontSize: FONT.xs}} > Gallery </Text>
                          <Text className={`font-nt_regular ${ selectedImages.length >= 5 ? 'text-gray-400' : 'text-purple-600' }`} style={{fontSize: FONT.xxs, lineHeight: scale(14)}} >
                            {selectedImages.length >= 5 ? 'Full' : 'Browse'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Status indicator when no images */}
                  {selectedImages.length === 0 && (
                    <View className='bg-blue-50 border border-blue-200 rounded-xl p-3'>
                      <View className='flex-row items-center gap-2'>
                        <RemixIcon name='information-line' size={16} color='#3b82f6'/>
                        <Text className='font-nt_regular text-blue-700 flex-1' style={{fontSize: FONT.xs}}>
                          Add up to 5 photos to capture this moment
                        </Text>
                      </View>
                    </View>
                  )}
                </View>     
              </View>
            </View>
          </AlertDialogHeader>
        </ScrollView>
        
        <AlertDialogFooter className='flex-row w-full'>
          <AlertDialogCancel className='flex-1 flex-row items-center justify-center' onPress={handleCancel}>
            <Text className='text-center font-nt_medium'>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction className='flex-1 flex-row items-center justify-center bg-[#FF90BC]' onPress={handleSaveMood}>
            <Text className='text-center font-nt_medium text-white'>Save Entry</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}