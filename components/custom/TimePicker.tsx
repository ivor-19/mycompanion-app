import { Text } from '@/components/ui/text';
import { FONT } from '@/lib/scale';
import { useColorModeStore } from '@/stores/colorModeStore';
import { useThemeStore } from '@/stores/themeStore';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  value: string;
  onSelect: (val: string) => void;
  title: string;
}

export default function TimePicker({ visible, onClose, options, value, onSelect, title }: TimePickerModalProps) {
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} >
      <TouchableOpacity className='flex-1 justify-center items-center' style={{backgroundColor: 'rgba(0,0,0,0.5)'}} activeOpacity={1} onPress={onClose} >
        <View className='w-[80%] max-h-[400px] rounded-2xl overflow-hidden' style={{backgroundColor: mode.main}} onStartShouldSetResponder={() => true} >
          <View className='p-4 border-b' style={{borderBottomColor: mode.neutral}}>
            <Text className='font-nt_semi text-center' style={{fontSize: FONT.sm, color: mode.textPrimary}}> {title} </Text>
          </View>
          <ScrollView className='max-h-[300px]'>
            {options.map((option) => (
              <TouchableOpacity key={option} className='p-4 border-b' style={{ borderBottomColor: mode.neutral, backgroundColor: value === option ? mode.card : 'transparent' }} onPress={() => { onSelect(option); onClose(); }} >
                <Text className='font-nt_medium text-center' style={{ fontSize: FONT.sm, color: value === option ? theme.accent : mode.textPrimary }} >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}