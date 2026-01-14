import type { UseMutationOptions } from '@tanstack/react-query';
import type {
  ResendOtpRequest,
  SignUpRequest,
  SignUpResponse,
  VerifyEmailRequest,
  VerifyOtpRequest,
  VerifyPhoneRequest,
} from './types';
import { useMutation } from '@tanstack/react-query';
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
