import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { getEmojiByMood } from '@/helper/moodEmoji';
import { FONT } from '@/lib/scale';
import { useColorModeStore } from '@/stores/colorModeStore';
import { useMoodStore } from '@/stores/moodStore';
import { useThemeStore } from '@/stores/themeStore';
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
  const { mode } = useColorModeStore()
  const { theme } = useThemeStore()

  const handleConfirm = async () => {
    if (moodsData.id) {
      deleteMood(moodsData.id);
      setOpen(false);
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="gap-4" style={{backgroundColor: mode.main, borderColor: mode.neutral}}>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-funnel_semi text-lg" style={{color: mode.textPrimary}}> Delete this note? </AlertDialogTitle>

          {/* Mood details preview */}
          <View className="mt-3 p-4 rounded-2xl" style={{backgroundColor: mode.main, borderColor: mode.neutral, borderWidth: 1}}>
            {moodsData.moodText ? (
              <View className='gap-2 items-center'>
                <Image source={getEmojiByMood(moodsData.moodText)} style={{height: scale(40), width: scale(40)}}/>
                <Text className="font-funnel_semi" style={{fontSize: FONT.sm, color: mode.textPrimary}}>
                  {moodsData.moodText}
                </Text>
              </View>
            ) : null}
            {(moodsData.day || moodsData.date || moodsData.time) ? (
              <Text className="text-gray-500 mt-1 font-nt_regular" style={{fontSize: FONT.xs, color: mode.textSecondary}}>
                {moodsData.day} {moodsData.date} {moodsData.time}
              </Text>
            ) : null}
            {moodsData.note ? (
              <Text className="mt-2 text-gray-700 leading-snug italic font-nt_regular" style={{fontSize: FONT.xs, color: mode.textSecondary}}>
                “{moodsData.note}”
              </Text>
            ) : null}
          </View>

      
          <AlertDialogDescription className="p-4 rounded-2xl  font-funnel_regular" style={{fontSize: FONT.xs, color: mode.name === 'dark' ? '#EA9E9E' : '#D32F2F', backgroundColor: mode.name === 'dark' ? '#EB131320' : '#FABDBD20', borderWidth: 1, borderColor: mode.name === 'dark' ? '#F3686870' : '#F6929280'}}>
            Are you sure you want to delete this note? This action is permanent and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel style={{backgroundColor: mode.card, borderWidth: 1, borderColor: mode.neutral}}>
            <Text style={{color: mode.textPrimary}}>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleConfirm} className='bg-red-500'>
            <Text>Delete</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
