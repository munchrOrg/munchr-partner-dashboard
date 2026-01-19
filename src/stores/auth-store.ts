import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
};

type AuthActions = {
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,

      setAccessToken: (token) => set({ accessToken: token }),

      clearAuth: () => set({ accessToken: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
