'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    if (!allPhasesCompleted) {
      router.replace(`/onboarding/${OnboardingStep.WELCOME}`);
    }
  }, [allPhasesCompleted, router]);

  if (!allPhasesCompleted) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Welcome,
            {profile?.email || 'Partner'}!
          </p>
          <p className="mt-2 text-gray-500">You are now logged in.</p>
        </CardContent>
      </Card>
    </div>
  );
}
