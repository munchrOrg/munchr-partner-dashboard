'use client';

import type { UpdateProfileRequest } from '@/react-query/auth/types';
import type { OnboardingPhase, OnboardingStep } from '@/types/onboarding';
import { useCallback } from 'react';
import { getNextStep } from '@/config/onboarding-steps';
import { useUpdateProfile } from '@/react-query/auth/mutations';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';

type UpdateProfileOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  shouldAdvanceStep?: boolean;
};

export function useOnboardingUpdateProfile() {
  const updateProfileMutation = useUpdateProfile();
  const {
    currentStep,
    mergeProfileFromResponse,
    setIsSubmitting,
    completeStep,
    completePhase,
    nextStep,
  } = useOnboardingProfileStore();

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest, options?: UpdateProfileOptions) => {
      setIsSubmitting(true);

      try {
        const payload: UpdateProfileRequest = { ...data };

        if (options?.shouldAdvanceStep !== false && data.completeStep) {
          const nextStepValue = getNextStep(currentStep);
          if (nextStepValue) {
            payload.currentStep = nextStepValue;
          }
        }

        const response = await updateProfileMutation.mutateAsync(payload);

        mergeProfileFromResponse(response);

        if (data.completeStep) {
          completeStep(data.completeStep as OnboardingStep);
        }

        if (data.completePhase) {
          completePhase(data.completePhase as OnboardingPhase);
        }

        if (options?.shouldAdvanceStep !== false) {
          nextStep();
        }

        options?.onSuccess?.();

        return response;
      } catch (error) {
        options?.onError?.(error as Error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      currentStep,
      updateProfileMutation,
      mergeProfileFromResponse,
      setIsSubmitting,
      completeStep,
      completePhase,
      nextStep,
    ]
  );

  return {
    updateProfile,
    isPending: updateProfileMutation.isPending,
  };
}
