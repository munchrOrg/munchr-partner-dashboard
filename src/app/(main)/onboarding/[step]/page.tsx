'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { STEP_ORDER } from '@/config/onboarding-steps';
import { useProfile } from '@/react-query/auth/queries';
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

function OnboardingLoadingSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col items-center justify-center gap-4">
      <div className="h-8 w-64 rounded bg-gray-200" />
      <div className="h-4 w-96 rounded bg-gray-200" />
      <div className="mt-8 h-64 w-full max-w-2xl rounded-lg bg-gray-100" />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const step = params.step as string;

  const { data: profile, isLoading, isError } = useProfile();

  const onboarding = profile?.onboarding;
  const backendCurrentStep = onboarding?.currentStep as OnboardingStep | null;
  const completedSteps = (onboarding?.completedSteps || []) as string[];

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const stepEnum = step as OnboardingStep;

    if (!STEP_ORDER.includes(stepEnum)) {
      router.replace(`/onboarding/${OnboardingStep.WELCOME}`);
      return;
    }

    if (stepEnum === OnboardingStep.WELCOME) {
      return;
    }

    if (backendCurrentStep) {
      const requestedStepIndex = STEP_ORDER.indexOf(stepEnum);
      const currentStepIndex = STEP_ORDER.indexOf(backendCurrentStep);
      const isStepCompleted = completedSteps.includes(stepEnum);

      if (!isStepCompleted && requestedStepIndex > currentStepIndex) {
        router.replace(`/onboarding/${backendCurrentStep}`);
      }
    }
  }, [step, isLoading, backendCurrentStep, completedSteps, router]);

  if (isLoading) {
    return <OnboardingLoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-red-500">Failed to load profile. Please try refreshing the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  }

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
