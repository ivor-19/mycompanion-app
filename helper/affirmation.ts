const affirmations = [
  "You are stronger than you think and more capable than you imagine.",
  "Every day is a new opportunity to grow and heal.",
  "Your feelings are valid, and you deserve peace.",
  "Small steps forward still move you closer to your goal.",
  "You are enough, just as you are right now.",
  "Healing takes time, and that’s perfectly okay.",
  "Believe in your strength to overcome challenges."
];

export const getRandomAffirmation = (): string => {
  const index = Math.floor(Math.random() * affirmations.length);
  return affirmations[index];
};
