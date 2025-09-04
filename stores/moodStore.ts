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
  images?: string[]; // Added images array
};

interface MoodStore {
  moods: Mood[];
  addMood: (
    moodText: string,
    date: string,
    day: string,
    time: string,
    note?: string,
    images?: string[] // Added images parameter
  ) => void;
  deleteMood: (id: string) => void;
  clearMoods: () => void;
  updateMoodImages: (id: string, images: string[]) => void; // Helper function for updating images
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

      addMood: (moodText, date, day, time, note = '', images = []) => {
        const newMood: Mood = {
          id: Date.now().toString(),
          moodText: moodText,
          date,
          day,
          time,
          note,
          images, // Include images in the mood object
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

      // Helper function to update images for a specific mood
      updateMoodImages: (id: string, images: string[]) =>
        set((state) => ({
          moods: state.moods.map((mood) =>
            mood.id === id ? { ...mood, images } : mood
          ),
        })),
    }),
    {
      name: 'mood-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export { useMoodStore };

