import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Mood = {
  id: string;
  moodText: string;
  date: string;
  day: string;
  time: string;
  note: string;
};

interface MoodStore {
  moods: Mood[];
  addMood: (
    moodText: string,
    date: string,
    day: string,
    time: string,
    note?: string
  ) => void;
  deleteMood: (id: string) => void;
  clearMoods: () => void;
  loadStaticData: () => void;
}

// Static mood data with your format
const staticMoods: Mood[] = [
  {
    id: '2146032980677',
    moodText: 'Happy',
    date: '21 August 2025',
    day: 'Saturday',
    time: '10:00 AM',
    note: 'Had a wonderful morning walk in the park'
  },
  {
    id: '2918487841181',
    moodText: 'Neutral',
    date: '20 August 2025',
    day: 'Friday',
    time: '2:30 PM',
    note: 'Got great news about my project approval!'
  },
  {
    id: '3294625129008',
    moodText: 'Angry',
    date: '19 August 2025',
    day: 'Thursday',
    time: '8:15 PM',
    note: 'Evening yoga session helped me unwind'
  },
  {
    id: '7469608857595',
    moodText: 'Sad',
    date: '18 August 2025',
    day: 'Wednesday',
    time: '6:45 AM',
    note: 'Grateful for family time and good health'
  },
  {
    id: '1682293815814',
    moodText: 'Anxious',
    date: '17 August 2025',
    day: 'Tuesday',
    time: '11:20 AM',
    note: 'Morning workout gave me so much energy'
  }
];

// Custom SecureStore adapter (async)
const secureStorage = {
  getItem: (name: string): Promise<string | null> => {
    return SecureStore.getItemAsync(name);
  },
  setItem: (name: string, value: string): Promise<void> => {
    return SecureStore.setItemAsync(name, value);
  },
  removeItem: (name: string): Promise<void> => {
    return SecureStore.deleteItemAsync(name);
  },
};

const useMoodStore = create<MoodStore>()(
  persist(
    (set) => ({
      moods: [],

      addMood: (moodText, date, day, time, note = '') => {
        const newMood: Mood = {
          id: Date.now().toString(),
          moodText: moodText,
          date,
          day,
          time,
          note,
        };
        set((state) => ({
          moods: [newMood, ...state.moods],
        }));
      },

      deleteMood: (id: string) =>
        set((state) => ({
          moods: state.moods.filter((mood) => mood.id !== id),
        })),

      clearMoods: () => set({ moods: [] }),

      // Load static data function
      loadStaticData: () => {
        set((state) => ({
          moods: [...staticMoods, ...state.moods],
        }));
      },
    }),
    {
      name: 'mood-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export { useMoodStore };

