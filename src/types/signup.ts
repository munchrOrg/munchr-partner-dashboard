// Re-export types from store for backward compatibility
export type { AccountStatus, SignupFormData } from '@/stores/signup-store';

// Legacy type aliases (will be removed in Phase 2)
export type SignupState = {
  formData: import('@/stores/signup-store').SignupFormData;
  accountStatus: import('@/stores/signup-store').AccountStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  partnerId?: string | null;
};

export type SignupActions = {
  setFormData: (data: Partial<import('@/stores/signup-store').SignupFormData>) => void;
  setAccountStatus: (status: import('@/stores/signup-store').AccountStatus) => void;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
  setPartnerId: (id: string | null) => void;
  reset: () => void;
};

export type SignupStore = SignupState & SignupActions;
