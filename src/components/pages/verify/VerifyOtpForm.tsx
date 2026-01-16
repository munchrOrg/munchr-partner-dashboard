'use client';

import type { OTPInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useVerifyEmail, useVerifyPhone } from '@/react-query/auth/mutations';
import { useResendEmailOtp, useResendPhoneOtp } from '@/react-query/auth/resendotp';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSignupStore } from '@/stores/signup-store';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';
import { otpSchema } from '@/validations/auth';

const OTP_LENGTH = 6;

type VerifyOtpFormProps = {
  type: 'email' | 'phone';
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
  const [resendTimer, setResendTimer] = useState(60);
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }).fill('') as string[]
  );
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { formData } = useSignupStore();
  const flowType = searchParams.get('type');
  const destination = type === 'email' ? formData.email : formData.phoneNumber;

  const config = CONFIG[type];

  const {
    setValue,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const verifyEmailMutation = useVerifyEmail();
  const verifyPhoneMutation = useVerifyPhone();
  const resendEmailOtpMutation = useResendEmailOtp();
  const resendPhoneOtpMutation = useResendPhoneOtp();
  const urlPartnerId =
    searchParams.get('partnerId') ??
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('partnerId')
      : null);
  const [partnerIdState] = useState<string | null>(
    urlPartnerId ?? useSignupStore.getState().partnerId ?? null
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
    try {
      if (type === 'email') {
        const partnerId = partnerIdState;
        if (!partnerId) {
          setError('otp', { message: 'Missing partnerId. Please provide it.' });
          return;
        }
        try {
          const otp = digits.join('');
          const json = await verifyEmailMutation.mutateAsync({ partnerId, otp });
          if (!json || !json.success) {
            setError('otp', { message: json?.message || 'Email verification failed' });
            return;
          }
          toast.success(json.message || config.successMessage);
        } catch {
          setError('otp', { message: 'Failed to verify email' });
          return;
        }
      } else {
        const partnerId = partnerIdState;
        if (!partnerId) {
          setError('otp', { message: 'Missing partnerId. Please provide it.' });
          return;
        }
        try {
          const otp = digits.join('');
          const json = await verifyPhoneMutation.mutateAsync({ partnerId, otp });
          if (!json || !json.success) {
            setError('otp', { message: json?.message || 'Phone verification failed' });
            return;
          }
          toast.success(json.message || config.successMessage);
        } catch {
          setError('otp', { message: 'Failed to verify phone' });
          return;
        }
      }
      if (type === 'phone') {
        try {
          const { email, password } = useSignupStore.getState().formData;
          if (email && password) {
            const deviceInfo = typeof navigator !== 'undefined' ? navigator.userAgent : 'web';
            const res = await signIn('login', { redirect: false, email, password, deviceInfo });
            if (res?.error) {
              toast.error(res.error || 'Login failed after verification');
            } else {
              toast.success('Logged in successfully');
            }
          }
        } catch {}
      }

      if (flowType === 'login') {
        const { completedPhases } = useOnboardingStore.getState();
        const { accountStatus: currentAccountStatus } = useSignupStore.getState();

        if (
          completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS) &&
          currentAccountStatus !== 'approved'
        ) {
          setShowReviewDialog(true);
          return;
        }

        if (completedPhases.includes(OnboardingPhase.OPEN_BUSINESS)) {
          router.push('/dashboard');
          return;
        }

        if (completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS)) {
          router.push(`/onboarding/${OnboardingStep.OPEN_BUSINESS_INTRO}`);
          return;
        }

        router.push(`/onboarding/${OnboardingStep.WELCOME}`);
        return;
      }

      if (type === 'email') {
        const { setEmailVerified } = useSignupStore.getState();
        setEmailVerified(true);
        router.push('/verify-phone?type=signup');
      } else {
        const { setPhoneVerified } = useSignupStore.getState();
        setPhoneVerified(true);
        router.push('/onboarding/welcome');
      }
    } catch {
      setError('otp', { message: 'An unexpected error occurred' });
    }
  };

  const handleReviewDialogClose = () => {
    setShowReviewDialog(false);
    signOut({ redirect: false });
    router.push('/sign-in');
  };

  const handleResend = async () => {
    if (resendTimer > 0) {
      return;
    }
    if (type === 'email') {
      await resendEmailOtpMutation.mutateAsync({
        partnerId: partnerIdState!,
        email: destination,
      });
    } else {
      await resendPhoneOtpMutation.mutateAsync({
        partnerId: partnerIdState!,
        phone: destination,
      });
    }

    try {
      toast.success(`OTP sent to your ${type}!`);
      setResendTimer(60);
    } catch {
      toast.error('Failed to resend OTP');
    }
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
    <>
      <div className="w-full">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl">{config.title}</h1>
        <p className="mb-6 text-sm text-gray-600">{config.getDescription(destination)}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.otp && (
            <Alert variant="destructive">
              <AlertDescription>{errors.otp.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/** eslint-disable-next-line react/no-array-index-key -- fixed size OTP inputs */}
            {digits.map((digit, index) => (
              <div key={`otp-input-${index}`} className="flex items-center gap-2 sm:gap-3">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-10 rounded-lg border border-gray-300 text-center text-lg font-medium outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 sm:h-14 sm:w-12 sm:text-xl"
                />
                {index === 2 && <span className="text-xl text-gray-400">—</span>}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting || digits.some((d) => !d) || (type === 'email' && !partnerIdState)
            }
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

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Account Under Review</DialogTitle>
            <DialogDescription>
              Your application is currently under review. You will be notified once your account has
              been approved and you can proceed to set up your business hours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleReviewDialogClose} className="bg-gradient-yellow text-black">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
