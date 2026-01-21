'use client';

import { IntroStep } from '@/components/onboarding/shared/IntroStep';
import { useProfile } from '@/react-query/auth/queries';
import { OnboardingPhase } from '@/types/onboarding';

export function Welcome() {
  const { data: profile } = useProfile();

  const completedPhases = profile?.onboarding?.completedPhases || [];

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
      illustrationName="welcomeThumbnail"
      illustrationClassName="h-64 w-64 sm:h-80 sm:w-80"
    />
  );
}
