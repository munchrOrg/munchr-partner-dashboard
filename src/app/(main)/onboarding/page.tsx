'use client';

import { OnboardingAuthGuard } from '@/components/auth/OnboardingAuthGuard';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';

export default function OnboardingPage() {
  return (
    <OnboardingAuthGuard>
      <OnboardingStepper />
    </OnboardingAuthGuard>
  );
}
