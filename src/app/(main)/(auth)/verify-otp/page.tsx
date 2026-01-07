'use client';

import type { OTPInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { otpSchema } from '@/validations/auth';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Get userId from URL params (set by NextAuth signup callback)
  const userId = searchParams.get('userId');

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

  const onSubmit = async (data: OTPInput) => {
    if (!userId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('verify-otp', {
        userId,
        otp: data.otp,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        toast.success('Email verified! Welcome!');
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!userId) {
      return;
    }

    setIsResending(true);

    try {
      const result = await signIn('resend-otp', {
        userId,
        redirect: false,
      });

      // We expect an error here because resend-otp throws OTP_RESENT
      if (result?.error === 'OTP_RESENT') {
        toast.success('OTP sent! Please check your email.');
      } else if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input id="otp" type="text" placeholder="123456" maxLength={6} {...register('otp')} />
              {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={resendOTP}
                disabled={isResending}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
