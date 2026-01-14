import type {
  ResendOtpRequest,
  ResendOtpResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
} from './types';
import apiClient from '@/lib/axios';

export const authService = {
  signUp: (data: SignUpRequest) =>
    apiClient.post<SignUpResponse>('auth/register', data).then((res) => res.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    apiClient.post<VerifyOtpResponse>('auth/otp/verify', data).then((res) => res.data),

  resendOtp: (data: ResendOtpRequest) =>
    apiClient.post<ResendOtpResponse>('auth/otp/resend', data).then((res) => res.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient.post<VerifyEmailResponse>('auth/verify-email', data).then((res) => res.data),

  verifyPhone: (data: VerifyPhoneRequest) =>
    apiClient.post<VerifyPhoneResponse>('auth/verify-phone', data).then((res) => res.data),
};
