'use client';

import { cn } from '@/lib/utils';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { ProfileSetupStep, STEP_INFO } from '@/types/profile-setup';
import { ProfileSetupFooter } from './layout/ProfileSetupFooter';
import { ProfileSetupHeader } from './layout/ProfileSetupHeader';
import { ProfileSetupExampleDrawer } from './shared/ProfileSetupExampleDrawer';
import { ProfileSetupMapDrawer } from './shared/ProfileSetupMapDrawer';
import { ProfileSetupProgressDrawer } from './shared/ProfileSetupProgressDrawer';
import { ProfileSetupScheduleDrawer } from './shared/ProfileSetupScheduleDrawer';
import { StepContent } from './StepContent';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';

export function ProfileSetupStepper() {
  const { currentStep } = useProfileSetupStore();

  const currentStepInfo = STEP_INFO[currentStep];

  const textAlignment =
    currentStep === ProfileSetupStep.STEP_1 ||
    currentStep === ProfileSetupStep.STEP_3 ||
    currentStep === ProfileSetupStep.STEP_4
      ? 'text-left'
      : '';
  const width = currentStep === ProfileSetupStep.STEP_2;

  const renderStep = () => {
    switch (currentStep) {
      case ProfileSetupStep.STEP_1:
        return <Step1 />;
      case ProfileSetupStep.STEP_2:
        return <Step2 />;
      case ProfileSetupStep.STEP_3:
        return <Step3 />;
      case ProfileSetupStep.STEP_4:
        return <Step4 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ProfileSetupHeader />

      <main className="flex-1 pb-24">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mt-6 md:mt-16">
            <h1
              className={cn(
                'text-2xl leading-none font-bold',
                textAlignment,
                width ? 'mx-auto w-[446px]' : ''
              )}
            >
              Set Up your profile (step {currentStep} of 4)
            </h1>
            {currentStepInfo &&
              currentStep !== ProfileSetupStep.STEP_1 &&
              (currentStepInfo.description || currentStep === ProfileSetupStep.STEP_2) && (
                <div className={cn('flex gap-2', width ? 'mx-auto w-[446px]' : '')}>
                  {currentStepInfo.description && (
                    <p
                      className={cn(
                        'mt-7 text-lg leading-none font-bold text-black',
                        textAlignment
                      )}
                    >
                      {currentStepInfo.description}
                    </p>
                  )}
                </div>
              )}
          </div>

          <div className="">
            {currentStep === ProfileSetupStep.STEP_1 || currentStep === ProfileSetupStep.STEP_4 ? (
              renderStep()
            ) : (
              <StepContent>{renderStep()}</StepContent>
            )}
          </div>
        </div>
      </main>

      <ProfileSetupFooter />
      <ProfileSetupProgressDrawer />
      <ProfileSetupMapDrawer />
      <ProfileSetupExampleDrawer />
      <ProfileSetupScheduleDrawer />
    </div>
  );
}
