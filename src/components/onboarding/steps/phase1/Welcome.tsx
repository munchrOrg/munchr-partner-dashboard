'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { IntroStep } from '@/components/onboarding/shared/IntroStep';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingPhase } from '@/types/onboarding';
// import { OnboardingPhase } from '@/types/onboarding';

export function Welcome() {
  const router = useRouter();
  const { completedPhases } = useOnboardingStore();

  const { profile } = useOnboardingStore();
  console.warn('Profile data in Welcome component:', profile);
  // const getProfileMutation = useGetProfile();

  // useEffect(() => {
  //   getProfileMutation.mutateAsync();
  // }, []);

  React.useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('onboarding-storage');
    sessionStorage.removeItem('sentryReplaySession');
    if (typeof window !== 'undefined') {
      try {
        const onboardingStore = useOnboardingStore.getState();
        onboardingStore.reset();
      } catch {}
    }
    window.onpopstate = () => {
      router.replace('/sign-up');
    };
    return () => {
      window.onpopstate = null;
    };
  }, [router]);

  const steps = [
    {
      label: 'Add your business',
      // completed: !!profile?.step1,
      completed: completedPhases.includes(OnboardingPhase.ADD_BUSINESS),
    },
    {
      label: 'Verify your business',
      // completed: !!profile?.step2,
      completed: completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS),
    },
    {
      label: 'Open your business',
      // completed: !!profile?.step3,
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
