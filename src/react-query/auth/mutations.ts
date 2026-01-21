import type { UseMutationOptions } from '@tanstack/react-query';
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LogoutRequest,
  PhoneLoginRequest,
  RefreshTokenRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  VerifyEmailRequest,
  VerifyForgotPasswordOtpRequest,
  VerifyOtpRequest,
  VerifyPhoneRequest,
} from './types';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSignupStore } from '@/stores/signup-store';
import { authService } from './service';

// Email login
export const useLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      setAccessToken(response.accessToken);
    },
  });
};

// Phone login
export const usePhoneLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: PhoneLoginRequest) => authService.phoneLogin(data),
    onSuccess: (response) => {
      setAccessToken(response.accessToken);
    },
  });
};

// Refresh token
export const useRefreshToken = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => authService.refreshToken(data),
    onSuccess: (response) => {
      setAccessToken(response.accessToken);
    },
  });
};

// Logout
export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (data?: LogoutRequest) => authService.logout(data),
    onSuccess: () => {
      clearAuth();
      useOnboardingStore.getState().reset();
      useSignupStore.getState().reset();
    },
    onError: () => {
      // Even if logout fails on backend, clear local state
      clearAuth();
      useOnboardingStore.getState().reset();
      useSignupStore.getState().reset();
    },
  });
};

// Change password (authenticated)
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data) as Promise<ChangePasswordResponse>,
  });
};

export const useSignUp = ({
  options,
}: {
  options: UseMutationOptions<SignUpResponse, Error, SignUpRequest>;
}) => {
  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
    ...options,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
  });
};

export const useVerifyPhone = () => {
  return useMutation({
    mutationFn: (data: VerifyPhoneRequest) => authService.verifyPhone(data),
  });
};

export const useVerifyForgotPasswordOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyForgotPasswordOtpRequest) => authService.verifyForgotPasswordOtp(data),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authService.resendOtp(data),
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      authService.updateProfile(data) as Promise<UpdateProfileResponse>,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data) as Promise<ForgotPasswordResponse>,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      authService.resetPassword(data) as Promise<ResetPasswordResponse>,
  });
};

// For imperative profile fetch after login (use useProfile query from ./queries.ts for reactive fetching)
export const useGetProfile = () => {
  return useMutation({
    mutationFn: () => authService.getProfile(),
  });
};

export const useResendEmailOtp = () => {
  return useMutation({
    mutationFn: ({
      userId,
      email,
      purpose,
    }: {
      userId: string;
      email?: string;
      purpose: 'email_signup' | 'password_reset';
    }) =>
      authService.resendEmailOtp({
        userId,
        email,
        purpose,
      }),
  });
};

export const useResendPhoneOtp = () => {
  return useMutation({
    mutationFn: ({
      userId,
      phone,
      purpose,
    }: {
      userId: string;
      phone?: string;
      purpose: 'phone_signup' | 'password_reset';
    }) =>
      authService.resendPhoneOtp({
        userId,
        phone,
        purpose,
      }),
  });
};
