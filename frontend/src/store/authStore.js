import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ user, profile, session }) => {
        set({
          user,
          profile,
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          isAuthenticated: true,
        });
      },

      setProfile: (profile) => {
        set({ profile });
      },

      logout: () => {
        set({
          user: null,
          profile: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "coderoom-auth",
    },
  ),
);
