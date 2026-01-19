'use client';

import type { ProfileSetupStep } from '@/types/profile-setup';
import { Stepper } from '@/components/ui/stepper';

type StepIndicatorProps = {
  currentStep: ProfileSetupStep;
  completedSteps: ProfileSetupStep[];
  onStepClick?: (step: ProfileSetupStep) => void;
};

export function StepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  const handleStepClick = (step: number) => {
    if (onStepClick) {
      const targetStep = step as ProfileSetupStep;
      // Only allow clicking on completed steps or current step
      if (completedSteps.includes(targetStep) || targetStep === currentStep) {
        onStepClick(targetStep);
      }
    }
  };

  return (
    <div className="w-full py-6">
      <Stepper currentStep={currentStep} totalSteps={4} onStepClick={handleStepClick} />
    </div>
  );
}
