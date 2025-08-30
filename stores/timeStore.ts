import { create } from 'zustand';

interface TimeState {
  currentTime: string;
  currentDay: string;
  currentDate: string;
  updateTime: () => void;
}

export const useTimeStore = create<TimeState>((set, get) => ({
  currentTime: new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  }),
  
  currentDay: new Date().toLocaleDateString([], { 
    weekday: 'long' 
  }),
  
  currentDate: new Date().toLocaleDateString([], { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  
  // Update all time values manually
  updateTime: () => {
    const now = new Date();
    set({
      currentTime: now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      currentDay: now.toLocaleDateString([], { weekday: 'long' }),
      currentDate: now.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    });
  },
}));