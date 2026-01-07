import type { ResendOtpRequest, SignUpRequest, VerifyOtpRequest } from './types';
import { useMutation } from '@tanstack/react-query';
import { authService } from './service';

export const useSignUp = () => {
  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
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
