'use client';

import type { OnboardingPhase } from '@/types/onboarding';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PHASE_INFO, PHASE_ORDER, STEP_PHASE_MAP } from '@/config/onboarding-steps';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function ProgressDrawer() {
  const { isProgressDrawerOpen, closeProgressDrawer, currentStep, completedPhases } =
    useOnboardingStore();

  const currentPhase = STEP_PHASE_MAP[currentStep];

  const getPhaseStatus = (phase: OnboardingPhase) => {
    if (completedPhases.includes(phase)) {
      return 'completed';
    }
    if (phase === currentPhase) {
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
          {PHASE_ORDER.map((phase, index) => {
            const status = getPhaseStatus(phase);
            const info = PHASE_INFO[phase];

            return (
              <div key={phase} className="flex gap-4">
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
                    {(status === 'completed' || status === 'current') && (
                      <div className="h-4 w-4 rounded-full bg-black" />
                    )}
                  </div>
                  {index < PHASE_ORDER.length - 1 && (
                    <div
                      className={cn(
                        'mt-2 h-20 w-0.5 bg-gray-200'
                        // status === 'completed' ? 'bg-black' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{info.title}</h3>
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
