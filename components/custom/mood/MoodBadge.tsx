
import { FONT } from '@/lib/scale';
import React from 'react';
import { Text, View } from 'react-native';

type MoodType = 'Happy' | 'Sad' | 'Angry' | 'Anxious' | 'Neutral' | 'Excited';

interface MoodBadgeProps {
  mood: string;
  className?: string;
}

export const MoodBadge: React.FC<MoodBadgeProps> = ({ mood, className = '' }) => {
  const getMoodClasses = (moodType: string) => {
    const normalizedMood = moodType.toLowerCase();
    
    switch (normalizedMood) {
      case 'happy':
        return { container: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800' };
      case 'sad':
        return { container: 'bg-blue-50 border-blue-200', text: 'text-blue-800' };
      case 'angry':
        return { container: 'bg-red-50 border-red-200', text: 'text-red-800' };
      case 'anxious':
        return { container: 'bg-purple-50 border-purple-200', text: 'text-purple-800' };
      case 'neutral':
        return { container: 'bg-gray-50 border-gray-200', text: 'text-gray-800' };
      case 'excited':
        return { container: 'bg-green-50 border-green-200', text: 'text-green-800' };
      default:
        return { container: 'bg-amber-50 border-amber-200', text: 'text-amber-800' };
    }
  };

  const moodClasses = getMoodClasses(mood);
  const baseClasses = 'rounded-2xl border px-3 py-1.5 self-start mr-2 mb-2';

  return (
    <View className={`${baseClasses} ${moodClasses.container} ${className}`}>
      <Text className={`font-funnel_semi text-center ${moodClasses.text}`} style={{fontSize: FONT.xxs}}>
        {mood}
      </Text>
    </View>
  );
};