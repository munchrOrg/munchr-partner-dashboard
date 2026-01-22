'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useProfile } from '@/react-query/auth/queries';
import { useAuthStore } from '@/stores/auth-store';

type ProfileSetupAuthGuardProps = {
  children: React.ReactNode;
};

type AuthResult = {
  isChecking: boolean;
  isAuthorized: boolean;
  redirectTo: string | null;
};

export function ProfileSetupAuthGuard({ children }: ProfileSetupAuthGuardProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: profile, isLoading, error } = useProfile();

  const authResult = useMemo((): AuthResult => {
    if (!accessToken) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/sign-in',
      };
    }

    if (isLoading) {
      return {
        isChecking: true,
        isAuthorized: false,
        redirectTo: null,
      };
    }

    if (error || !profile) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/sign-in',
      };
    }

    const isOwner = profile.user?.isOwner;
    const skipOnboarding = profile.onboarding?.skipOnboarding;
    const isOnboardingCompleted = profile.onboarding?.isOnboardingCompleted;

    if (isOwner === true) {
      if (isOnboardingCompleted || skipOnboarding) {
        return {
          isChecking: false,
          isAuthorized: false,
          redirectTo: '/dashboard',
        };
      }
      const currentStep = profile.onboarding?.currentStep || 'welcome';
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: `/onboarding/${currentStep}`,
      };
    }

    if (isOnboardingCompleted || skipOnboarding) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/dashboard',
      };
    }

    return {
      isChecking: false,
      isAuthorized: true,
      redirectTo: null,
    };
  }, [accessToken, profile, isLoading, error]);

  useEffect(() => {
    if (authResult.redirectTo) {
      router.replace(authResult.redirectTo);
    }
  }, [authResult, router]);

  if (authResult.isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (!authResult.isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
