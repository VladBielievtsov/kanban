import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeStore = {
  theme: Theme;
  setDark: () => void;
  setLight: () => void;
};

const getInitialTheme = (): Theme => {
  return "dark";
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  setDark() {
    set({ theme: "dark" });
  },
  setLight() {
    set({ theme: "light" });
  },
}));
