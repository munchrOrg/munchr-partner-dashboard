export type SignUpRequest = {
  email: string;
  password: string;
  serviceProviderType: string;
  businessName: string;
  businessDescription: string;
  phoneNumber: string;
  cuisines: string[];
  logoUrl: string;
};

export type SignUpResponse = {
  success: boolean;
  partnerId: string;
  message: string;
  requiresVerfication: {
    email: boolean;
    phone: boolean;
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

export type ResendOtpRequest = {
  userId: string;
};

export type ResendOtpResponse = {
  message: string;
};

export type VerifyEmailRequest = {
  partnerId: string;
  otp: string; // 6-digit OTP sent to user's email
};

export type VerifyEmailResponse = {
  success: boolean;
  message?: string;
};

export type VerifyPhoneRequest = {
  partnerId: string;
  otp: string; // 6-digit OTP sent to user's phone
};

export type VerifyPhoneResponse = {
  success: boolean;
  message?: string;
};

export type UpdateProfileRequest = {
  buildingName?: string;
  street: string;
  houseNumber: string;
  state: string;
  city?: string;
  area?: string;
  postalCode: string;
  comment?: string;
};

export type UpdateProfileResponse = {
  success: boolean;
  message?: string;
};

export type ProfileResponse = {
  success: boolean;
  data?: {
    email?: string;
    phoneNumber?: string;
    businessName?: string;
    businessDescription?: string;
    cuisines?: string[];
    location?: {
      buildingName?: string;
      street?: string;
      houseNumber?: string;
      state?: string;
      city?: string;
      area?: string;
      postalCode?: string;
      comment?: string;
      coordinates?: { lat: number; lng: number } | null;
    };
  };
};
