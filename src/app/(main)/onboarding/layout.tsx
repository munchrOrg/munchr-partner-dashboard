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
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 pb-24 sm:px-8">
        {children}
      </main>
      <OnboardingFooter />

      {/* Global drawers/modals - controlled by Zustand */}
      <ProgressDrawer />
      <ExampleDrawer />
      <MapDrawer />
      <ConfirmModal />
    </div>
  );
}
