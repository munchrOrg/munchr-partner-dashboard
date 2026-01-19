'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardContent } from '@/components/dashboard/widgets/DashboardContent';
import { useProfile } from '@/react-query/auth/queries';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

export default function DashboardPage() {
  const { data: profile } = useProfile();
  const router = useRouter();

  const completedPhases = (profile?.onboarding?.completedPhases || []) as OnboardingPhase[];

  const allPhasesCompleted =
    completedPhases.includes(OnboardingPhase.ADD_BUSINESS) &&
    completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS) &&
    completedPhases.includes(OnboardingPhase.OPEN_BUSINESS);

  useEffect(() => {
    if (profile && !allPhasesCompleted) {
      router.replace(`/onboarding/${OnboardingStep.WELCOME}`);
    }
  }, [allPhasesCompleted, router, profile]);

  if (!profile || !allPhasesCompleted) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const user = {
    name: profile.name || null,
    email: profile.email || null,
  };

  return <DashboardContent user={user} />;
}
