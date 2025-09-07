import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { getEmojiByMood } from '@/helper/moodEmoji';
import { FONT } from '@/lib/scale';
import { useMoodStore } from '@/stores/moodStore';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';

type MoodsData = {
  id?: string
  moodText?: string;
  date?: string;
  day?: string;
  time?: string;
  note?: string;
  images?: string[];
};

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  moodsData: MoodsData
}

export default function DeleteModal({ open, setOpen, moodsData }: Props) {
  const { deleteMood } = useMoodStore();

  const handleConfirm = async () => {
    if (moodsData.id) {
      deleteMood(moodsData.id);
      setOpen(false);
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="gap-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-funnel_semi text-lg">
            Delete this note?
          </AlertDialogTitle>

          {/* Mood details preview */}
          <View className="mt-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
            {moodsData.moodText ? (
              <View className='gap-2 items-center'>
                <Image source={getEmojiByMood(moodsData.moodText)} style={{height: scale(40), width: scale(40)}}/>
                <Text className="font-funnel_semi text-gray-800" style={{fontSize: FONT.sm}}>
                  {moodsData.moodText}
                </Text>
              </View>
            ) : null}
            {(moodsData.day || moodsData.date || moodsData.time) ? (
              <Text className="text-gray-500 mt-1 font-nt_regular" style={{fontSize: FONT.xs}}>
                {moodsData.day} {moodsData.date} {moodsData.time}
              </Text>
            ) : null}
            {moodsData.note ? (
              <Text className="mt-2 text-gray-700 leading-snug italic font-nt_regular" style={{fontSize: FONT.xs}}>
                “{moodsData.note}”
              </Text>
            ) : null}
          </View>

      
          <AlertDialogDescription className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-funnel_regular" style={{fontSize: FONT.xs}}>
            Are you sure you want to delete this note? This action is permanent and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleConfirm} className='bg-red-500'>
            <Text>Delete</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
