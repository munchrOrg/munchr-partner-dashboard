import type {
  ProfileResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
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
    apiClient.post<SignUpResponse>('v1/auth/register', data).then((res) => res.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    apiClient.post<VerifyOtpResponse>('v1/auth/otp/verify', data).then((res) => res.data),

  resendOtp: (data: ResendOtpRequest) =>
    apiClient.post<ResendOtpResponse>('v1/auth/otp/resend', data).then((res) => res.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient.post<VerifyEmailResponse>('v1/auth/verify-email', data).then((res) => res.data),

  verifyPhone: (data: VerifyPhoneRequest) =>
    apiClient.post<VerifyPhoneResponse>('v1/auth/verify-phone', data).then((res) => res.data),
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<UpdateProfileResponse>('v1/auth/update/profile', data).then((res) => res.data),
  getProfile: () => apiClient.get<ProfileResponse>('v1/auth/profile').then((res) => res.data),
};
