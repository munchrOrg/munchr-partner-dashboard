'use client';

import { useEffect } from 'react';
import { useProfile } from '@/react-query/auth/queries';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';

export function useOnboardingInit() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const { isInitialized, initialize, setInitializing, setInitError } = useOnboardingProfileStore();

  const shouldFetch = hasHydrated && !!accessToken && !isInitialized;

  const {
    data: profile,
    isLoading,
    error,
  } = useProfile({
    enabled: shouldFetch,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    if (isLoading) {
      setInitializing(true);
      return;
    }

    if (error) {
      setInitError(error.message || 'Failed to load profile');
      return;
    }

    if (profile) {
      initialize(profile);
    }
  }, [isInitialized, isLoading, error, profile, initialize, setInitializing, setInitError]);

  return {
    isInitialized,
    isInitializing: isLoading || (!isInitialized && shouldFetch),
    error: error?.message || null,
  };
}
