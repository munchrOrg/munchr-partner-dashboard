'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  canGoBack,
  getNextPhase,
  getNextStep,
  getPrevStep,
  isLastStepOfPhase,
  STEP_PHASE_MAP,
} from '@/config/onboarding-steps';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingStep } from '@/types/onboarding';

// Steps that have forms that need to be submitted
const STEPS_WITH_FORMS: Record<string, string> = {
  [OnboardingStep.BUSINESS_LOCATION]: 'location-form',
};

export function OnboardingFooter() {
  const router = useRouter();
  const params = useParams();
  const currentStep = params.step as OnboardingStep;

  const { completeStep, completePhase, openProgressDrawer } = useOnboardingStore();

  const showBack = canGoBack(currentStep);
  const formId = STEPS_WITH_FORMS[currentStep];
  const hasForm = Boolean(formId);

  const handleBack = () => {
    const prevStep = getPrevStep(currentStep);
    if (prevStep) {
      router.push(`/onboarding/${prevStep}`);
    }
  };

  const handleContinue = () => {
    // Mark current step as completed
    completeStep(currentStep);

    // Check if this is the last step of a phase
    if (isLastStepOfPhase(currentStep)) {
      const currentPhase = STEP_PHASE_MAP[currentStep];
      completePhase(currentPhase);

      // Go back to welcome with phase completed
      const nextPhase = getNextPhase(currentPhase);
      if (nextPhase) {
        // Go to welcome first, then user clicks continue to go to next phase
        router.push(`/onboarding/${OnboardingStep.WELCOME}`);
      } else {
        // All phases complete, go to dashboard
        router.push('/dashboard');
      }
      return;
    }

    // Regular navigation to next step
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      router.push(`/onboarding/${nextStep}`);
    }
  };

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
            className="bg-gradient-yellow size-full rounded-full px-6 text-lg font-medium text-black"
          >
            Continue
          </Button>
        </div>
      </div>
    </footer>
  );
}
