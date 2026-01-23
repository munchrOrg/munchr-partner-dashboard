'use client';

import dynamic from 'next/dynamic';
import { CENTERED_STEPS } from '@/config/onboarding-steps';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { OnboardingStep } from '@/types/onboarding';
import { OnboardingFooter } from './layout/OnboardingFooter';
import { OnboardingHeader } from './layout/OnboardingHeader';
import { ConfirmModal } from './shared/ConfirmModal';
import { EmailConfirmModal } from './shared/EmailConfirmModal';
import { ExampleDrawer } from './shared/ExampleDrawer';
import { MapDrawer } from './shared/MapDrawer';
import { ProgressDrawer } from './shared/ProgressDrawer';

const stepComponents: Record<OnboardingStep, React.ComponentType> = {
  [OnboardingStep.WELCOME]: dynamic(
    () => import('@/components/onboarding/steps/phase1/Welcome').then((mod) => mod.Welcome),
    { ssr: false }
  ),
  [OnboardingStep.ADD_BUSINESS_INTRO]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/AddBusinessIntro').then(
        (mod) => mod.AddBusinessIntro
      ),
    { ssr: false }
  ),
  [OnboardingStep.BUSINESS_LOCATION]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/BusinessLocation').then(
        (mod) => mod.BusinessLocation
      ),
    { ssr: false }
  ),
  [OnboardingStep.OWNER_IDENTITY_UPLOAD]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/OwnerIdentityUpload').then(
        (mod) => mod.OwnerIdentityUpload
      ),
    { ssr: false }
  ),
  [OnboardingStep.LEGAL_TAX_DETAILS]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/LegalTaxDetails').then(
        (mod) => mod.LegalTaxDetails
      ),
    { ssr: false }
  ),
  [OnboardingStep.BANKING_DETAILS]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/BankingDetails').then(
        (mod) => mod.BankingDetails
      ),
    { ssr: false }
  ),
  [OnboardingStep.BANK_STATEMENT_UPLOAD]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/BankStatementUpload').then(
        (mod) => mod.BankStatementUpload
      ),
    { ssr: false }
  ),
  [OnboardingStep.PARTNERSHIP_PACKAGE]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/PartnershipPackage').then(
        (mod) => mod.PartnershipPackage
      ),
    { ssr: false }
  ),
  [OnboardingStep.PAYMENT_METHOD_SELECTION]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/PaymentMethodSelection').then(
        (mod) => mod.PaymentMethodSelection
      ),
    { ssr: false }
  ),
  [OnboardingStep.BUSINESS_INFO_REVIEW]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase1/BusinessInfoReview').then(
        (mod) => mod.BusinessInfoReview
      ),
    { ssr: false }
  ),

  [OnboardingStep.VERIFY_BUSINESS_INTRO]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase2/VerifyBusinessIntro').then(
        (mod) => mod.VerifyBusinessIntro
      ),
    { ssr: false }
  ),
  [OnboardingStep.DINE_IN_MENU_UPLOAD]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase2/DineInMenuUpload').then(
        (mod) => mod.DineInMenuUpload
      ),
    { ssr: false }
  ),
  [OnboardingStep.TRAINING_CALL_PREFERENCE]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase2/TrainingCallPreference').then(
        (mod) => mod.TrainingCallPreference
      ),
    { ssr: false }
  ),
  [OnboardingStep.GROWTH_INFORMATION]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase2/GrowthInformation').then(
        (mod) => mod.GrowthInformation
      ),
    { ssr: false }
  ),
  [OnboardingStep.ONBOARDING_FEE_PAYMENT]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase2/OnboardingFeePayment').then(
        (mod) => mod.OnboardingFeePayment
      ),
    { ssr: false }
  ),
  [OnboardingStep.PORTAL_SETUP_COMPLETE]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase2/PortalSetupComplete').then(
        (mod) => mod.PortalSetupComplete
      ),
    { ssr: false }
  ),

  [OnboardingStep.OPEN_BUSINESS_INTRO]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase3/OpenBusinessIntro').then(
        (mod) => mod.OpenBusinessIntro
      ),
    { ssr: false }
  ),
  [OnboardingStep.BUSINESS_HOURS_SETUP]: dynamic(
    () =>
      import('@/components/onboarding/steps/phase3/BusinessHoursSetup').then(
        (mod) => mod.BusinessHoursSetup
      ),
    { ssr: false }
  ),
};

export function OnboardingStepper() {
  const { currentStep, isInitialized } = useOnboardingProfileStore();

  if (!isInitialized) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  const StepComponent = stepComponents[currentStep];
  const isCentered = CENTERED_STEPS.has(currentStep);

  if (!StepComponent) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-white">
        <p className="text-gray-500">
          Unknown step:
          {currentStep}
        </p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white">
      <OnboardingHeader />
      <main
        className={`flex ${currentStep === OnboardingStep.BUSINESS_INFO_REVIEW ? 'overflow-hidden pb-16' : 'h-[calc(100dvh-128px-96px)]'} w-full flex-col overflow-y-auto`}
      >
        <div className={`min-h-full w-full ${isCentered ? 'my-auto' : ''}`}>
          <StepComponent />
        </div>
      </main>
      <OnboardingFooter />

      <ProgressDrawer />
      <ExampleDrawer />
      <MapDrawer />
      <ConfirmModal />
      <EmailConfirmModal />
    </div>
  );
}
