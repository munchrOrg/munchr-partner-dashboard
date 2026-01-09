import { OnboardingFooter } from '@/components/onboarding/layout/OnboardingFooter';
import { OnboardingHeader } from '@/components/onboarding/layout/OnboardingHeader';
import { ConfirmModal } from '@/components/onboarding/shared/ConfirmModal';
import { ExampleDrawer } from '@/components/onboarding/shared/ExampleDrawer';
import { MapDrawer } from '@/components/onboarding/shared/MapDrawer';
import { ProgressDrawer } from '@/components/onboarding/shared/ProgressDrawer';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <OnboardingHeader />
      <main className="flex-1 pb-24">{children}</main>
      <OnboardingFooter />

      {/* Global drawers/modals - controlled by Zustand */}
      <ProgressDrawer />
      <ExampleDrawer />
      <MapDrawer />
      <ConfirmModal />
    </div>
  );
}
