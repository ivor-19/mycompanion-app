import { secureStorage } from "@/lib/secureStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Mode = {
  name: string;
  background: string[];
  card: string;
  textPrimary: string;
  textSecondary: string;
  neutral: string;
  main: string;
  foreground: string;
};

type ModeStore = {
  mode: Mode;
  setMode: (modeName: string) => void;
};

// 💡 Define light and dark modes
const modes: Record<string, Mode> = {
  light: {
    name: "light",
    background: ["#FFFFFF", "#FFFFFF"] as const,
    card: "#FFF9F9",
    textPrimary: "#1E1E1E",
    textSecondary: "#666666",
    neutral: '#E5E7EB',
    main: "#FFFFFF",
    foreground: "#141414",
  },
  dark: {
    name: "dark",
    background: ["#141414", "#141414"],
    card: "#1E1E1E",
    textPrimary: "#FFFFFF",
    textSecondary: "#BDBDBD",
    neutral: '#2d2d2d',
    main: "#141414",
    foreground: "#FFFFFF",
  },
  dim: {
    name: "dim",
    background: ["#", "#1F1F1F"],
    card: "#222222",
    textPrimary: "#E0E0E0",
    textSecondary: "#A0A0A0",
    neutral: '#4B5563',
    main: "#1F1F1F",
    foreground: "#141414",
  },
};

export const useColorModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      mode: modes.dark, // default
      setMode: (modeName) =>
        set({ mode: modes[modeName as keyof typeof modes] || modes.light }),
    }),
    {
      name: "mode-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
