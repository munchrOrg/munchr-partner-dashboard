'use client';

import type { PendingApprovalError, VerificationRequiredError } from '@/react-query/auth/types';
import type { SignInInput } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { useGetProfile, useLogin } from '@/react-query/auth/mutations';
import { signInSchema } from '@/validations/auth';
import { FormFooter } from './FormFooter';

export function EmailLoginForm({ onSwitchToPhone }: { onSwitchToPhone?: () => void }) {
  const router = useRouter();
  const loginMutation = useLogin();
  const getProfileMutation = useGetProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const isLoading = loginMutation.isPending || getProfileMutation.isPending;

  const onSubmit = async (data: SignInInput) => {
    try {
      await loginMutation.mutateAsync(data);

      const profileData = await getProfileMutation.mutateAsync();

      if (profileData?.onboarding?.isComplete || profileData?.onboarding?.skipOnboarding) {
        router.push('/dashboard');
      } else {
        const targetStep = profileData?.onboarding?.currentStep || 'welcome';
        router.push(`/onboarding/${targetStep}`);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const errorData = err?.response?.data;

      if (status === 403 && errorData?.error === 'verification_required') {
        const verificationError = errorData as VerificationRequiredError;
        const email = getValues('email');
        const userId = verificationError.userId || '';
        const phone = verificationError.phone || '';

        if (!verificationError.emailVerified) {
          const params = new URLSearchParams({
            type: 'login',
            userId,
            email,
            phone,
          });
          router.push(`/verify-email?${params.toString()}`);
        } else if (!verificationError.phoneVerified) {
          const params = new URLSearchParams({
            type: 'login',
            userId,
            email,
            phone,
          });
          router.push(`/verify-phone?${params.toString()}`);
        }
        return;
      }

      if (status === 403 && errorData?.error === 'pending_approval') {
        const approvalError = errorData as PendingApprovalError;
        toast.error(
          approvalError.message || 'Your account is pending approval. Please wait for verification.'
        );
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-start">
      <h1 className="mb-6 text-center text-xl font-semibold sm:text-2xl">Log in with your email</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-full border-gray-300 sm:h-12"
          onClick={() => router.push('/profile-setup')}
        >
          Go to Profile Setup
        </Button> */}

        <FormFooter />
      </form>
    </div>
  );
}
