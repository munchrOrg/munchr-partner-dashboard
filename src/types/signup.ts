export type SignupState = {
  partnerId: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
};

export type SignupActions = {
  setPartnerId: (id: string | null) => void;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
  reset: () => void;
};

export type SignupStore = SignupState & SignupActions;
