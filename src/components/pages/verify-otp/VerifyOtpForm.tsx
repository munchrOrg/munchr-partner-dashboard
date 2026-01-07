'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const OTP_LENGTH = 6;

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }).fill(''));
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const userId = searchParams.get('userId');
  const phone = searchParams.get('phone');

  useEffect(() => {
    if (!userId && !phone) {
      router.push('/sign-up');
    }
  }, [userId, phone, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, OTP_LENGTH - 1)]?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== OTP_LENGTH) {
      setError('Please enter the complete code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('verify-otp', {
        userId,
        otp: otpCode,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        toast.success('Verified successfully!');
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !userId) {
      return;
    }

    try {
      const result = await signIn('resend-otp', {
        userId,
        redirect: false,
      });

      if (result?.error === 'OTP_RESENT') {
        toast.success('OTP sent! Please check your email.');
        setResendTimer(60);
      } else if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!userId && !phone) {
    return null;
  }

  return (
    <div className="w-full">
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Enter the code</h1>
      <p className="mb-6 text-sm text-gray-600">
        We have sent a verification code to your {phone ? 'Phone No' : 'email'}
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3">
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
          disabled={isLoading || otp.some((d) => !d)}
          className="h-11 w-full rounded-full text-black sm:h-12"
          style={{
            background: 'linear-gradient(90deg, #FFBE0D 0%, #F9F993 100%)',
          }}
        >
          {isLoading ? 'Verifying...' : 'Submit'}
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
              Resend code
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
