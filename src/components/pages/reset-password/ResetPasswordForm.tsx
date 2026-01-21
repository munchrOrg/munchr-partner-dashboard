'use client';

import type { ResetPasswordInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/react-query/auth/mutations';
import { resetPasswordSchema } from '@/validations/auth';

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get token directly from URL params
  const resetToken = searchParams.get('token');

  const resetPasswordMutation = useResetPassword();

  // Handle redirect if no token
  useEffect(() => {
    if (!resetToken) {
      toast.error('Invalid reset token. Please try again.');
      router.push('/forgot-password');
    }
  }, [resetToken, router]);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!resetToken) {
      toast.error('Invalid reset token');
      return;
    }

    try {
      const response = await resetPasswordMutation.mutateAsync({
        resetToken,
        newPassword: data.password,
      });

      if (response.success) {
        router.push('/sign-in');
      }
    } catch {}
  };

  return (
    <div className="w-full">
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Reset Password</h1>
      <p className="mb-6 text-sm text-gray-600">
        Make sure your password is different from previous password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="password"
            placeholder="Enter your New password"
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 ml-4 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Re-type password"
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 ml-4 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || resetPasswordMutation.isPending || !resetToken}
          className="bg-gradient-yellow h-11 w-full rounded-full text-black sm:h-12"
        >
          {isSubmitting || resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
        </Button>

        <div className="text-center">
          <Link href="/sign-in" className="text-sm font-medium text-amber-500 hover:underline">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
