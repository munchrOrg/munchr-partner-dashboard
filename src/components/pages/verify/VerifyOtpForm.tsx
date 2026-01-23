'use client';

import type { OTPInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  useResendEmailOtp,
  useResendPhoneOtp,
  useVerifyEmail,
  useVerifyPhone,
} from '@/react-query/auth/mutations';
import { useAuthStore } from '@/stores/auth-store';
import { useSignupStore } from '@/stores/signup-store';
import { otpSchema } from '@/validations/auth';

const OTP_LENGTH = 6;
const OTP_POSITIONS = Array.from({ length: OTP_LENGTH }, (_, i) => i);

type VerifyOtpFormProps = {
  type: 'email' | 'phone';
};

const normalizePhone = (phone: string) => {
  let p = phone.trim();
  if (p.startsWith('+')) {
    p = p.slice(1);
  }
  if (p.startsWith('03')) {
    p = `92${p.slice(1)}`;
  }
  p = p.replace(/\D/g, '');
  return p;
};

const CONFIG = {
  email: {
    title: 'Verify your email',
    getDescription: (destination: string) => `We have sent a verification code to ${destination}`,
    resendText: 'Resend code to email',
    successMessage: 'Email verified successfully!',
  },
  phone: {
    title: 'Verify your phone',
    getDescription: (destination: string) => `We have sent a verification code to ${destination}`,
    resendText: 'Resend code to phone',
    successMessage: 'Phone verified successfully!',
  },
};

export function VerifyOtpForm({ type }: VerifyOtpFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resendTimer, setResendTimer] = useState(0);
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }).fill('') as string[]
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const destination = type === 'email' ? searchParams.get('email') : searchParams.get('phone');

  const config = CONFIG[type];

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  // Hooks now automatically show toast errors
  const verifyEmailMutation = useVerifyEmail();
  const verifyPhoneMutation = useVerifyPhone();
  const resendEmailOtpMutation = useResendEmailOtp();
  const resendPhoneOtpMutation = useResendPhoneOtp();

  const urlUserId =
    searchParams.get('userId') ??
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('userId')
      : null);
  const [userIdState] = useState<string | null>(
    urlUserId ?? useSignupStore.getState().userId ?? null
  );

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendTimer]);

  const updateOtpValue = (newDigits: string[]) => {
    setDigits(newDigits);
    setValue('otp', newDigits.join(''), { shouldValidate: false });
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    updateOtpValue(newDigits);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (_data: OTPInput) => {
    const userId = userIdState;
    if (!userId) {
      toast.error('Missing userId. Please provide it.');
      return;
    }

    const otp = digits.join('');

    try {
      const response =
        type === 'email'
          ? await verifyEmailMutation.mutateAsync({ userId, otp })
          : await verifyPhoneMutation.mutateAsync({ userId, otp });

      if (!response || !response.success) {
        return;
      }

      toast.success(response.message || config.successMessage);

      const { setEmailVerified, setPhoneVerified } = useSignupStore.getState();
      if (type === 'email') {
        setEmailVerified(true);
      } else {
        setPhoneVerified(true);
      }

      if (response.tokens?.accessToken) {
        setAccessToken(response.tokens.accessToken);
      }

      const bothVerified = response.emailVerified && response.phoneVerified;

      if (bothVerified || response.accountActivated) {
        useSignupStore.getState().reset();
        router.replace('/onboarding');
        return;
      }

      if (type === 'email' && !response.phoneVerified) {
        const phone = searchParams.get('phone') || '';
        router.replace(
          `/verify-phone?type=signup&userId=${userId}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(searchParams.get('email') || '')}`
        );
      } else if (type === 'phone' && !response.emailVerified) {
        const email = searchParams.get('email') || '';
        router.replace(
          `/verify-email?type=signup&userId=${userId}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(searchParams.get('phone') || '')}`
        );
      } else {
        useSignupStore.getState().reset();
        router.replace('/onboarding');
      }
    } catch {}
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !destination) {
      return;
    }

    try {
      if (type === 'email') {
        await resendEmailOtpMutation.mutateAsync({
          userId: userIdState!,
          email: destination,
          purpose: 'email_signup',
        });
      } else {
        await resendPhoneOtpMutation.mutateAsync({
          userId: userIdState!,
          phone: normalizePhone(destination),
          purpose: 'phone_signup',
        });
      }

      setResendTimer(60);
    } catch {}
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!destination) {
    router.push('/sign-up');
    return null;
  }

  return (
    <div className="w-full">
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">{config.title}</h1>
      <p className="mb-6 text-sm text-gray-600">{config.getDescription(destination)}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {OTP_POSITIONS.map((position) => (
            <div key={`otp-position-${position}`} className="flex items-center gap-2 sm:gap-3">
              <input
                ref={(el) => {
                  inputRefs.current[position] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[position]}
                onChange={(e) => handleChange(position, e.target.value)}
                onKeyDown={(e) => handleKeyDown(position, e)}
                className="h-12 w-10 rounded-lg border border-gray-300 text-center text-lg font-medium outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 sm:h-14 sm:w-12 sm:text-xl"
              />
              {position === 2 && <span className="text-xl text-gray-400">—</span>}
            </div>
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || digits.some((d) => !d) || !userIdState}
          className="bg-gradient-yellow h-11 w-full rounded-full text-black sm:h-12"
        >
          {isSubmitting ? 'Verifying...' : 'Submit'}
        </Button>

        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-500">Re-send in -{formatTime(resendTimer)}</p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-medium text-amber-500 hover:underline"
            >
              {config.resendText}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
