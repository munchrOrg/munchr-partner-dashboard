import type { UseMutationOptions } from '@tanstack/react-query';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResendOtpRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  VerifyEmailRequest,
  VerifyOtpRequest,
  VerifyPhoneRequest,
} from './types';
import { useMutation } from '@tanstack/react-query';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { authService } from './service';

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

export const useGetProfile = () => {
  const onboardingStore = useOnboardingStore.getState();
  return useMutation({
    mutationFn: async () => {
      const profileData = await authService.getProfile();
      onboardingStore.setProfile(profileData);
      return profileData;
    },
  });
};
