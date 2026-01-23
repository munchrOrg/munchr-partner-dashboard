'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  canGoBack,
  getNextStep,
  isLastStepOfPhase,
  PHASE_ENTRY_STEP,
  STEP_PHASE_MAP,
} from '@/config/onboarding-steps';
import { useOnboardingUpdateProfile } from '@/hooks/useOnboardingUpdateProfile';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
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

  const {
    currentStep,
    completedPhases,
    previousStep,
    openProgressDrawer,
    isSubmitting,
    isUploading,
  } = useOnboardingProfileStore();

  const { updateProfile, isPending } = useOnboardingUpdateProfile();

  const showBack = canGoBack(currentStep);
  const formId = 'onboarding-step-form';
  const hasForm = !STEPS_WITHOUT_FORMS.has(currentStep);

  const getNextStepAfterWelcome = useCallback((): OnboardingStep => {
    if (completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS)) {
      return PHASE_ENTRY_STEP[OnboardingPhase.OPEN_BUSINESS];
    }
    if (completedPhases.includes(OnboardingPhase.ADD_BUSINESS)) {
      return PHASE_ENTRY_STEP[OnboardingPhase.VERIFY_BUSINESS];
    }
    return PHASE_ENTRY_STEP[OnboardingPhase.ADD_BUSINESS];
  }, [completedPhases]);

  const completeStepAction = useCallback(
    async (step: OnboardingStep) => {
      const isPhaseComplete = isLastStepOfPhase(step);
      const phase = STEP_PHASE_MAP[step];
      const nextStep =
        step === OnboardingStep.WELCOME ? getNextStepAfterWelcome() : getNextStep(step);

      try {
        const payload: any = {
          completeStep: step,
          currentStep: nextStep || step,
        };

        if (isPhaseComplete) {
          payload.completePhase = phase;
        }

        await updateProfile(payload, {
          shouldAdvanceStep: true,
          onSuccess: () => {
            if (phase === OnboardingPhase.VERIFY_BUSINESS && isPhaseComplete) {
              router.push('/sign-in');
              return;
            }
            if (!nextStep) {
              router.push('/dashboard');
            }
          },
        });
      } catch (error) {
        console.error('Failed to sync onboarding progress:', error);
      }
    },
    [updateProfile, getNextStepAfterWelcome, router]
  );

  const handleBack = useCallback(() => {
    previousStep();
  }, [previousStep]);

  const handleContinue = useCallback(() => {
    if (STEPS_WITHOUT_FORMS.has(currentStep)) {
      completeStepAction(currentStep);
    }
  }, [currentStep, completeStepAction]);

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
              disabled={isPending || isSubmitting}
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
            disabled={isPending || isSubmitting || isUploading}
            className="bg-gradient-yellow size-full rounded-full px-6 text-lg font-medium text-black disabled:opacity-50"
          >
            {isPending || isSubmitting ? 'Saving...' : isUploading ? 'Uploading...' : 'Continue'}
          </Button>
        </div>
      </div>
    </footer>
  );
}
