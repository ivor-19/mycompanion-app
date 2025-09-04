import { useMemo } from 'react';
import { useMoodStore } from './moodStore'; // Adjust import path as needed

export interface MoodProgress {
  currentWeekSessions: number;
  wellnessPercentage: number;
  weeklyStreak: number;
  averageDailyMoods: number;
}

// Define mood categories and their wellness scores
const MOOD_WELLNESS_SCORES: Record<string, number> = {
  // Positive moods
  'happy': 100,
  'excited': 95,
  'grateful': 90,
  'content': 85,
  'calm': 80,
  'optimistic': 85,
  'energetic': 90,
  'peaceful': 80,
  'confident': 85,
  'joyful': 95,
  
  // Neutral moods
  'okay': 60,
  'neutral': 50,
  'tired': 40,
  'bored': 45,
  'indifferent': 50,
  
  // Negative moods
  'sad': 20,
  'anxious': 25,
  'stressed': 30,
  'angry': 25,
  'frustrated': 35,
  'worried': 30,
  'overwhelmed': 20,
  'lonely': 25,
  'depressed': 15,
  'irritated': 35,
};

const useMoodProgress = (): MoodProgress => {
  const { moods } = useMoodStore();

  return useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Filter moods for current week
    const currentWeekMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= startOfWeek && moodDate <= endOfWeek;
    });

    // Calculate current week sessions
    const currentWeekSessions = currentWeekMoods.length;

    // Calculate wellness percentage
    let totalWellnessScore = 0;
    let validMoodCount = 0;

    currentWeekMoods.forEach(mood => {
      const moodKey = mood.moodText.toLowerCase().trim();
      const score = MOOD_WELLNESS_SCORES[moodKey];
      
      if (score !== undefined) {
        totalWellnessScore += score;
        validMoodCount++;
      } else {
        // Default neutral score for unknown moods
        totalWellnessScore += 50;
        validMoodCount++;
      }
    });

    const wellnessPercentage = validMoodCount > 0 
      ? Math.round(totalWellnessScore / validMoodCount) 
      : 0;

    // Calculate weekly streak (consecutive days with mood entries)
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      
      const hasEntry = moods.some(mood => {
        const moodDate = new Date(mood.date);
        moodDate.setHours(0, 0, 0, 0);
        return moodDate.getTime() === checkDate.getTime();
      });
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate average daily moods for current week
    const averageDailyMoods = currentWeekSessions > 0 
      ? Math.round((currentWeekSessions / 7) * 10) / 10 
      : 0;

    return {
      currentWeekSessions,
      wellnessPercentage,
      weeklyStreak: streak,
      averageDailyMoods,
    };
  }, [moods]);
};

export { useMoodProgress };
