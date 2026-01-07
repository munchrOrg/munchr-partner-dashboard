export type SignUpRequest = {
  email: string;
  password: string;
};

export type SignUpResponse = {
  userId: string;
  message: string;
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

export type ResendOtpRequest = {
  userId: string;
};

export type ResendOtpResponse = {
  message: string;
};
