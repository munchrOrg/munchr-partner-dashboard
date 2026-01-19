'use client';

import { IntroStep } from '@/components/onboarding/shared/IntroStep';
import { useProfile } from '@/react-query/auth/queries';

export function Welcome() {
  const { data: profile } = useProfile();

  const steps = [
    {
      label: 'Add your business',
      completed: Boolean(profile?.step1),
    },
    {
      label: 'Verify your business',
      completed: Boolean(profile?.step2),
    },
    {
      label: 'Open your business',
      completed: Boolean(profile?.step3),
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
