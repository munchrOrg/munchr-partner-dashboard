'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  canGoBack,
  getNextStep,
  isLastStepOfPhase,
  STEP_FORM_KEY_MAP,
  STEP_PHASE_MAP,
  STEPS_WITHOUT_FORMS,
} from '@/config/onboarding-steps';
import { useUpdateProfile } from '@/react-query/auth/mutations';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { OnboardingStep } from '@/types/onboarding';
import { transformFormDataToPayload } from '@/utils/onboarding-payload';

export function OnboardingFooter() {
  const router = useRouter();
  const isSubmittingRef = useRef(false);

  const {
    currentStep,
    completedPhases,
    formData,
    previousStep,
    openProgressDrawer,
    isSubmitting,
    isUploading,
    pendingFormSubmit,
    setPendingFormSubmit,
    setIsSubmitting,
    completeStep,
    completePhase,
    setCurrentStep,
    mergeProfileFromResponse,
  } = useOnboardingProfileStore();

  const updateProfileMutation = useUpdateProfile();
  const isPending = updateProfileMutation.isPending;

  const showBack = canGoBack(currentStep);
  const formId = 'onboarding-step-form';
  const hasForm = !STEPS_WITHOUT_FORMS.has(currentStep);

  useEffect(() => {
    if (!pendingFormSubmit || isSubmittingRef.current) {
      return;
    }

    if ((currentStep as string) === OnboardingStep.PORTAL_SETUP_COMPLETE) {
      setPendingFormSubmit(false);
      return;
    }

    isSubmittingRef.current = true;
    setPendingFormSubmit(false);

    const submitToApi = async () => {
      const step = currentStep;
      const isPhaseComplete = isLastStepOfPhase(step);
      const phase = STEP_PHASE_MAP[step];
      const nextStep = getNextStep(step, completedPhases);

      const formKey = STEP_FORM_KEY_MAP[step];
      const stepFormData = formKey ? (formData[formKey] ?? null) : null;
      const transformedPayload = formKey ? transformFormDataToPayload(formKey, stepFormData) : {};

      const payload = {
        ...transformedPayload,
        completeStep: step,
        currentStep: nextStep || step,

        ...(isPhaseComplete &&
          step !== OnboardingStep.PORTAL_SETUP_COMPLETE && { completePhase: phase }),
      };

      try {
        setIsSubmitting(true);
        const response = await updateProfileMutation.mutateAsync(payload);

        mergeProfileFromResponse(response);
        completeStep(step);
        if (isPhaseComplete) {
          completePhase(phase);
        }

        if (!nextStep) {
          router.push('/dashboard');
          return;
        }

        setCurrentStep(nextStep);
      } catch (error) {
        console.error('Failed to save onboarding progress:', error);
        toast.error('Failed to save. Please try again.');
      } finally {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    };

    submitToApi();
  }, [pendingFormSubmit]);

  const handleBack = useCallback(() => {
    previousStep();
  }, [previousStep]);

  const handleContinue = useCallback(() => {
    if (STEPS_WITHOUT_FORMS.has(currentStep)) {
      setPendingFormSubmit(true);
    }
  }, [currentStep, setPendingFormSubmit]);

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
