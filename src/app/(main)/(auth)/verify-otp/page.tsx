'use client';

import type { OTPInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useResendOtp, useVerifyOtp } from '@/api/auth/mutations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { otpSchema } from '@/validations/auth';

export default function VerifyOTPPage() {
  const router = useRouter();
  const [isAutoLogging, setIsAutoLogging] = useState(false);
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  // Get userId from sessionStorage (runs once on mount)
  const userId = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return sessionStorage.getItem('pendingUserId');
  }, []);

  useEffect(() => {
    if (!userId) {
      router.push('/sign-up');
    }
  }, [userId, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = (data: OTPInput) => {
    if (!userId) {
      return;
    }

    verifyOtpMutation.mutate(
      { userId, otp: data.otp },
      {
        onSuccess: async (result) => {
          setIsAutoLogging(true);
          sessionStorage.removeItem('pendingUserId');

          // Auto-login with the tokens from OTP verification
          const signInResult = await signIn('credentials', {
            email: result.user.email,
            userId: result.user.id,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            isTokenLogin: 'true',
            redirect: false,
          });

          if (signInResult?.error) {
            toast.error('Auto-login failed. Please sign in manually.');
            router.push('/sign-in');
          } else {
            toast.success('Email verified! Welcome!');
            router.push('/dashboard');
          }
          setIsAutoLogging(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Verification failed');
        },
      }
    );
  };

  const resendOTP = () => {
    if (!userId) {
      return;
    }

    resendOtpMutation.mutate(
      { userId },
      {
        onSuccess: () => {
          toast.success('OTP sent! Please check your email.');
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to resend OTP');
        },
      }
    );
  };

  const isLoading = verifyOtpMutation.isPending || isAutoLogging;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {verifyOtpMutation.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(verifyOtpMutation.error as any).response?.data?.message ||
                    'Verification failed'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input id="otp" type="text" placeholder="123456" maxLength={6} {...register('otp')} />
              {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isAutoLogging
                ? 'Logging in...'
                : verifyOtpMutation.isPending
                  ? 'Verifying...'
                  : 'Verify'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={resendOTP}
                disabled={resendOtpMutation.isPending}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                {resendOtpMutation.isPending ? 'Sending...' : 'Resend OTP'}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
