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
import { useEffect, useState } from 'react';
import { Keyboard, Platform, TextInput, TouchableOpacity, View } from 'react-native';
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

  const handleSaveMood = async () => {

    try {
      addMood(
        moodText,
        currentDate,
        currentDay,
        currentTime,
        note || 'No note added',
      )


      setNote('')
    } catch (error) {
      console.error("Error occured: ", error)
    }
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
              <RemixIcon name='heart-fill' size={16} color='#f5576c'/>
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
              <TouchableOpacity className='w-full border-[2px] border-dashed rounded-xl border-gray-300 p-2 items-center justify-center' style={{minHeight: 80}} activeOpacity={0.7}>
                <View className='items-center'>
                  <RemixIcon name='camera-2-line' size={36} color='gray'/>
                  <View>
                    <Text className='font-nt_semi text-gray-600' style={{fontSize: FONT.xs, lineHeight: scale(14)}}>Add photos</Text>
                    <Text className='font-nt_regular text-gray-600' style={{fontSize: FONT.xxs, lineHeight: scale(14)}}>Tap to browse</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </AlertDialogHeader>
        
        <AlertDialogFooter className='flex-row w-full'>
          <AlertDialogCancel className='flex-1 flex-row items-center justify-center'>
            <Text className='text-center font-nt_medium'>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction className='flex-1 flex-row items-center justify-center bg-[#f5576c]' onPress={handleSaveMood}>
            <Text className='text-center font-nt_medium text-white'>Save Entry</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}