'use client';

import { useRouter } from 'next/navigation';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useLogout } from '@/react-query/auth/mutations';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';

const NEXT_STEPS = [
  "Open the email and Click 'Create Password'",
  'Set your Partner Portal password',
  'Add opening hours, Menu and dish photos',
];

export function PortalSetupComplete() {
  const { profileData } = useOnboardingProfileStore();
  const logoutMutation = useLogout();
  const router = useRouter();

  const email = profileData?.user?.email || profileData?.partner?.email || 'your@email.com';

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync({});
    } catch {}
    router.push('/sign-in');
  };

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

          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="bg-gradient-yellow mt-8 w-full rounded-sm px-8 py-3 text-sm font-medium text-black"
          >
            {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>

        <div className="flex justify-end lg:w-1/2">
          <Icon name="developerThumbnail" className="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
      </div>
    </div>
  );
}
