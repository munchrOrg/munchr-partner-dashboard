'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { ProfileSetupStep } from '@/types/profile-setup';

const STEP_FORM_IDS: Record<ProfileSetupStep, string> = {
  [ProfileSetupStep.STEP_1]: 'profile-setup-step1-form',
  [ProfileSetupStep.STEP_2]: 'profile-setup-step2-form',
  [ProfileSetupStep.STEP_3]: 'profile-setup-step3-form',
  [ProfileSetupStep.STEP_4]: 'profile-setup-step4-form',
};

export function ProfileSetupFooter() {
  const { currentStep, previousStep, openProgressDrawer, isSubmitting } = useProfileSetupStore();

  const showBack = currentStep > ProfileSetupStep.STEP_1;
  const formId = STEP_FORM_IDS[currentStep];

  const handleBack = () => {
    previousStep();
  };

  const getButtonText = () => {
    if (currentStep === ProfileSetupStep.STEP_4) {
      return isSubmitting ? 'Completing...' : 'Complete Setup';
    }
    return 'Continue';
  };

  return (
    <footer className="fixed right-0 bottom-0 left-0 border-t bg-white px-0 py-3 sm:px-8 sm:py-4">
      <div className="mx-4 flex items-center justify-between gap-2 sm:mx-10 sm:gap-4">
        <div className="w-20 sm:w-28">
          {showBack && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="size-full rounded-full border-gray-400 px-3 text-sm font-medium text-black sm:px-6 sm:text-lg"
            >
              Back
            </Button>
          )}
        </div>

        <button
          type="button"
          onClick={openProgressDrawer}
          disabled={isSubmitting}
          className="text-purple-dark hover:text-purple-dark/80 flex cursor-pointer items-center gap-1 text-sm font-medium disabled:opacity-50 sm:gap-2 sm:text-lg"
        >
          <Icon name="menuIcon" className="size-5 sm:size-6" />
          <span className="hidden sm:inline">See Progress</span>
        </button>

        <div className="h-12 w-32 text-right sm:h-14 sm:w-44">
          <Button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="bg-gradient-yellow size-full rounded-full px-3 text-sm font-medium text-black disabled:opacity-50 sm:px-6 sm:text-lg"
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </footer>
  );
}
