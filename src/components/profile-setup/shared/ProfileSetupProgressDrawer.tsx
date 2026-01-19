'use client';

import type { ProfileSetupStep } from '@/types/profile-setup';
import { CheckIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { STEP_INFO } from '@/types/profile-setup';

export function ProfileSetupProgressDrawer() {
  const { isProgressDrawerOpen, closeProgressDrawer, currentStep, completedSteps } =
    useProfileSetupStore();

  const getStepStatus = (step: ProfileSetupStep) => {
    if (completedSteps.includes(step)) {
      return 'completed';
    }
    if (step === currentStep) {
      return 'current';
    }
    return 'pending';
  };

  return (
    <Sheet open={isProgressDrawerOpen} onOpenChange={closeProgressDrawer}>
      <SheetContent side="right" className="w-full overflow-y-auto rounded-l-2xl p-6 sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-3xl font-bold">You're making progress!</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-2">
          {Object.entries(STEP_INFO).map(([stepKey, info], index) => {
            const step = Number(stepKey) as ProfileSetupStep;
            const status = getStepStatus(step);

            return (
              <div key={step} className="flex gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border-2',
                      status === 'completed' && 'border-black bg-white',
                      status === 'current' && 'border-black bg-white',
                      status === 'pending' && 'border-gray-300 bg-none'
                    )}
                  >
                    {status === 'completed' && <CheckIcon className="size-4" />}
                    {status === 'current' && <div className="h-4 w-4 rounded-full bg-black" />}
                  </div>
                  {index < Object.keys(STEP_INFO).length - 1 && (
                    <div className="mt-2 h-20 w-0.5 bg-gray-200" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">
                      Step {step}: {info.title}
                    </h3>
                    {status === 'completed' && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-lg">{info.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
