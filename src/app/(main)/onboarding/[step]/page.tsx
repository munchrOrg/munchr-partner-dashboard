'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { STEP_ORDER } from '@/config/onboarding-steps';
import { OnboardingStep } from '@/types/onboarding';

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

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const step = params.step as string;

  // Only redirect invalid steps to welcome - AuthGuard handles all other routing
  useEffect(() => {
    const stepEnum = step as OnboardingStep;
    if (!STEP_ORDER.includes(stepEnum)) {
      router.replace(`/onboarding/${OnboardingStep.WELCOME}`);
    }
  }, [step, router]);

  const StepComponent = stepComponents[step as OnboardingStep];

  if (!StepComponent) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <StepComponent />;
}
