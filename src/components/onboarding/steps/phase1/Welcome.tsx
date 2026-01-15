'use client';

import { IntroStep } from '@/components/onboarding/shared/IntroStep';
import { useOnboardingStore } from '@/stores/onboarding-store';
// import { OnboardingPhase } from '@/types/onboarding';

export function Welcome() {
  // const { completedPhases } = useOnboardingStore();

  const { profile } = useOnboardingStore();
  console.log('Profile data in Welcome component:', profile);
  // const getProfileMutation = useGetProfile();

  // useEffect(() => {
  //   getProfileMutation.mutateAsync();
  // }, []);

  const steps = [
    {
      label: 'Add your business',
      completed: !!profile?.step1,
      // completed: completedPhases.includes(OnboardingPhase.ADD_BUSINESS),
    },
    {
      label: 'Verify your business',
      completed: !!profile?.step2,
      // completed: completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS),
    },
    {
      label: 'Open your business',
      completed: !!profile?.step3,
      // completed: completedPhases.includes(OnboardingPhase.OPEN_BUSINESS),
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
