'use client';

import { cn } from '@/lib/utils';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { ProfileSetupStep, STEP_INFO } from '@/types/profile-setup';
import { ProfileSetupFooter } from './layout/ProfileSetupFooter';
import { ProfileSetupHeader } from './layout/ProfileSetupHeader';
import { ProfileSetupMapDrawer } from './shared/ProfileSetupMapDrawer';
import { ProfileSetupProgressDrawer } from './shared/ProfileSetupProgressDrawer';
import { StepContent } from './StepContent';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';

export function ProfileSetupStepper() {
  const { currentStep } = useProfileSetupStore();

  const currentStepInfo = STEP_INFO[currentStep];

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
          <div className="mt-6 mb-8 md:mt-16">
            <h1 className={cn('text-left text-2xl font-bold')}>
              Set Up your profile (step {currentStep} of 4)
            </h1>
            {currentStepInfo && currentStep !== ProfileSetupStep.STEP_1 && (
              <p className="text-muted-foreground mt-2 text-center">
                {currentStepInfo.description}
              </p>
            )}
          </div>

          <div className="">
            {currentStep === ProfileSetupStep.STEP_1 ? (
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
    </div>
  );
}
