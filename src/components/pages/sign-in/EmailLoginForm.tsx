'use client';

import type { SignInInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { useSignupStore } from '@/stores/signup-store';
import { signInSchema } from '@/validations/auth';
import { FormFooter } from './FormFooter';

type EmailLoginFormProps = {
  onSwitchToPhone: () => void;
};

export function EmailLoginForm({ onSwitchToPhone }: EmailLoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log({ data });

      const { accountStatus, isEmailVerified, isPhoneVerified, formData } =
        useSignupStore.getState();

      if (!isEmailVerified || !isPhoneVerified) {
        if (!formData.email) {
          toast.error('Please complete signup first');
          router.push('/sign-up');
        } else if (!isEmailVerified) {
          toast.info('Please verify your email to continue');
          router.push(
            `/verify-email?email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phoneNumber)}`
          );
        } else {
          toast.info('Please verify your phone to continue');
          router.push(`/verify-phone?phone=${encodeURIComponent(formData.phoneNumber)}`);
        }
        return;
      }

      if (accountStatus === 'in_review') {
        toast.info('Your account is under review. You will be notified when admin approves.');
        router.push('/onboarding/portal-setup-complete');
        return;
      }

      if (accountStatus === 'approved') {
        router.push('/dashboard');
        return;
      }

      router.push('/onboarding/welcome');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-start">
      <h1 className="mb-6 text-center text-xl font-semibold sm:text-2xl">Log in with your email</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
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

        <div>
          <Input
            type="password"
            placeholder="Enter your password"
            className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 ml-4 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm font-semibold underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-yellow h-11 w-full rounded-full font-medium text-black hover:bg-amber-500 sm:h-12"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>

        <div className="my-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-full border-gray-300 sm:h-12"
          onClick={onSwitchToPhone}
        >
          <Icon name="mobileIcon" className="mr-2 size-7" />
          Log in with phone number
        </Button>

        <FormFooter />
      </form>
    </div>
  );
}
