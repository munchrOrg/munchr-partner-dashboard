import type {
  ResendOtpRequest,
  ResendOtpResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from './types';
import apiClient from '@/lib/axios';

export const authService = {
  signUp: (data: SignUpRequest) =>
    apiClient.post<SignUpResponse>('/auth/register', data).then((res) => res.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    apiClient.post<VerifyOtpResponse>('/auth/otp/verify', data).then((res) => res.data),

  resendOtp: (data: ResendOtpRequest) =>
    apiClient.post<ResendOtpResponse>('/auth/otp/resend', data).then((res) => res.data),
};
