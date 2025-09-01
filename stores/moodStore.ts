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
}

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
    }),
    {
      name: 'mood-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export { useMoodStore };
