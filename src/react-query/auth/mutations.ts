import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
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
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { useSignupStore } from '@/stores/signup-store';
import { authService } from './service';

type ApiErrorResponse = {
  message?: string;
  error?: string;
  statusCode?: number;
};

const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    axiosError?.message ||
    'An unexpected error occurred'
  );
};

const defaultOnError = (error: unknown) => {
  toast.error(getErrorMessage(error));
};

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, AxiosError<ApiErrorResponse>, TVariables>,
  'mutationFn'
>;

// Email login
export const useLogin = (options?: MutationOptions<LoginResponse, LoginRequest>) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      setAccessToken(response.accessToken);
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Phone login
export const usePhoneLogin = (options?: MutationOptions<LoginResponse, PhoneLoginRequest>) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: PhoneLoginRequest) => authService.phoneLogin(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      setAccessToken(response.accessToken);
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Refresh token
export const useRefreshToken = (
  options?: MutationOptions<RefreshTokenResponse, RefreshTokenRequest>
) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => authService.refreshToken(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      setAccessToken(response.accessToken);
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Logout
export const useLogout = (options?: MutationOptions<LogoutResponse, LogoutRequest | undefined>) => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (data?: LogoutRequest) => authService.logout(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      clearAuth();
      useOnboardingProfileStore.getState().reset();
      useSignupStore.getState().reset();
      queryClient.clear();
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      clearAuth();
      useOnboardingProfileStore.getState().reset();
      useSignupStore.getState().reset();
      queryClient.clear();
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

export const useChangePassword = (
  options?: MutationOptions<ChangePasswordResponse, ChangePasswordRequest>
) => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      toast.success(response.message || 'Password changed successfully');
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Sign up
export const useSignUp = (options?: MutationOptions<SignUpResponse, SignUpRequest>) => {
  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Verify OTP (generic)
export const useVerifyOtp = (options?: MutationOptions<VerifyOtpResponse, VerifyOtpRequest>) => {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Verify Email
export const useVerifyEmail = (
  options?: MutationOptions<VerifyEmailResponse, VerifyEmailRequest>
) => {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Verify Phone
export const useVerifyPhone = (
  options?: MutationOptions<VerifyPhoneResponse, VerifyPhoneRequest>
) => {
  return useMutation({
    mutationFn: (data: VerifyPhoneRequest) => authService.verifyPhone(data),
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Verify Forgot Password OTP
export const useVerifyForgotPasswordOtp = (
  options?: MutationOptions<VerifyForgotPasswordOtpResponse, VerifyForgotPasswordOtpRequest>
) => {
  return useMutation({
    mutationFn: (data: VerifyForgotPasswordOtpRequest) => authService.verifyForgotPasswordOtp(data),
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Resend OTP (generic)
export const useResendOtp = (options?: MutationOptions<ResendOtpResponse, ResendOtpRequest>) => {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authService.resendOtp(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      toast.success(response.message || 'OTP sent successfully');
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Resend Email OTP
export const useResendEmailOtp = (
  options?: MutationOptions<ResendOtpResponse, ResendEmailOtpRequest>
) => {
  return useMutation({
    mutationFn: (data: ResendEmailOtpRequest) => authService.resendEmailOtp(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      toast.success(response.message || 'OTP sent to email');
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Resend Phone OTP
export const useResendPhoneOtp = (
  options?: MutationOptions<ResendOtpResponse, ResendPhoneOtpRequest>
) => {
  return useMutation({
    mutationFn: (data: ResendPhoneOtpRequest) => authService.resendPhoneOtp(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      toast.success(response.message || 'OTP sent to phone');
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Update Profile
export const useUpdateProfile = (
  options?: MutationOptions<UpdateProfileResponse, UpdateProfileRequest>
) => {
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Forgot Password
export const useForgotPassword = (
  options?: MutationOptions<ForgotPasswordResponse, ForgotPasswordRequest>
) => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Reset Password
export const useResetPassword = (
  options?: MutationOptions<ResetPasswordResponse, ResetPasswordRequest>
) => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      toast.success(response.message || 'Password reset successfully');
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};

// Get Profile (imperative - for use after login)
export const useGetProfile = (options?: MutationOptions<ProfileResponse, void>) => {
  return useMutation({
    mutationFn: () => authService.getProfile(),
    onError: (error, variables, onMutateResult, context) => {
      defaultOnError(error);
      options?.onError?.(error, variables, onMutateResult, context);
    },
    ...options,
  });
};
