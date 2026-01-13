import type { AccountStatus, SignupFormData, SignupStore } from '@/types/signup';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialFormData: SignupFormData = {
  serviceProviderType: null,
  businessName: '',
  businessDescription: '',
  email: '',
  phoneNumber: '',
  cuisines: [],
  logoUrl: null,
};

export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      accountStatus: 'pending',
      isSignupComplete: false,

      setFormData: (data: Partial<SignupFormData>) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setAccountStatus: (status: AccountStatus) => set({ accountStatus: status }),

      setSignupComplete: (complete: boolean) => set({ isSignupComplete: complete }),

      reset: () =>
        set({
          formData: initialFormData,
          accountStatus: 'pending',
          isSignupComplete: false,
        }),
    }),
    {
      name: 'signup-storage',
    }
  )
);
