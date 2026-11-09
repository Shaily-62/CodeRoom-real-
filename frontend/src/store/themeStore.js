import { create } from "zustand";
import { persist } from "zustand/middleware";

import { defaultTheme, themes } from "../styles/themeRegistry";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: defaultTheme,

      setTheme: (themeId) => {
        if (!themes[themeId]) {
          console.error(`Theme "${themeId}" does not exist.`);
          return;
        }

        set({ theme: themeId });
      },

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        }));
      },
    }),
    {
      name: "coderoom-theme",
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);