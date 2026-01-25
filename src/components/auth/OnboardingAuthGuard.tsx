'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { getUserType } from '@/constants/roles';
import { useOnboardingInit } from '@/hooks/useOnboardingInit';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { OnboardingPhase } from '@/types/onboarding';

type OnboardingAuthGuardProps = {
  children: React.ReactNode;
};

type AuthResult = {
  isChecking: boolean;
  isAuthorized: boolean;
  redirectTo: string | null;
  shouldClearAuth: boolean;
  showPendingApprovalToast: boolean;
};

export function OnboardingAuthGuard({ children }: OnboardingAuthGuardProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const toastShownRef = useRef(false);

  const { isInitialized, isInitializing, error } = useOnboardingInit();

  const { profileData, completedPhases } = useOnboardingProfileStore();

  const authResult = useMemo((): AuthResult => {
    if (!hasHydrated) {
      return {
        isChecking: true,
        isAuthorized: false,
        redirectTo: null,
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (!accessToken) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/sign-in',
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (isInitializing || !isInitialized) {
      return {
        isChecking: true,
        isAuthorized: false,
        redirectTo: null,
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (error || !profileData) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/sign-in',
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (profileData.onboarding?.isOnboardingCompleted) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/dashboard',
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (profileData.onboarding?.skipOnboarding) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/dashboard',
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    const userType = getUserType(profileData.roles);

    if (userType === 'unknown') {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/sign-in',
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (userType === 'branch_manager') {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/profile-setup',
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (userType === 'branch_user') {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/dashboard',
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    const partnerStatus = profileData.partner?.status;
    if (partnerStatus === 'pending_approval') {
      const hasCompletedPhase1 = completedPhases.includes(OnboardingPhase.ADD_BUSINESS);
      const hasCompletedPhase2 = completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS);
      const hasStartedPhase3 = completedPhases.includes(OnboardingPhase.OPEN_BUSINESS);

      if (hasCompletedPhase1 && hasCompletedPhase2 && !hasStartedPhase3) {
        return {
          isChecking: false,
          isAuthorized: false,
          redirectTo: '/sign-in',
          shouldClearAuth: true,
          showPendingApprovalToast: true,
        };
      }
    }

    return {
      isChecking: false,
      isAuthorized: true,
      redirectTo: null,
      shouldClearAuth: false,
      showPendingApprovalToast: false,
    };
  }, [
    hasHydrated,
    accessToken,
    isInitialized,
    isInitializing,
    error,
    profileData,
    completedPhases,
  ]);

  useEffect(() => {
    if (authResult.showPendingApprovalToast && !toastShownRef.current) {
      toast.error('Your account is pending approval. Please wait for verification.');
      toastShownRef.current = true;
    }

    if (authResult.shouldClearAuth) {
      useAuthStore.getState().clearAuth();
    }

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
