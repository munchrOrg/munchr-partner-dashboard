'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  canGoBack,
  getNextPhase,
  getNextStep,
  getPrevStep,
  isLastStepOfPhase,
  PHASE_ENTRY_STEP,
  STEP_PHASE_MAP,
} from '@/config/onboarding-steps';
import { authKeys } from '@/react-query/auth/keys';
import { useUpdateProfile } from '@/react-query/auth/mutations';
import { useProfile } from '@/react-query/auth/queries';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

const STEPS_WITHOUT_FORMS = new Set([
  OnboardingStep.WELCOME,
  OnboardingStep.PORTAL_SETUP_COMPLETE,
  OnboardingStep.ADD_BUSINESS_INTRO,
  OnboardingStep.VERIFY_BUSINESS_INTRO,
  OnboardingStep.GROWTH_INFORMATION,
  OnboardingStep.OPEN_BUSINESS_INTRO,
]);

export function OnboardingFooter() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const currentStep = params.step as OnboardingStep;

  const { data: profile } = useProfile();
  const completedPhases = (profile?.onboarding?.completedPhases || []) as string[];

  const { openProgressDrawer, shouldNavigate, navigationStep, clearNavigation } =
    useOnboardingStore();

  const showBack = canGoBack(currentStep);

  const formId = 'onboarding-step-form';
  const hasForm = !STEPS_WITHOUT_FORMS.has(currentStep);

  const updateProfileMutation = useUpdateProfile();

  const executeNavigation = useCallback(
    async (step: OnboardingStep) => {
      const nextStep = getNextStep(step);
      const isPhaseComplete = isLastStepOfPhase(step);
      const phase = STEP_PHASE_MAP[step];

      try {
        const onboardingPayload: any = {
          completeStep: step,
          currentStep: nextStep || step,
        };

        if (isPhaseComplete) {
          onboardingPayload.completePhase = phase;
        }

        await updateProfileMutation.mutateAsync(onboardingPayload);

        await queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      } catch (error) {
        console.error('Failed to sync onboarding progress:', error);
        return;
      }

      if (isPhaseComplete) {
        const nextPhase = getNextPhase(phase);
        if (nextPhase) {
          router.push(`/onboarding/${OnboardingStep.WELCOME}`);
        } else {
          router.push('/dashboard');
        }
        return;
      }

      if (nextStep) {
        router.push(`/onboarding/${nextStep}`);
      }
    },
    [router, updateProfileMutation, queryClient]
  );

  const getNextPhaseEntryStep = useCallback((): OnboardingStep => {
    if (completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS)) {
      return PHASE_ENTRY_STEP[OnboardingPhase.OPEN_BUSINESS];
    }
    if (completedPhases.includes(OnboardingPhase.ADD_BUSINESS)) {
      return PHASE_ENTRY_STEP[OnboardingPhase.VERIFY_BUSINESS];
    }
    return PHASE_ENTRY_STEP[OnboardingPhase.ADD_BUSINESS];
  }, [completedPhases]);

  useEffect(() => {
    if (shouldNavigate && navigationStep) {
      executeNavigation(navigationStep);
      clearNavigation();
    }
  }, [shouldNavigate, navigationStep, executeNavigation, clearNavigation]);

  const handleBack = () => {
    const prevStep = getPrevStep(currentStep);
    if (prevStep) {
      router.push(`/onboarding/${prevStep}`);
    }
  };

  const handleContinue = () => {
    if (currentStep === OnboardingStep.WELCOME) {
      router.push(`/onboarding/${getNextPhaseEntryStep()}`);
      return;
    }

    if (STEPS_WITHOUT_FORMS.has(currentStep)) {
      executeNavigation(currentStep);
    }
  };

  if (currentStep === OnboardingStep.PORTAL_SETUP_COMPLETE) {
    return null;
  }

  return (
    <footer className="fixed right-0 bottom-0 left-0 border-t bg-white px-4 py-4 sm:px-8">
      <div className="mx-10 flex items-center justify-between">
        <div className="w-28">
          {showBack && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="size-full rounded-full border-gray-400 px-6 text-lg font-medium text-black"
            >
              Back
            </Button>
          )}
        </div>

        <button
          type="button"
          onClick={openProgressDrawer}
          className="text-purple-dark hover:text-purple-dark/80 flex cursor-pointer items-center gap-2 text-lg font-medium"
        >
          <Icon name="menuIcon" className="size-6" />
          <span>See Progress</span>
        </button>

        <div className="h-14 w-44 text-right">
          <Button
            type={hasForm ? 'submit' : 'button'}
            form={hasForm ? formId : undefined}
            onClick={hasForm ? undefined : handleContinue}
            disabled={updateProfileMutation.isPending}
            className="bg-gradient-yellow size-full rounded-full px-6 text-lg font-medium text-black disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </div>
    </footer>
  );
}
