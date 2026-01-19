import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SignupState = {
  partnerId: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
};

type SignupActions = {
  setPartnerId: (id: string | null) => void;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
  reset: () => void;
};

type SignupStore = SignupState & SignupActions;

export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      partnerId: null,
      isEmailVerified: false,
      isPhoneVerified: false,

      setPartnerId: (id) => set({ partnerId: id }),
      setEmailVerified: (verified) => set({ isEmailVerified: verified }),
      setPhoneVerified: (verified) => set({ isPhoneVerified: verified }),

      reset: () =>
        set({
          partnerId: null,
          isEmailVerified: false,
          isPhoneVerified: false,
        }),
    }),
    {
      name: 'signup-storage',
    }
  )
);
