import { secureStorage } from "@/lib/secureStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string[];
  background: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  progress: string;
  mainGradient: string[];
};

type ThemeStore = {
  theme: Theme;
  setTheme: (themeName: string) => void;
};

// 🎨 Define your themes here
const themes: Record<string, Theme> = {
  softPink: {
    name: "softPink",
    primary: "#FF90BC",
    secondary: "#FFC2D1",
    accent: "#F495B6",
    gradient: ["#ffc2d1", "#FF90BC"] as const,
    background: "#FFFFFF",
    card: "#FFF3F8",
    textPrimary: "#B71C1C",
    textSecondary: "#666666",
    progress: "#F48FB1",
    mainGradient: ["#FCF5FF", "#FAF0FF", "#fdd5df"] as const,
  },
  softRed: {
    name: "softRed",
    primary: "#FF6F6F",
    secondary: "#FFD1D1",
    accent: "#FFA8A8",
    gradient: ["#FFD1D1", "#FF8E8E"] as const,
    background: "#FFFFFF",
    card: "#FFF0F0",
    textPrimary: "#E65100",
    textSecondary: "#666666",
    progress: "#EF5350",
    mainGradient: ["#FFE5E5", "#FFD6D6", "#FFCCCC"] as const,
  },
  softBlue: {
    name: "softBlue",
    primary: "#6EC1E4",
    secondary: "#B3E5FC",
    accent: "#81D4FA",
    gradient: ["#B3E5FC", "#6EC1E4"] as const,
    background: "#FFFFFF",
    card: "#E3F2FD",
    textPrimary: "#0D47A1",
    textSecondary: "#555555",
    progress: "#64B5F6",
    mainGradient: ["#E3F2FD", "#E0F7FA", "#D7E3FC"] as const,
  },
  softOrange: {
    name: "softOrange",
    primary: "#FFB774",
    secondary: "#FFE0B2",
    accent: "#E65100",
    gradient: ["#FFE0B2", "#FFB774"] as const,
    background: "#FFFFFF",
    card: "#FFF4E1",
    textPrimary: "#E65100",
    textSecondary: "#666666",
    progress: "#FFA726",
    mainGradient: ["#FFF4E1", "#FFE0B2", "#FFD8A8"] as const,
  },

  softGreen: {
    name: "softGreen",
    primary: "#81C784",
    secondary: "#C8E6C9",
    accent: "#A5D6A7",
    gradient: ["#C8E6C9", "#81C784"] as const,
    background: "#FFFFFF",
    card: "#E8F5E9",
    textPrimary: "#1B5E20",
    textSecondary: "#555555",
    progress: "#66BB6A",
    mainGradient: ["#E8F5E9", "#E0F2F1", "#D0F0D0"] as const,
  },

  softPurple: {
    name: "softPurple",
    primary: "#BAA6E3",
    secondary: "#E1BEE7",
    accent: "#CE93D8",
    gradient: ["#E1BEE7", "#BAA6E3"] as const,
    background: "#FFFFFF",
    card: "#F3E5F5",
    textPrimary: "#4A148C",
    textSecondary: "#555555",
    progress: "#AB47BC",
    mainGradient: ["#F3E5F5", "#EDE7F6", "#E8DAEF"] as const,
  },

  softGray: {
    name: "softGray",
    primary: "#BDBDBD",
    secondary: "#E0E0E0",
    accent: "#B0B0B0",
    gradient: ["#E0E0E0", "#BDBDBD"] as const,
    background: "#FFFFFF",
    card: "#F5F5F5",
    textPrimary: "#424242",
    textSecondary: "#666666",
    progress: "#9E9E9E",
    mainGradient: ["#F5F5F5", "#EDEDED", "#E0E0E0"] as const,
  },

  softTeal: {
    name: "softTeal",
    primary: "#80CBC4",
    secondary: "#B2DFDB",
    accent: "#4DB6AC",
    gradient: ["#B2DFDB", "#80CBC4"] as const,
    background: "#FFFFFF",
    card: "#E0F2F1",
    textPrimary: "#004D40",
    textSecondary: "#555555",
    progress: "#26A69A",
    mainGradient: ["#E0F2F1", "#D0EBE9", "#C1E7E5"] as const,
  },

  softPeach: {
    name: "softPeach",
    primary: "#FFBC9A",
    secondary: "#FFE1D1",
    accent: "#FF9859",
    gradient: ["#FFE1D1", "#FFBC9A"] as const,
    background: "#FFFFFF",
    card: "#FFF5ED",
    textPrimary: "#BF360C",
    textSecondary: "#666666",
    progress: "#FF8A65",
    mainGradient: ["#FFF5ED", "#FFE1D1", "#FFD2B8"] as const,
  },

};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: themes.softPink, // default theme
      setTheme: (themeName) =>
        set({ theme: themes[themeName as keyof typeof themes] || themes.softPink }),
    }),
    {
      name: 'theme-storage', // unique name for storage key
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
