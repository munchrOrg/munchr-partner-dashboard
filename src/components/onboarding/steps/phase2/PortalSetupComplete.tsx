'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Icon } from '@/components/ui/icon';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSignupStore } from '@/stores/signup-store';
import { OnboardingPhase } from '@/types/onboarding';

const NEXT_STEPS = [
  "Open the email and Click 'Create Password'",
  'Set your Partner Portal password',
  'Add opening hours, Menu and dish photos',
];

export function PortalSetupComplete() {
  const { formData, completePhase, reset: resetOnboarding } = useOnboardingStore();
  const resetSignup = useSignupStore((state) => state.reset);
  const router = useRouter();
  const hasRun = useRef(false);

  const email = formData.businessInfo?.email || 'your@email.com';

  useEffect(() => {
    if (hasRun.current) {
      return undefined;
    }
    hasRun.current = true;

    completePhase(OnboardingPhase.VERIFY_BUSINESS);

    toast.success('Your application is under review. You will be notified once approved.', {
      duration: 5000,
    });

    const timer = setTimeout(() => {
      // TODO: Uncomment this when backend is ready
      // resetOnboarding();
      // resetSignup();

      signOut({ redirect: false });
      router.push('/sign-in');
    }, 5000);
    // NOTE: This has been added to allow timer to run as react in strict mode while development runs twice and when effect runs twice it finds hasRun.current and returns early without allowing timer to run which was not allowing user to logout (Once backend is ready and app is set for production , comment the hasRun line in effect cleanup function  )
    return () => {
      clearTimeout(timer);
      hasRun.current = false;
    };
  }, [completePhase, resetOnboarding, resetSignup, router]);

  return (
    <div className="mx-auto flex h-full items-center justify-center px-4 py-8 sm:px-8">
      <div className="flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1">
          <StepHeader
            phase="Next Step!"
            title="Setup your Partner Portal account"
            description={`We've sent an email to set up your Partner Portal Account at ${email}`}
          />

          <div className="mt-6">
            <p className="mb-4 text-lg font-bold">What to do next:</p>
            <ul className="space-y-5">
              {NEXT_STEPS.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="bg-purple-dark flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-base font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end lg:w-1/2">
          <Icon name="developerThumbnail" className="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
      </div>
    </div>
  );
}
