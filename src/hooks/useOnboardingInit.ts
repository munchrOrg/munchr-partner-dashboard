'use client';

import { useEffect } from 'react';
import { useProfile } from '@/react-query/auth/queries';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';

export function useOnboardingInit() {
  const { isInitialized, isInitializing, initialize, setInitializing, setInitError } =
    useOnboardingProfileStore();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useProfile({
    enabled: !isInitialized,
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

  useEffect(() => {
    if (!isInitialized && !isInitializing && !profile && !isLoading && !error) {
      refetch();
    }
  }, [isInitialized, isInitializing, profile, isLoading, error, refetch]);

  return {
    isInitialized,
    isInitializing: isInitializing || isLoading,
    error: error?.message || null,
  };
}
