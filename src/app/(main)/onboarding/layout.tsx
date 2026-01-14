import { OnboardingFooter } from '@/components/onboarding/layout/OnboardingFooter';
import { OnboardingHeader } from '@/components/onboarding/layout/OnboardingHeader';
import { ConfirmModal } from '@/components/onboarding/shared/ConfirmModal';
import { EmailConfirmModal } from '@/components/onboarding/shared/EmailConfirmModal';
import { ExampleDrawer } from '@/components/onboarding/shared/ExampleDrawer';
import { MapDrawer } from '@/components/onboarding/shared/MapDrawer';
import { ProgressDrawer } from '@/components/onboarding/shared/ProgressDrawer';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh bg-white">
      <OnboardingHeader />
      <main className="h-[calc(100dvh-128px-96px)] w-full overflow-y-auto">{children}</main>
      <OnboardingFooter />

      <ProgressDrawer />
      <ExampleDrawer />
      <MapDrawer />
      <ConfirmModal />
      <EmailConfirmModal />
    </div>
  );
}
