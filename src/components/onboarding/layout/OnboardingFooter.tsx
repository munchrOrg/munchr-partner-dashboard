'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  canGoBack,
  getNextPhase,
  getNextStep,
  getPrevStep,
  isLastStepOfPhase,
  STEP_PHASE_MAP,
} from '@/config/onboarding-steps';
import { IconLib } from '@/lib/icon';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingStep } from '@/types/onboarding';

export function OnboardingFooter() {
  const router = useRouter();
  const params = useParams();
  const currentStep = params.step as OnboardingStep;

  const { completeStep, completePhase, openProgressDrawer } = useOnboardingStore();

  const showBack = canGoBack(currentStep);

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
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="w-28">
          {showBack && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="rounded-full px-6"
            >
              Back
            </Button>
          )}
        </div>

        <button
          type="button"
          onClick={openProgressDrawer}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <IconLib.menuIcon className="h-5 w-5" />
          <span>See Progress</span>
        </button>

        <div className="w-28 text-right">
          <Button
            type="button"
            onClick={handleContinue}
            className="bg-gradient-yellow rounded-full px-6 text-black"
          >
            Continue
          </Button>
        </div>
      </div>
    </footer>
  );
}
