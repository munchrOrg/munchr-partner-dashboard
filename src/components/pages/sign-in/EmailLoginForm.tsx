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
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSignupStore } from '@/stores/signup-store';
import { OnboardingPhase } from '@/types/onboarding';
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
      const {
        formData,
        isEmailVerified,
        isPhoneVerified,
        reset: resetSignup,
      } = useSignupStore.getState();
      const { completedPhases, reset: resetOnboarding } = useOnboardingStore.getState();

      if (!formData.email || !formData.phoneNumber) {
        resetSignup();
        resetOnboarding();
        toast.error('Please complete signup first');
        router.push('/sign-up');
        return;
      }

      const isMatchingUser = formData.email.toLowerCase() === data.email.toLowerCase();

      if (!isMatchingUser) {
        resetSignup();
        resetOnboarding();
        toast.error('Please complete signup first');
        router.push('/sign-up');
        return;
      }

      if (!isEmailVerified || !isPhoneVerified) {
        if (!isEmailVerified) {
          router.push('/verify-email?type=signup');
        } else {
          router.push('/verify-phone?type=signup');
        }
        return;
      }

      if (completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS)) {
        router.push('/verify-email?type=login');
        return;
      }

      router.push('/verify-email?type=login');
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
