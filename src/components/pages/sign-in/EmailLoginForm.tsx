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
import { useGetProfile } from '@/react-query/auth/mutations';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { signInSchema } from '@/validations/auth';
import { FormFooter } from './FormFooter';

// function handleUnauthorized(onboardingStore: any, signupStore: any) {
//   localStorage.clear();
//   sessionStorage.clear();
//   onboardingStore.reset();
//   signupStore.reset();
// }

export function EmailLoginForm({ onSwitchToPhone }: { onSwitchToPhone?: () => void }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null); // Profile data state
  const onboardingStore = useOnboardingStore();
  const getProfileMutation = useGetProfile();
  console.warn(profile);

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
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const loginBody = await resp
        .clone()
        .json()
        .catch(() => null);
      console.warn('Login response headers:', Array.from(resp.headers.entries()));
      console.warn('Login response body:', loginBody);
      // if (!resp.ok) {
      //   if (resp.status === 401) {
      //     handleUnauthorized(onboardingStore, signupStore);
      //     throw new Error('Unauthorized: Cleared local data');
      //   }
      //   throw new Error('Login failed');
      // }
      const accessToken = loginBody?.accessToken;
      if (!accessToken) {
        toast.error('No access token received');
        setIsLoading(false);
        return;
      }
      localStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('accessToken', accessToken);

      const profileData: any = await getProfileMutation.mutateAsync();
      setProfile(profileData); // Save profile data in local state
      onboardingStore.setProfile(profileData); // Save profile data in global store
      const step2 = profileData?.step2;
      const step3 = profileData?.step3;
      const accountStatus = profileData?.partner?.businessProfile?.verificationStatus;
      const businessProfile: any = profileData?.partner?.businessProfile;
      router.push(
        !step2
          ? `/onboarding/${businessProfile?.currentPage || 'welcome'}`
          : businessProfile?.verificationStatus === 'verified' && !step3
            ? '/onboarding/business-hours-setup'
            : step3
              ? accountStatus === 'verified'
                ? '/onboarding/open-business-intro'
                : '/onboarding/welcome'
              : '/onboarding/welcome'
      );
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
