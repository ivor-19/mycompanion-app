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
import { View } from 'react-native';
import RemixIcon from 'react-native-remix-icon';
import { scale } from 'react-native-size-matters';

type MoodsData = {
  moodText: string,
  date: string,
  day: string,
  time: string,
  note: string,
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  moodData?: MoodsData
}

export default function ViewMoodEntryModal({ open, setOpen, moodData }: Props) {
  // Early return or default values if no moodData
  if (!moodData) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
  }

  return(
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
              <Text className='font-nt_regular text-left text-gray-700' style={{fontSize: FONT.xs}}>
                {moodData.note}
              </Text>
            </View>
            
            {/* Only show photos section if you plan to implement photo functionality */}
            <View className='gap-2'>
              <View className='flex-row gap-2 items-center'>
                <RemixIcon name='image-fill' size={16} color='#FF90BC'/>
                <Text className='font-nt_regular' style={{fontSize: FONT.xs}}>Photos</Text>
              </View>
              <View className='w-full border-[1px] rounded-xl border-gray-300 p-3 items-center justify-center' style={{minHeight: 60}}>
                <Text className='font-nt_regular text-gray-500' style={{fontSize: FONT.xxs}}>
                  No photos attached
                </Text>
              </View>
            </View>
          </View>
        </AlertDialogHeader>
        
        <AlertDialogFooter className='flex-row w-full'>
          <AlertDialogAction 
            className='flex-1 flex-row items-center justify-center bg-[#FF90BC]' 
            onPress={handleClose}
          >
            <Text className='text-center font-nt_medium text-white'>Close</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}