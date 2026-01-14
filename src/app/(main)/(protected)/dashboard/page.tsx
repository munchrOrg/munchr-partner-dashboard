'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { completedPhases } = useOnboardingStore();
  const router = useRouter();
  console.log(session);
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
            {session?.user?.email}!
          </p>
          <p className="mt-2 text-gray-500">You are now logged in.</p>
        </CardContent>
      </Card>
    </div>
  );
}
