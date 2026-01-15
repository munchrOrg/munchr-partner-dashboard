'use client';

/**
 * Development helper component to override onboarding states
 * Only renders in development mode
 *
 * Usage: Add this component to your onboarding layout or any page for testing
 */
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSignupStore } from '@/stores/signup-store';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

export function OnboardingDevHelper() {
  const router = useRouter();
  const { completedPhases, completedSteps, completePhase, completeStep } = useOnboardingStore();
  const { setAccountStatus, accountStatus } = useSignupStore();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const allPhases = [
    OnboardingPhase.ADD_BUSINESS,
    OnboardingPhase.VERIFY_BUSINESS,
    OnboardingPhase.OPEN_BUSINESS,
  ];

  const allSteps = Object.values(OnboardingStep);

  const handleCompleteAllPhases = () => {
    allPhases.forEach((phase) => {
      if (!completedPhases.includes(phase)) {
        completePhase(phase);
      }
    });
  };

  const handleCompleteAllSteps = () => {
    allSteps.forEach((step) => {
      if (!completedSteps.includes(step)) {
        completeStep(step);
      }
    });
  };

  const handleSetAccountApproved = () => {
    setAccountStatus('approved');
  };

  return (
    <Card className="fixed right-4 bottom-4 z-50 w-80 border-yellow-300 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-yellow-800">🔧 Dev Helper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-700">Quick Actions:</p>
          <div className="flex flex-col gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleCompleteAllPhases}
            >
              Complete All Phases
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleCompleteAllSteps}
            >
              Complete All Steps
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleSetAccountApproved}
            >
              Set Account: Approved
            </Button>
          </div>
        </div>

        <div className="space-y-1 border-t border-yellow-200 pt-2">
          <p className="text-xs font-semibold text-gray-700">Current State:</p>
          <div className="space-y-0.5 text-xs">
            <p>
              <span className="font-medium">Phases:</span> {completedPhases.length}/
              {allPhases.length}
            </p>
            <p>
              <span className="font-medium">Steps:</span> {completedSteps.length}/{allSteps.length}
            </p>
            <p>
              <span className="font-medium">Account:</span> {accountStatus}
            </p>
          </div>
        </div>

        <div className="space-y-1 border-t border-yellow-200 pt-2">
          <p className="text-xs font-semibold text-gray-700">Quick Navigate:</p>
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => router.push(`/onboarding/${OnboardingStep.WELCOME}`)}
            >
              Welcome
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => router.push(`/onboarding/${OnboardingStep.VERIFY_BUSINESS_INTRO}`)}
            >
              Phase 2
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => router.push(`/onboarding/${OnboardingStep.OPEN_BUSINESS_INTRO}`)}
            >
              Phase 3
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
