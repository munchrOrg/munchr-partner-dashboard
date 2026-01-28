import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
  _hasHydrated: boolean;
};

type AuthActions = {
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      _hasHydrated: false,

      setAccessToken: (token) => set({ accessToken: token }),

      clearAuth: () => set({ accessToken: null }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
