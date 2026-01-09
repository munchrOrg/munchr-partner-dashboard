'use client';

import type { ForgotPasswordInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema } from '@/validations/auth';

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      // Handler to be implemented - should send reset link to email
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch {
      setError('root', { message: 'An unexpected error occurred' });
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <h1 className="mb-4 text-xl font-semibold sm:text-2xl">Check your email</h1>
        <p className="mb-6 text-sm text-gray-600">
          We&apos;ve sent a password reset link to <strong>{submittedEmail}</strong>
        </p>
        <Link href="/sign-in" className="text-sm font-medium text-amber-500 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Trouble logging in?</h1>
      <p className="mb-6 text-sm text-gray-600">
        Enter your email and we&apos;ll send you a link to reset your password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div>
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 ml-4 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full bg-gray-100 font-medium text-black hover:bg-gray-200 sm:h-12"
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
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
