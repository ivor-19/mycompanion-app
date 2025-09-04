export const getEmojiByMood = (moodText: string) => {
  const emojiMap = {
    'Happy': require('@/assets/icons/emojis/happy.png'),
    'Sad': require('@/assets/icons/emojis/sad.png'),
    'Angry': require('@/assets/icons/emojis/angry.png'),
    'Anxious': require('@/assets/icons/emojis/anxious.png'),
    'Neutral': require('@/assets/icons/emojis/neutral.png'),
    'Excited': require('@/assets/icons/emojis/excited.png'),
  };
  
  return emojiMap[moodText as keyof typeof emojiMap] || require('@/assets/icons/emojis/happy.png');
};