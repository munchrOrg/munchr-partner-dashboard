'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignupStore } from '@/stores/signup-store';
import { OnboardingStep } from '@/types/onboarding';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { accountStatus } = useSignupStore();
  const router = useRouter();

  useEffect(() => {
    if (accountStatus !== 'approved') {
      router.replace(`/onboarding/${OnboardingStep.PORTAL_SETUP_COMPLETE}`);
    }
  }, [accountStatus, router]);

  if (accountStatus !== 'approved') {
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
