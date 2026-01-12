'use client';

import type { ConfirmModalConfig } from '@/types/onboarding';
import { useParams, useRouter } from 'next/navigation';

import { useCallback, useEffect, useState } from 'react';
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
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

const STEPS_WITH_FORMS: Record<string, string> = {
  [OnboardingStep.BUSINESS_LOCATION]: 'location-form',
  [OnboardingStep.LEGAL_TAX_DETAILS]: 'legal-tax-form',
  [OnboardingStep.BANKING_DETAILS]: 'banking-form',
};

type StepBehavior = {
  type: 'modal' | 'emailConfirm' | 'default';
  modalConfig?: Omit<ConfirmModalConfig, 'onConfirm'>;
  validate?: (formData: any) => string | null;
};

const STEP_BEHAVIORS: Partial<Record<OnboardingStep, StepBehavior>> = {
  [OnboardingStep.BUSINESS_INFO_REVIEW]: {
    type: 'emailConfirm',
  },
  [OnboardingStep.DINE_IN_MENU_UPLOAD]: {
    type: 'modal',
    modalConfig: {
      title: 'Does your menu meet the requirements?',
      description:
        'If the menu fails to meet the conditions, we cannot process your request to join munchr.',
      bulletPoints: [
        'A minimum of menu items for Regular Restaurants, or 18 items for Home Chefs.',
        'All menu items have a price',
      ],
      confirmText: 'Yes, Continue',
      cancelText: 'No, Re-upload Menu',
    },
    validate: (formData) => {
      if (!formData.menu?.menuFile) {
        return 'Please upload your menu before continuing.';
      }
      return null;
    },
  },
  [OnboardingStep.OWNER_IDENTITY_UPLOAD]: {
    type: 'default',
    validate: (formData) => {
      const ownerIdentity = formData.ownerIdentity;
      if (ownerIdentity?.hasSNTN === null || ownerIdentity?.hasSNTN === undefined) {
        return 'Please select whether you have a Sales Tax Registration Number (SNTN).';
      }
      if (ownerIdentity.hasSNTN && !ownerIdentity.sntnFile) {
        return 'Please upload your SNTN document.';
      }
      if (!ownerIdentity.hasSNTN) {
        if (!ownerIdentity.idCardFrontFile) {
          return 'Please upload the front of your ID card.';
        }
        if (!ownerIdentity.idCardBackFile) {
          return 'Please upload the back of your ID card.';
        }
      }
      return null;
    },
  },
};

export function OnboardingFooter() {
  const router = useRouter();
  const params = useParams();
  const currentStep = params.step as OnboardingStep;

  const {
    formData,
    completeStep,
    completePhase,
    completedPhases,
    openProgressDrawer,
    openEmailConfirmModal,
    openConfirmModal,
    shouldNavigate,
    navigationStep,
    clearNavigation,
  } = useOnboardingStore();

  const [validationError, setValidationError] = useState<string | null>(null);

  const showBack = canGoBack(currentStep);
  const formId = STEPS_WITH_FORMS[currentStep];
  const hasForm = Boolean(formId);

  const executeNavigation = useCallback(
    (step: OnboardingStep) => {
      completeStep(step);

      if (isLastStepOfPhase(step)) {
        const phase = STEP_PHASE_MAP[step];
        completePhase(phase);

        const nextPhase = getNextPhase(phase);
        if (nextPhase) {
          router.push(`/onboarding/${OnboardingStep.WELCOME}`);
        } else {
          router.push('/dashboard');
        }
        return;
      }

      const nextStep = getNextStep(step);
      if (nextStep) {
        router.push(`/onboarding/${nextStep}`);
      }
    },
    [completeStep, completePhase, router]
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
    setValidationError(null);

    if (currentStep === OnboardingStep.WELCOME) {
      router.push(`/onboarding/${getNextPhaseEntryStep()}`);
      return;
    }

    const stepBehavior = STEP_BEHAVIORS[currentStep];

    if (stepBehavior?.validate) {
      const error = stepBehavior.validate(formData);
      if (error) {
        setValidationError(error);
        return;
      }
    }

    if (stepBehavior) {
      switch (stepBehavior.type) {
        case 'emailConfirm':
          openEmailConfirmModal();
          return;
        case 'modal':
          if (stepBehavior.modalConfig) {
            openConfirmModal({
              ...stepBehavior.modalConfig,
              onConfirm: () => executeNavigation(currentStep),
            });
          }
          return;
      }
    }

    executeNavigation(currentStep);
  };

  return (
    <footer className="fixed right-0 bottom-0 left-0 border-t bg-white px-4 py-4 sm:px-8">
      {validationError && (
        <div className="mx-10 mb-3 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">
          {validationError}
        </div>
      )}

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
