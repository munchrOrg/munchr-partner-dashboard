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
import { authClient, partnerClient } from '@/lib/axios';

export const authService = {
  login: (data: LoginRequest) =>
    authClient.post<ApiResponse<LoginResponse>>('v1/auth/login', data).then((res) => res.data.data),

  phoneLogin: (data: PhoneLoginRequest) =>
    authClient.post<ApiResponse<LoginResponse>>('v1/auth/login', data).then((res) => res.data.data),

  refreshToken: (data: RefreshTokenRequest) =>
    authClient
      .post<ApiResponse<RefreshTokenResponse>>('v1/auth/refresh', data)
      .then((res) => res.data.data),

  logout: (data?: LogoutRequest) =>
    authClient
      .post<ApiResponse<LogoutResponse>>('v1/auth/logout', data || {})
      .then((res) => res.data.data),

  changePassword: (data: ChangePasswordRequest) =>
    authClient
      .post<ApiResponse<ChangePasswordResponse>>('v1/auth/change-password', data)
      .then((res) => res.data.data),

  signUp: (data: SignUpRequest) =>
    partnerClient
      .post<ApiResponse<SignUpResponse>>('v1/auth/register', data)
      .then((res) => res.data.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    authClient
      .post<ApiResponse<VerifyOtpResponse>>('v1/auth/otp/verify', data)
      .then((res) => res.data.data),

  resendOtp: (data: ResendOtpRequest) =>
    authClient
      .post<ApiResponse<ResendOtpResponse>>('v1/auth/otp/resend', data)
      .then((res) => res.data.data),

  resendEmailOtp: (data: ResendEmailOtpRequest) =>
    authClient
      .post<ApiResponse<ResendOtpResponse>>('partner/otp/resend-email', data)
      .then((res) => res.data.data),

  resendPhoneOtp: (data: ResendPhoneOtpRequest) =>
    authClient
      .post<ApiResponse<ResendOtpResponse>>('partner/otp/resend-phone', data)
      .then((res) => res.data.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    authClient
      .post<ApiResponse<VerifyEmailResponse>>('v1/auth/verify-email', data)
      .then((res) => res.data.data),

  verifyPhone: (data: VerifyPhoneRequest) =>
    authClient
      .post<ApiResponse<VerifyPhoneResponse>>('v1/auth/verify-phone', data)
      .then((res) => res.data.data),

  verifyForgotPasswordOtp: (data: VerifyForgotPasswordOtpRequest) =>
    authClient
      .post<
        ApiResponse<VerifyForgotPasswordOtpResponse>
      >('v1/auth/verify-forgot-password-otp', data)
      .then((res) => res.data.data),

  updateProfile: (data: UpdateProfileRequest) =>
    partnerClient
      .put<ApiResponse<UpdateProfileResponse>>('v1/auth/update/profile', data)
      .then((res) => res.data.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    authClient
      .post<ApiResponse<ForgotPasswordResponse>>('v1/auth/forgot-password', data)
      .then((res) => res.data.data),

  resetPassword: (data: ResetPasswordRequest) =>
    authClient
      .post<ApiResponse<ResetPasswordResponse>>('v1/auth/reset-password', data)
      .then((res) => res.data.data),

  getProfile: () =>
    partnerClient.get<ApiResponse<ProfileResponse>>('v1/auth/profile').then((res) => res.data.data),
};
