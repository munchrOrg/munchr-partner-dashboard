'use client';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Icon } from '@/components/ui/icon';

export function VerifyBusinessIntro() {
  return (
    <div className="mx-auto flex h-full max-w-5xl items-center justify-center px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1">
          <StepHeader
            phase="Step 2"
            title="Verify your Business"
            description="Thank you for signing your contract. You only have to complete a few steps and you will be earning new income on munchr in no time."
          />
        </div>

        <div className="flex justify-end lg:w-1/2">
          <Icon name="developerThumbnail" className="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
      </div>
    </div>
  );
}
