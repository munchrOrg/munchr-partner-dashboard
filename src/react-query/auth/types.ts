import type { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

export type LoginRequest = {
  email: string;
  password: string;
  deviceInfo?: string;
};

export type PhoneLoginRequest = {
  phoneNumber: string;
  password: string;
  deviceInfo?: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    isOwner: boolean;
    role: string;
  };
  partner?: {
    id: string;
    businessName: string;
    serviceProviderType: string;
  };
  onboarding?: {
    currentStep: string;
    completedSteps: string[];
    completedPhases: string[];
    isComplete: boolean;
  };
};

export type VerificationRequiredError = {
  error: 'verification_required';
  emailVerified: boolean;
  phoneVerified: boolean;
  partnerId?: string;
  email?: string;
  phone?: string;
};

export type PendingApprovalError = {
  error: 'pending_approval';
  message: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  expiresIn: number;
};

export type LogoutRequest = {
  refreshToken?: string;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  serviceProviderType: string;
  businessName: string;
  description?: string;
  phone: string;
  countryCode?: string;
  cuisineIds: string[];
  logoUrl?: string;
};

export type SignUpResponse = {
  success: boolean;
  partnerId: string;
  userId: string;
  message: string;
  requiresVerification: {
    email: boolean;
    phone: boolean;
  };
  // Tokens can be at root level or nested under 'tokens'
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export type VerifyOtpRequest = {
  userId: string;
  otp: string;
};

export type VerifyOtpResponse = {
  message: string;
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type VerifyForgotPasswordOtpRequest = {
  userId?: string;
  email?: string;
  phone?: string;
  otp: string;
};

export type VerifyForgotPasswordOtpResponse = {
  success: boolean;
  message: string;
  resetToken: string;
};

export type ResendOtpRequest = {
  userId: string;
};

export type ResendOtpResponse = {
  success: boolean;
  message: string;
  expiresAt?: string;
  canResendAt?: string;
};

export type ResendEmailOtpRequest = {
  userId: string;
  email?: string;
  purpose: 'email_signup' | 'password_reset';
};

export type ResendPhoneOtpRequest = {
  userId: string;
  phone?: string;
  purpose: 'phone_signup' | 'password_reset';
};

export type VerifyEmailRequest = {
  userId: string;
  otp: string;
};

export type VerifyEmailResponse = {
  success: boolean;
  message: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountActivated: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    isOwner: boolean;
    role: string;
  };
  partner?: {
    id: string;
    businessName: string;
    serviceProviderType: string;
  };
  onboarding?: {
    currentStep: string;
    completedSteps: string[];
    completedPhases: string[];
    isComplete: boolean;
  };
};

export type VerifyPhoneRequest = {
  userId: string;
  otp: string;
};

export type VerifyPhoneResponse = {
  success: boolean;
  message: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountActivated: boolean;
  nextStep?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    isOwner: boolean;
    role: string;
  };
  partner?: {
    id: string;
    businessName: string;
    serviceProviderType: string;
  };
  onboarding?: {
    currentStep: string;
    completedSteps: string[];
    completedPhases: string[];
    isComplete: boolean;
  };
};

// Nested types for UpdateProfileRequest
export type BillingAddressType = {
  buildingPlaceName?: string;
  street?: string;
  houseNumber?: string;
  state?: string;
  city?: string;
  area?: string;
  postalCode?: string;
  addCommentAboutLocation?: string;
};

export type PaymentMethodType = {
  paymentMethod?: string;
  accountNumber?: string;
};

export type BookSlotType = {
  networkPreference?: string;
  date?: string;
  time?: string;
};

export type OperatingHoursType = {
  dayOfWeek: number;
  startTime?: string;
  endTime?: string;
  isClosed: boolean;
};

export type UpdateProfileRequest = {
  // Location fields
  buildingPlaceName?: string;
  street?: string;
  houseNumber?: string;
  state?: string;
  city?: string;
  area?: string;
  postalCode?: string;
  addCommentAboutLocation?: string;
  latitude?: number;
  longitude?: number;

  // Identity fields
  sntn?: boolean;
  cnicFrontKey?: string;
  cnicBackKey?: string;
  ntnImageKey?: string;
  cnicNumber?: string;
  taxRegistrationNo?: string;
  firstAndMiddleNameForNic?: string;
  lastNameForNic?: string;

  // Banking fields
  bankAccountOwner?: string;
  bankName?: string;
  IBAN?: string;
  billingAddressAreSame?: boolean;
  billingAddress?: BillingAddressType;
  chequeBookImageKey?: string;
  paymentMethod?: PaymentMethodType;

  // Other business fields
  email?: string;
  menuImageKey?: string;
  bookSlot?: BookSlotType;
  uploadScreenshotImageKey?: string;
  paymentTransactionId?: string;
  branchId?: string;
  operatingHours?: OperatingHoursType[];

  // Onboarding tracking fields
  currentStep?: OnboardingStep;
  completeStep?: OnboardingStep;
  completePhase?: OnboardingPhase;
};

export type OnboardingState = {
  currentStep: OnboardingStep | null;
  completedSteps: string[];
  completedPhases: string[];
  isComplete: boolean;
};

export type UpdateProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    businessProfile: any;
    step1: boolean;
    step2: boolean;
    step3: boolean;
    onboarding: OnboardingState;
  };
};

export type ForgotPasswordRequest = {
  email?: string;
  phone?: string;
};

export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
  phone?: string;
  expiresAt?: string;
  canResendAt?: string;
};

export type ResetPasswordRequest = {
  resetToken: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

export type ProfileResponse = {
  id: string;
  name: string;
  email: string;
  isOwner: boolean;
  status: string;
  role: string;
  partner: {
    id: string;
    email: string;
    phone: string;
    businessName: string;
    serviceProviderType: string;
    status: string;
    businessProfile: any;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  };
  operatingHours: OperatingHoursType[];
  step1: boolean;
  step2: boolean;
  step3: boolean;
  onboarding: OnboardingState;
  // Verification status (should be included in profile response)
  emailVerified?: boolean;
  phoneVerified?: boolean;
};
