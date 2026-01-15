'use client';

import type { ConfirmModalConfig } from '@/types/onboarding';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
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
import { useGetProfile, useUpdateProfile } from '@/react-query/auth/mutations';
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
  [OnboardingStep.BUSINESS_HOURS_SETUP]: {
    type: 'default',
    validate: (formData) => {
      if (!formData.businessHours) {
        return 'Please configure your business hours.';
      }

      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

      const hasOpenDay = days.some((day) => formData.businessHours[day].isOpen);
      if (!hasOpenDay) {
        return 'Please mark at least one day as open.';
      }

      for (const day of days) {
        const schedule = formData.businessHours[day];

        if (schedule.isOpen && schedule.slots.length === 0) {
          return 'Please add time slots for all open days or mark them as closed.';
        }
      }

      return null;
    },
  },
  [OnboardingStep.PARTNERSHIP_PACKAGE]: {
    type: 'default',
    validate: (formData) => {
      if (!formData.package?.selectedPackageId) {
        return 'Please select a partnership package before continuing.';
      }
      return null;
    },
  },
  [OnboardingStep.PAYMENT_METHOD_SELECTION]: {
    type: 'default',
    validate: (formData) => {
      if (!formData.paymentMethod?.savedAccounts?.length) {
        return 'Please add a payment method before continuing.';
      }
      if (!formData.paymentMethod.selectedAccountId) {
        return 'Please select a payment method before continuing.';
      }
      return null;
    },
  },
  [OnboardingStep.BANK_STATEMENT_UPLOAD]: {
    type: 'default',
    validate: (formData) => {
      if (!formData.bankStatement?.statementFile) {
        return 'Please upload your bank statement before continuing.';
      }
      return null;
    },
  },
  [OnboardingStep.TRAINING_CALL_PREFERENCE]: {
    type: 'default',
    validate: (formData) => {
      if (!formData.trainingCall?.networkProvider) {
        return 'Please select your mobile network provider.';
      }
      if (!formData.trainingCall.preferredTime) {
        return 'Please select your preferred time for the training call.';
      }
      if (!formData.trainingCall.preferredDate) {
        return 'Please select your preferred date for the training call.';
      }
      return null;
    },
  },
  [OnboardingStep.ONBOARDING_FEE_PAYMENT]: {
    type: 'default',
    validate: (formData) => {
      if (!formData.onboardingFee?.paymentScreenshot) {
        return 'Please upload your payment screenshot before continuing.';
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

  const updateProfileMutation = useUpdateProfile();
  const getProfileMutation = useGetProfile();

  const handleContinue = async () => {
    await updateProfileMutation.mutateAsync({ currentPage: currentStep } as any);
    if (currentStep === OnboardingStep.WELCOME) {
      router.push(`/onboarding/${getNextPhaseEntryStep()}`);
      return;
    }
    if (currentStep === OnboardingStep.OWNER_IDENTITY_UPLOAD) {
      const { ownerIdentity } = formData;
      if (ownerIdentity) {
        const payload: any = {
          sntn: ownerIdentity.hasSNTN,
          currentPage: currentStep,
        };

        if (ownerIdentity.hasSNTN) {
          const file: any = ownerIdentity.sntnFile;
          if (file) {
            payload.sntnImage = {
              url: file.url,
              width: file.width || 0,
              height: file.height || 0,
              size: file.size || 0,
              fileName: file.name || '',
            };
          }
        } else {
          const front: any = ownerIdentity.idCardFrontFile;
          const back: any = ownerIdentity.idCardBackFile;

          if (front) {
            payload.frontNic = {
              url: front.url,
              width: front.width || 0,
              height: front.height || 0,
              size: front.size || 0,
              fileName: front.name || '',
            };
          }

          if (back) {
            payload.backNic = {
              url: back.url,
              width: back.width || 0,
              height: back.height || 0,
              size: back.size || 0,
              fileName: back.name || '',
            };
          }
        }

        await updateProfileMutation.mutateAsync(payload);
      }
    } else if (currentStep === OnboardingStep.BANK_STATEMENT_UPLOAD) {
      const { bankStatement } = formData;
      if (bankStatement && bankStatement.statementFile) {
        const file: any = bankStatement.statementFile;
        const payload: any = {
          currentPage: currentStep,
          checkBookImage: {
            url: file.url,
            width: file.width || 0,
            height: file.height || 0,
            size: file.size || 0,
            fileName: file.name || '',
          },
        };
        await updateProfileMutation.mutateAsync(payload);
      } else {
        await updateProfileMutation.mutateAsync({ currentPage: currentStep } as any);
      }
    } else if (currentStep === OnboardingStep.DINE_IN_MENU_UPLOAD) {
      const { menu } = formData;
      if (menu && menu.menuFile) {
        const file: any = menu.menuFile;
        const payload: any = {
          currentPage: currentStep,
          menuImage: {
            url: file.url,
            width: file.width || 0,
            height: file.height || 0,
            size: file.size || 0,
            fileName: file.name || '',
          },
        };
        await updateProfileMutation.mutateAsync(payload);
      } else {
        await updateProfileMutation.mutateAsync({ currentPage: currentStep } as any);
      }
    } else if (currentStep === OnboardingStep.ONBOARDING_FEE_PAYMENT) {
      const { onboardingFee } = formData;
      if (onboardingFee) {
        const file: any = onboardingFee.paymentScreenshot;
        const payload: any = {
          currentPage: currentStep,
          uploadScreenshotImage: {
            url: file.url,
            width: file.width || 0,
            height: file.height || 0,
            size: file.size || 0,
            fileName: file.name || '',
          },
        };
        await updateProfileMutation.mutateAsync(payload);
      } else {
        await updateProfileMutation.mutateAsync({ currentPage: currentStep } as any);
      }
    } else if (currentStep === OnboardingStep.TRAINING_CALL_PREFERENCE) {
      const { trainingCall } = formData;

      const is24Hour = (t?: string) => /^\d{2}:\d{2}$/.test(t || '');

      const to24HourTime = (time12h?: string): string => {
        if (!time12h) {
          return '';
        }

        const parts = time12h.trim().split(' ');
        if (parts.length !== 2) {
          return '';
        }

        const timePart = parts[0];
        const modifier = parts[1];

        if (!timePart || !modifier) {
          return '';
        }

        const timeParts = timePart.split(':');
        if (timeParts.length !== 2) {
          return '';
        }

        const hours = Number(timeParts[0]);
        const minutes = Number(timeParts[1]);

        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
          return '';
        }

        let h = hours;

        if (modifier === 'PM' && h !== 12) {
          h += 12;
        }
        if (modifier === 'AM' && h === 12) {
          h = 0;
        }

        return `${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      };

      if (trainingCall) {
        const time24 = is24Hour(trainingCall.preferredTime)
          ? trainingCall.preferredTime
          : to24HourTime(trainingCall.preferredTime);

        const payload: any = {
          currentPage: currentStep,
          bookSlot: {
            networkPreference: trainingCall.networkProvider,
            date: trainingCall.preferredDate,
            time: time24,
          },
        };

        await updateProfileMutation.mutateAsync(payload);
      } else {
        await updateProfileMutation.mutateAsync({
          currentPage: currentStep,
        } as any);
      }
    } else if (currentStep === OnboardingStep.PAYMENT_METHOD_SELECTION) {
      const { paymentMethod } = formData;
      if (paymentMethod && paymentMethod.selectedAccountId && paymentMethod.savedAccounts?.length) {
        const selected = paymentMethod.savedAccounts.find(
          (acc) => acc.id === paymentMethod.selectedAccountId
        );
        if (selected) {
          const payload: any = {
            currentPage: currentStep,
            paymentMethod: {
              paymentMethod: selected.method,
              accountNumber: selected.accountNumber,
            },
          };
          await updateProfileMutation.mutateAsync(payload);
        } else {
          await updateProfileMutation.mutateAsync({ currentPage: currentStep } as any);
        }
      } else {
        await updateProfileMutation.mutateAsync({ currentPage: currentStep } as any);
      }
    } else {
      await updateProfileMutation.mutateAsync({ currentPage: currentStep } as any);
    }
    try {
      await updateProfileMutation.mutateAsync({ currentPage: currentStep } as any);
      try {
        const profileResp = await getProfileMutation.mutateAsync();
        const profileData = (profileResp as any)?.data;
        if (profileData) {
          if (
            profileData.businessName ||
            profileData.businessDescription ||
            profileData.cuisines ||
            profileData.email ||
            profileData.phoneNumber
          ) {
            const businessInfo = {
              serviceProviderType:
                (profileData.serviceProviderType as any) ||
                (useOnboardingStore.getState().formData.businessInfo?.serviceProviderType ??
                  'restaurant'),
              businessName: profileData.businessName || '',
              businessDescription: profileData.businessDescription || '',
              email:
                profileData.email ||
                useOnboardingStore.getState().formData.businessInfo?.email ||
                '',
              phoneNumber:
                profileData.phoneNumber ||
                useOnboardingStore.getState().formData.businessInfo?.phoneNumber ||
                '',
              cuisines:
                profileData.cuisines ||
                useOnboardingStore.getState().formData.businessInfo?.cuisines ||
                [],
            } as any;
            useOnboardingStore.getState().setFormData('businessInfo', businessInfo);
          }

          if (profileData.location) {
            const loc = profileData.location;
            const locationPayload = {
              buildingName: loc.buildingName || '',
              street: loc.street || '',
              houseNumber: loc.houseNumber || '',
              state: loc.state || '',
              city: loc.city || '',
              area: loc.area || '',
              postalCode: loc.postalCode || '',
              comment: loc.comment || '',
              coordinates: loc.coordinates || null,
            } as any;
            useOnboardingStore.getState().setFormData('location', locationPayload);
          }
        }
      } catch {}
    } catch {
      toast.error('Failed to report onboarding progress');
    }

    const stepBehavior = STEP_BEHAVIORS[currentStep];

    if (stepBehavior?.validate) {
      const error = stepBehavior.validate(formData);
      if (error) {
        toast.error(error);
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
            className="bg-gradient-yellow size-full rounded-full px-6 text-lg font-medium text-black"
          >
            Continue
          </Button>
        </div>
      </div>
    </footer>
  );
}
