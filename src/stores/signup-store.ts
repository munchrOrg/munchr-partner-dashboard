import type { AccountStatus, SignupFormData, SignupStore } from '@/types/signup';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialFormData: SignupFormData = {
  serviceProviderType: null,
  businessName: '',
  businessDescription: '',
  email: '',
  password: undefined,
  phoneNumber: '',
  cuisines: [],
  logoUrl: null,
};

export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      accountStatus: 'pending',
      isEmailVerified: false,
      isPhoneVerified: false,
      partnerId: null,

      setFormData: (data: Partial<SignupFormData>) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setAccountStatus: (status: AccountStatus) => set({ accountStatus: status }),

      setEmailVerified: (verified: boolean) => set({ isEmailVerified: verified }),

      setPhoneVerified: (verified: boolean) => set({ isPhoneVerified: verified }),
      setPartnerId: (id: string | null) => set({ partnerId: id }),

      reset: () =>
        set({
          formData: initialFormData,
          accountStatus: 'pending',
          isEmailVerified: false,
          isPhoneVerified: false,
          partnerId: null,
        }),
    }),
    {
      name: 'signup-storage',
    }
  )
);
