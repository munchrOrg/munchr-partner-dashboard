export type SignupFormData = {
  serviceProviderType: 'restaurant' | 'home-chef' | null;
  businessName: string;
  businessDescription: string;
  email: string;
  phoneNumber: string;
  cuisines: string[];
  logoUrl: string | null;
};

export type AccountStatus = 'pending' | 'in_review' | 'approved';

export type SignupState = {
  formData: SignupFormData;
  accountStatus: AccountStatus;
  isSignupComplete: boolean;
};

export type SignupActions = {
  setFormData: (data: Partial<SignupFormData>) => void;
  setAccountStatus: (status: AccountStatus) => void;
  setSignupComplete: (complete: boolean) => void;
  reset: () => void;
};

export type SignupStore = SignupState & SignupActions;
