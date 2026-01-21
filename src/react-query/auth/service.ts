import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PhoneLoginRequest,
  ProfileResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResendEmailOtpRequest,
  ResendOtpRequest,
  ResendOtpResponse,
  ResendPhoneOtpRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyForgotPasswordOtpRequest,
  VerifyForgotPasswordOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
} from './types';
import apiClient from '@/lib/axios';

export const authService = {
  // Login with email
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('v1/auth/login', data).then((res) => res.data),

  // Login with phone number
  phoneLogin: (data: PhoneLoginRequest) =>
    apiClient.post<LoginResponse>('v1/auth/login', data).then((res) => res.data),

  // Refresh access token
  refreshToken: (data: RefreshTokenRequest) =>
    apiClient.post<RefreshTokenResponse>('v1/auth/refresh', data).then((res) => res.data),

  // Logout
  logout: (data?: LogoutRequest) =>
    apiClient.post<LogoutResponse>('v1/auth/logout', data || {}).then((res) => res.data),

  // Change password (authenticated)
  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post<ChangePasswordResponse>('v1/auth/change-password', data).then((res) => res.data),

  signUp: (data: SignUpRequest) =>
    apiClient.post<SignUpResponse>('v1/auth/register', data).then((res) => res.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    apiClient.post<VerifyOtpResponse>('v1/auth/otp/verify', data).then((res) => res.data),

  resendOtp: (data: ResendOtpRequest) =>
    apiClient.post<ResendOtpResponse>('v1/auth/otp/resend', data).then((res) => res.data),

  resendEmailOtp: (data: ResendEmailOtpRequest) =>
    apiClient.post<ResendOtpResponse>('partner/otp/resend-email', data).then((res) => res.data),

  resendPhoneOtp: (data: ResendPhoneOtpRequest) =>
    apiClient.post<ResendOtpResponse>('api/partner/otp/resend-phone', data).then((res) => res.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient.post<VerifyEmailResponse>('v1/auth/verify-email', data).then((res) => res.data),

  verifyPhone: (data: VerifyPhoneRequest) =>
    apiClient.post<VerifyPhoneResponse>('v1/auth/verify-phone', data).then((res) => res.data),

  verifyForgotPasswordOtp: (data: VerifyForgotPasswordOtpRequest) =>
    apiClient
      .post<VerifyForgotPasswordOtpResponse>('v1/auth/verify-forgot-password-otp', data)
      .then((res) => res.data),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<UpdateProfileResponse>('v1/auth/update/profile', data).then((res) => res.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ForgotPasswordResponse>('v1/auth/forgot-password', data).then((res) => res.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ResetPasswordResponse>('v1/auth/reset-password', data).then((res) => res.data),

  getProfile: () => apiClient.get<ProfileResponse>('v1/auth/profile').then((res) => res.data),
};
