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
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold">You're making progress!</SheetTitle>
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
                      status === 'completed' && 'border-black bg-black',
                      status === 'current' && 'border-black bg-black',
                      status === 'pending' && 'border-gray-300 bg-white'
                    )}
                  >
                    {(status === 'completed' || status === 'current') && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  {index < PHASE_ORDER.length - 1 && (
                    <div
                      className={cn(
                        'mt-2 h-20 w-0.5',
                        status === 'completed' ? 'bg-black' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{info.title}</h3>
                    {status === 'completed' && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{info.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
