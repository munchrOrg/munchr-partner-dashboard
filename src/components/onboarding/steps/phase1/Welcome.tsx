'use client';

import { useEffect } from 'react';
import { IntroStep } from '@/components/onboarding/shared/IntroStep';
import { useGetProfile } from '@/react-query/auth/mutations';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingPhase } from '@/types/onboarding';
// import { OnboardingPhase } from '@/types/onboarding';

export function Welcome() {
  const { profile } = useOnboardingStore();
  const completedPhases = [];
  if (profile?.step1) {
    completedPhases.push(OnboardingPhase.ADD_BUSINESS);
  }
  if (profile?.step2) {
    completedPhases.push(OnboardingPhase.VERIFY_BUSINESS);
  }
  if (profile?.step3) {
    completedPhases.push(OnboardingPhase.OPEN_BUSINESS);
  }
  console.warn('Profile data in Welcome component:', profile);
  const getProfileMutation = useGetProfile();

  useEffect(() => {
    getProfileMutation.mutateAsync();
  }, []);

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
