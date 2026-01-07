'use client';

import type { ResetPasswordInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/validations/auth';

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      // Handler to be implemented - should reset password and redirect to sign-in
      console.log('Reset password:', data.password);
    } catch {
      setError('root', { message: 'An unexpected error occurred' });
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Reset Password</h1>
      <p className="mb-6 text-sm text-gray-600">
        Make sure your password is different from previous password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

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
          disabled={isSubmitting}
          className="bg-gradient-yellow h-11 w-full rounded-full text-black sm:h-12"
        >
          {isSubmitting ? 'Resetting...' : 'Submit'}
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
