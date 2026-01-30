import type { ApiErrorResponse } from '@/types/api';
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

export type LoginUserRole = {
  id: string;
  name: string;
  code: string | null;
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
    userType: string;
    roles: LoginUserRole[];
  };
  onboarding?: {
    currentStep?: string;
    completedSteps?: string[];
    completedPhases?: string[];
    isOnboardingCompleted: boolean;
    skipOnboarding?: boolean;
    branchId?: string;
    steps?: string[];
  };
};

export type VerificationRequiredErrorData = {
  emailVerified: boolean;
  phoneVerified: boolean;
  partnerId?: string;
  userId?: string;
  email?: string;
  phone?: string;
};

export type VerificationRequiredError = ApiErrorResponse<VerificationRequiredErrorData>;

export type PendingApprovalError = ApiErrorResponse<null>;

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

export type LogoutResponse = null;

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = null;

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
  partnerId: string;
  userId: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null;
  user: {
    id: string;
    name: string;
    email: string;
    isOwner: boolean;
    roles: LoginUserRole[];
  };
  partner: {
    id: string;
    businessName: string;
    serviceProviderType: string;
  };
  onboarding: {
    currentStep: string;
    completedSteps: string[];
    completedPhases: string[];
    isOnboardingCompleted: boolean;
  };
  requiresVerification: {
    email: boolean;
    phone: boolean;
  };
};

export type VerifyOtpRequest = {
  userId: string;
  otp: string;
};

export type VerifyOtpResponse = {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type VerifyForgotPasswordOtpRequest = {
  userId: string;
  otp: string;
};

export type VerifyForgotPasswordOtpResponse = {
  resetToken: string;
};

export type ResendOtpRequest = {
  userId: string;
};

export type ResendOtpResponse = {
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
  emailVerified: boolean;
  phoneVerified: boolean;
  accountActivated: boolean;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null;
  onboarding?: {
    currentStep: string;
    completedSteps: string[];
    completedPhases: string[];
    isOnboardingCompleted: boolean;
  };
};

export type VerifyPhoneRequest = {
  userId: string;
  otp: string;
};

export type VerifyPhoneResponse = {
  emailVerified: boolean;
  phoneVerified: boolean;
  accountActivated: boolean;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null;
  onboarding?: {
    currentStep: string;
    completedSteps: string[];
    completedPhases: string[];
    isOnboardingCompleted: boolean;
  };
};

// Nested types for UpdateProfileRequest
export type BillingAddressType = {
  address?: string;
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
  chequeBookKey?: string;
  paymentMethod?: PaymentMethodType;

  // Other business fields
  email?: string;
  menuKey?: string;
  bookSlot?: BookSlotType;
  paymentScreenshotKey?: string;
  paymentTransactionId?: string;
  branchId?: string;
  operatingHours?: OperatingHoursType[];

  // Onboarding tracking fields
  currentStep?: OnboardingStep;
  completeStep?: OnboardingStep;
  completePhase?: OnboardingPhase;
};

export type OnboardingState = {
  currentStep?: OnboardingStep | null;
  completedSteps?: string[];
  completedPhases?: string[];
  isOnboardingCompleted: boolean;
  skipOnboarding?: boolean;
  branchId?: string;
  steps?: string[];
};

export type UpdateProfileResponse = ProfileResponse;

export type ForgotPasswordRequest = {
  email?: string;
  phone?: string;
};

export type ForgotPasswordResponse = {
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

export type ResetPasswordResponse = null;

export type ProfilePermission = {
  id: string;
  name: string;
  code: string;
  resource: string;
  description: string;
};

export type ProfileRole = {
  id: string;
  name: string;
  code: string | null;
  permissions: ProfilePermission[];
};

export type ProfileBranchAccess = {
  id: string;
  branchId: string;
  hasAllLocations: boolean;
  branch: {
    id: string;
    branchName: string;
    isPrimary: boolean;
  } | null;
};

export type ProfileCuisine = {
  id: string;
  name: string;
};

export type ProfilePrimaryBranch = {
  id: string;
  branchName: string;
  description: string;
  contactEmail: string;
  cuisines: ProfileCuisine[];
  operatingHours: OperatingHoursType[];
};

export type ProfileBusinessProfile = {
  id: string;
  businessName: string;
  description: string;
  logoImageUrl: string;
  menuKey: string;
  cnicNumber: string;
  cnicFrontKey: string;
  cnicBackKey: string;
  ntnImageKey: string;
  sntn: boolean;
  taxRegistrationNo: string;
  firstAndMiddleNameForNic: string;
  lastNameForNic: string;
  paymentScreenshotKey: string;
  paymentTransactionId: string;
  // Additional fields that may be present
  cuisines?: string[];
  businessPhone?: string;
  partnershipPackage?: string;
};

export type ProfileLocation = {
  buildingPlaceName: string;
  street: string;
  houseNumber: string;
  state: string;
  city: string;
  area: string;
  postalCode: string;
  addCommentAboutLocation: string;
  latitude: number;
  longitude: number;
};

export type ProfileBillingInfo = {
  id: string;
  bankAccountOwner: string;
  bankName: string;
  IBAN: string;
  chequeBookKey: string;
  billingAddressAreSame: boolean;
  paymentAccountNumber: string;
  paymentMethodType: string;
  billingAddress: {
    buildingPlaceName: string;
    street: string;
    houseNumber: string;
    state: string;
    city: string;
    area: string;
    postalCode: string;
    addCommentAboutLocation: string;
  };
  // Card payment fields (optional)
  accountTitle?: string;
  cardNumber?: string;
  cardExpiry?: string;
};

export type ProfileBookSlot = {
  id: string;
  networkPreference: string;
  bookingDate: string;
  bookingTime: string;
};

export type ProfileOnboarding = {
  currentStep?: string;
  completedSteps?: string[];
  completedPhases?: string[];
  isOnboardingCompleted: boolean;
  skipOnboarding?: boolean;
  branchId?: string;
  steps?: string[];
};

export type ProfileResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    isOwner: boolean;
    status: string;
  };
  partner: {
    id: string;
    serviceProviderType: string;
    status: string;
    phone: string;
    email: string;
  } | null;
  businessProfile: ProfileBusinessProfile | null;
  location: ProfileLocation | null;
  billingInfo: ProfileBillingInfo | null;
  bookSlot: ProfileBookSlot | null;
  roles: ProfileRole[];
  branchAccess: ProfileBranchAccess[];
  primaryBranch: ProfilePrimaryBranch | null;
  onboarding: ProfileOnboarding;
};
