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
