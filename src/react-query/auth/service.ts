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
import type { ApiResponse } from '@/types/api';
import apiClient from '@/lib/axios';

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('v1/auth/login', data).then((res) => res.data.data),

  phoneLogin: (data: PhoneLoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('v1/auth/login', data).then((res) => res.data.data),

  refreshToken: (data: RefreshTokenRequest) =>
    apiClient
      .post<ApiResponse<RefreshTokenResponse>>('v1/auth/refresh', data)
      .then((res) => res.data.data),

  logout: (data?: LogoutRequest) =>
    apiClient
      .post<ApiResponse<LogoutResponse>>('v1/auth/logout', data || {})
      .then((res) => res.data.data),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient
      .post<ApiResponse<ChangePasswordResponse>>('v1/auth/change-password', data)
      .then((res) => res.data.data),

  signUp: (data: SignUpRequest) =>
    apiClient
      .post<ApiResponse<SignUpResponse>>('v1/auth/register', data)
      .then((res) => res.data.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    apiClient
      .post<ApiResponse<VerifyOtpResponse>>('v1/auth/otp/verify', data)
      .then((res) => res.data.data),

  resendOtp: (data: ResendOtpRequest) =>
    apiClient
      .post<ApiResponse<ResendOtpResponse>>('v1/auth/otp/resend', data)
      .then((res) => res.data.data),

  resendEmailOtp: (data: ResendEmailOtpRequest) =>
    apiClient
      .post<ApiResponse<ResendOtpResponse>>('partner/otp/resend-email', data)
      .then((res) => res.data.data),

  resendPhoneOtp: (data: ResendPhoneOtpRequest) =>
    apiClient
      .post<ApiResponse<ResendOtpResponse>>('partner/otp/resend-phone', data)
      .then((res) => res.data.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient
      .post<ApiResponse<VerifyEmailResponse>>('v1/auth/verify-email', data)
      .then((res) => res.data.data),

  verifyPhone: (data: VerifyPhoneRequest) =>
    apiClient
      .post<ApiResponse<VerifyPhoneResponse>>('v1/auth/verify-phone', data)
      .then((res) => res.data.data),

  verifyForgotPasswordOtp: (data: VerifyForgotPasswordOtpRequest) =>
    apiClient
      .post<
        ApiResponse<VerifyForgotPasswordOtpResponse>
      >('v1/auth/verify-forgot-password-otp', data)
      .then((res) => res.data.data),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient
      .put<ApiResponse<UpdateProfileResponse>>('v1/auth/update/profile', data)
      .then((res) => res.data.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient
      .post<ApiResponse<ForgotPasswordResponse>>('v1/auth/forgot-password', data)
      .then((res) => res.data.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient
      .post<ApiResponse<ResetPasswordResponse>>('v1/auth/reset-password', data)
      .then((res) => res.data.data),

  getProfile: () =>
    apiClient.get<ApiResponse<ProfileResponse>>('v1/auth/profile').then((res) => res.data.data),
};
