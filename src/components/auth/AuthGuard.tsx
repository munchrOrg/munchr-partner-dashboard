'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { STEP_ORDER } from '@/config/onboarding-steps';
import { useProfile } from '@/react-query/auth/queries';
import { useAuthStore } from '@/stores/auth-store';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

type AuthGuardProps = {
  children: React.ReactNode;
  requireVerification?: boolean;
  enforceCurrentStep?: boolean;
};

type AuthResult = {
  isChecking: boolean;
  isAuthorized: boolean;
  redirectTo: string | null;
  shouldClearAuth: boolean;
  showPendingApprovalToast: boolean;
};

export function AuthGuard({
  children,
  requireVerification = true,
  enforceCurrentStep = true,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const toastShownRef = useRef(false);

  const { data: profile, isLoading, error } = useProfile();

  const authResult = useMemo((): AuthResult => {
    if (!accessToken) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: '/sign-in',
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (isLoading) {
      return {
        isChecking: true,
        isAuthorized: false,
        redirectTo: null,
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (error || !profile) {
      return {
        isChecking: false,
        isAuthorized: false,
        redirectTo: null,
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    if (pathname === `/onboarding/${OnboardingStep.PORTAL_SETUP_COMPLETE}`) {
      return {
        isChecking: false,
        isAuthorized: true,
        redirectTo: null,
        shouldClearAuth: false,
        showPendingApprovalToast: false,
      };
    }

    const emailVerified = profile.emailVerified ?? profile.partner?.emailVerified ?? true;
    const phoneVerified = profile.phoneVerified ?? profile.partner?.phoneVerified ?? true;

    if (requireVerification && (!emailVerified || !phoneVerified)) {
      const partnerId = profile.partner?.id || '';
      const email = profile.email || profile.partner?.email || '';
      const phone = profile.partner?.phone || '';

      if (!emailVerified) {
        const params = new URLSearchParams({
          type: 'verification',
          partnerId,
          email,
          phone,
        });
        return {
          isChecking: false,
          isAuthorized: false,
          redirectTo: `/verify-email?${params.toString()}`,
          shouldClearAuth: false,
          showPendingApprovalToast: false,
        };
      }

      if (!phoneVerified) {
        const params = new URLSearchParams({
          type: 'verification',
          partnerId,
          email,
          phone,
        });
        return {
          isChecking: false,
          isAuthorized: false,
          redirectTo: `/verify-phone?${params.toString()}`,
          shouldClearAuth: false,
          showPendingApprovalToast: false,
        };
      }
    }

    const partnerStatus = profile.partner?.status;
    const completedPhases = profile.onboarding?.completedPhases || [];

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

    const currentStep = profile.onboarding?.currentStep as OnboardingStep;
    const completedSteps = (profile.onboarding?.completedSteps || []) as string[];

    if (enforceCurrentStep && currentStep) {
      const expectedPath = `/onboarding/${currentStep}`;

      if (profile.onboarding?.isComplete) {
        if (pathname.startsWith('/dashboard')) {
          return {
            isChecking: false,
            isAuthorized: true,
            redirectTo: null,
            shouldClearAuth: false,
            showPendingApprovalToast: false,
          };
        }
        if (pathname.startsWith('/onboarding')) {
          return {
            isChecking: false,
            isAuthorized: false,
            redirectTo: '/dashboard',
            shouldClearAuth: false,
            showPendingApprovalToast: false,
          };
        }
      } else {
        // Not on onboarding page - redirect to current step
        if (!pathname.startsWith('/onboarding')) {
          return {
            isChecking: false,
            isAuthorized: false,
            redirectTo: expectedPath,
            shouldClearAuth: false,
            showPendingApprovalToast: false,
          };
        }

        const pathStep = pathname.replace('/onboarding/', '').split('/')[0] as OnboardingStep;
        const pathStepIndex = STEP_ORDER.indexOf(pathStep);
        const currentStepIndex = STEP_ORDER.indexOf(currentStep);

        const isOnCurrentStep = pathStep === currentStep;
        const isBackNavigation =
          pathStepIndex < currentStepIndex && completedSteps.includes(pathStep);

        const isAllowed = isOnCurrentStep || isBackNavigation;

        if (!isAllowed && pathStep) {
          return {
            isChecking: false,
            isAuthorized: false,
            redirectTo: expectedPath,
            shouldClearAuth: false,
            showPendingApprovalToast: false,
          };
        }
      }
    }

    return {
      isChecking: false,
      isAuthorized: true,
      redirectTo: null,
      shouldClearAuth: false,
      showPendingApprovalToast: false,
    };
  }, [accessToken, profile, isLoading, error, pathname, requireVerification, enforceCurrentStep]);

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
