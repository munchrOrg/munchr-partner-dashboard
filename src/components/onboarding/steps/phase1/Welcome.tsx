'use client';

import { IntroStep } from '@/components/onboarding/shared/IntroStep';
import { IconLib } from '@/lib/icon';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingPhase } from '@/types/onboarding';

export function Welcome() {
  const { completedPhases } = useOnboardingStore();

  const steps = [
    {
      label: 'Add your business',
      completed: completedPhases.includes(OnboardingPhase.ADD_BUSINESS),
    },
    {
      label: 'Verify your business',
      completed: completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS),
    },
    {
      label: 'Open your business',
      completed: completedPhases.includes(OnboardingPhase.OPEN_BUSINESS),
    },
  ];

  return (
    <IntroStep
      phaseLabel="Welcome"
      title="Thankyou for signing up"
      description="Congratulations! You have successfully registered with us. Below you will see the required details we need from you."
      items={steps}
      illustration={<IconLib.welcomeThumbnail className="h-64 w-64 sm:h-80 sm:w-80" />}
    />
  );
}
