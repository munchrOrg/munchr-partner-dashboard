import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SignupFormData = {
  serviceProviderType: 'restaurant' | 'home-chef' | null;
  businessName: string;
  businessDescription: string;
  email: string;
  password?: string;
  phoneNumber: string;
  cuisines: string[];
  logoUrl: string | null;
};

export type AccountStatus = 'pending' | 'in_review' | 'approved';

type SignupState = {
  formData: SignupFormData;
  accountStatus: AccountStatus;
  partnerId: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
};

type SignupActions = {
  setFormData: (data: Partial<SignupFormData>) => void;
  setAccountStatus: (status: AccountStatus) => void;
  setPartnerId: (id: string | null) => void;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
  reset: () => void;
};

type SignupStore = SignupState & SignupActions;

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
      partnerId: null,
      isEmailVerified: false,
      isPhoneVerified: false,

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setAccountStatus: (status) => set({ accountStatus: status }),
      setPartnerId: (id) => set({ partnerId: id }),
      setEmailVerified: (verified) => set({ isEmailVerified: verified }),
      setPhoneVerified: (verified) => set({ isPhoneVerified: verified }),

      reset: () =>
        set({
          formData: initialFormData,
          accountStatus: 'pending',
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
