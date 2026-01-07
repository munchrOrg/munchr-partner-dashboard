export type SignUpRequest = {
  email: string;
  password: string;
};

export type SignUpResponse = {
  message: string;
  userId: string;
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
