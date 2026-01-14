import type { UseMutationOptions } from '@tanstack/react-query';
import type { ResendOtpRequest, SignUpRequest, SignUpResponse, VerifyOtpRequest } from './types';
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

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authService.resendOtp(data),
  });
};
