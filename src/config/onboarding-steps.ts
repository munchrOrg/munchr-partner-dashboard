import type { OnboardingFormData } from '@/types/onboarding';
import { OnboardingPhase, OnboardingStep } from '@/types/onboarding';

export const STEP_ORDER: OnboardingStep[] = [
  // Phase 1: Add Your Business
  OnboardingStep.WELCOME,
  OnboardingStep.ADD_BUSINESS_INTRO,
  OnboardingStep.BUSINESS_LOCATION,
  OnboardingStep.OWNER_IDENTITY_UPLOAD,
  OnboardingStep.LEGAL_TAX_DETAILS,
  OnboardingStep.BANKING_DETAILS,
  OnboardingStep.BANK_STATEMENT_UPLOAD,
  OnboardingStep.PARTNERSHIP_PACKAGE,
  OnboardingStep.PAYMENT_METHOD_SELECTION,
  OnboardingStep.BUSINESS_INFO_REVIEW,

  // Phase 2: Verify Your Business
  OnboardingStep.VERIFY_BUSINESS_INTRO,
  OnboardingStep.DINE_IN_MENU_UPLOAD,
  OnboardingStep.TRAINING_CALL_PREFERENCE,
  OnboardingStep.GROWTH_INFORMATION,
  OnboardingStep.ONBOARDING_FEE_PAYMENT,
  OnboardingStep.PORTAL_SETUP_COMPLETE,

  // Phase 3: Open Your Business
  OnboardingStep.OPEN_BUSINESS_INTRO,
  OnboardingStep.BUSINESS_HOURS_SETUP,
];

// Map steps to their phase
export const STEP_PHASE_MAP: Record<OnboardingStep, OnboardingPhase> = {
  [OnboardingStep.WELCOME]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.ADD_BUSINESS_INTRO]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.BUSINESS_LOCATION]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.OWNER_IDENTITY_UPLOAD]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.LEGAL_TAX_DETAILS]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.BANKING_DETAILS]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.BANK_STATEMENT_UPLOAD]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.PARTNERSHIP_PACKAGE]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.PAYMENT_METHOD_SELECTION]: OnboardingPhase.ADD_BUSINESS,
  [OnboardingStep.BUSINESS_INFO_REVIEW]: OnboardingPhase.ADD_BUSINESS,

  [OnboardingStep.VERIFY_BUSINESS_INTRO]: OnboardingPhase.VERIFY_BUSINESS,
  [OnboardingStep.DINE_IN_MENU_UPLOAD]: OnboardingPhase.VERIFY_BUSINESS,
  [OnboardingStep.TRAINING_CALL_PREFERENCE]: OnboardingPhase.VERIFY_BUSINESS,
  [OnboardingStep.GROWTH_INFORMATION]: OnboardingPhase.VERIFY_BUSINESS,
  [OnboardingStep.ONBOARDING_FEE_PAYMENT]: OnboardingPhase.VERIFY_BUSINESS,
  [OnboardingStep.PORTAL_SETUP_COMPLETE]: OnboardingPhase.VERIFY_BUSINESS,

  [OnboardingStep.OPEN_BUSINESS_INTRO]: OnboardingPhase.OPEN_BUSINESS,
  [OnboardingStep.BUSINESS_HOURS_SETUP]: OnboardingPhase.OPEN_BUSINESS,
};

export const PHASE_ENTRY_STEP: Record<OnboardingPhase, OnboardingStep> = {
  [OnboardingPhase.ADD_BUSINESS]: OnboardingStep.ADD_BUSINESS_INTRO,
  [OnboardingPhase.VERIFY_BUSINESS]: OnboardingStep.VERIFY_BUSINESS_INTRO,
  [OnboardingPhase.OPEN_BUSINESS]: OnboardingStep.OPEN_BUSINESS_INTRO,
};

export const PHASE_INFO: Record<OnboardingPhase, { title: string; description: string }> = {
  [OnboardingPhase.ADD_BUSINESS]: {
    title: 'Add your business',
    description: 'We need this to create your contract and set up your business on the munchr app.',
  },
  [OnboardingPhase.VERIFY_BUSINESS]: {
    title: 'Verify your business',
    description: 'Add a few documents so we can verify your business and identity.',
  },
  [OnboardingPhase.OPEN_BUSINESS]: {
    title: 'Open for business',
    description:
      'Get your restaurant live on the munchr app. Start taking orders and earning new revenue!',
  },
};

export const PHASE_ORDER: OnboardingPhase[] = [
  OnboardingPhase.ADD_BUSINESS,
  OnboardingPhase.VERIFY_BUSINESS,
  OnboardingPhase.OPEN_BUSINESS,
];

export const PHASE_LAST_STEP: Record<OnboardingPhase, OnboardingStep> = {
  [OnboardingPhase.ADD_BUSINESS]: OnboardingStep.BUSINESS_INFO_REVIEW,
  [OnboardingPhase.VERIFY_BUSINESS]: OnboardingStep.PORTAL_SETUP_COMPLETE,
  [OnboardingPhase.OPEN_BUSINESS]: OnboardingStep.BUSINESS_HOURS_SETUP,
};

export const STEP_FORM_KEY_MAP: Partial<Record<OnboardingStep, keyof OnboardingFormData>> = {
  [OnboardingStep.BUSINESS_LOCATION]: 'location',
  [OnboardingStep.OWNER_IDENTITY_UPLOAD]: 'ownerIdentity',
  [OnboardingStep.LEGAL_TAX_DETAILS]: 'legalTax',
  [OnboardingStep.BANKING_DETAILS]: 'banking',
  [OnboardingStep.BANK_STATEMENT_UPLOAD]: 'bankStatement',
  [OnboardingStep.PARTNERSHIP_PACKAGE]: 'package',
  [OnboardingStep.PAYMENT_METHOD_SELECTION]: 'paymentMethod',
  [OnboardingStep.DINE_IN_MENU_UPLOAD]: 'menu',
  [OnboardingStep.TRAINING_CALL_PREFERENCE]: 'trainingCall',
  [OnboardingStep.ONBOARDING_FEE_PAYMENT]: 'onboardingFee',
  [OnboardingStep.BUSINESS_HOURS_SETUP]: 'businessHours',
};

export const STEPS_WITHOUT_FORMS = new Set<OnboardingStep>([
  OnboardingStep.WELCOME,
  OnboardingStep.ADD_BUSINESS_INTRO,
  OnboardingStep.VERIFY_BUSINESS_INTRO,
  OnboardingStep.OPEN_BUSINESS_INTRO,
  OnboardingStep.PORTAL_SETUP_COMPLETE,
  OnboardingStep.GROWTH_INFORMATION,
  OnboardingStep.BUSINESS_INFO_REVIEW,
]);

function getNextPhaseEntry(completedPhases: OnboardingPhase[]): OnboardingStep {
  if (completedPhases.includes(OnboardingPhase.VERIFY_BUSINESS)) {
    return PHASE_ENTRY_STEP[OnboardingPhase.OPEN_BUSINESS];
  }
  if (completedPhases.includes(OnboardingPhase.ADD_BUSINESS)) {
    return PHASE_ENTRY_STEP[OnboardingPhase.VERIFY_BUSINESS];
  }
  return PHASE_ENTRY_STEP[OnboardingPhase.ADD_BUSINESS];
}

export function getNextStep(
  current: OnboardingStep,
  completedPhases: OnboardingPhase[] = []
): OnboardingStep | null {
  if (current === OnboardingStep.WELCOME) {
    return getNextPhaseEntry(completedPhases);
  }

  if (current === OnboardingStep.PORTAL_SETUP_COMPLETE) {
    return null;
  }

  if (isLastStepOfPhase(current)) {
    if (current === OnboardingStep.BUSINESS_HOURS_SETUP) {
      return null;
    }
    return OnboardingStep.WELCOME;
  }

  const index = STEP_ORDER.indexOf(current);
  if (index === -1 || index >= STEP_ORDER.length - 1) {
    return null;
  }
  return STEP_ORDER[index + 1] ?? null;
}

export function getPrevStep(current: OnboardingStep): OnboardingStep | null {
  const index = STEP_ORDER.indexOf(current);
  if (index <= 0) {
    return null;
  }
  return STEP_ORDER[index - 1] ?? null;
}

export function canGoBack(step: OnboardingStep): boolean {
  return step !== OnboardingStep.WELCOME;
}

export function getNextPhase(currentPhase: OnboardingPhase): OnboardingPhase | null {
  const index = PHASE_ORDER.indexOf(currentPhase);
  return PHASE_ORDER[index + 1] ?? null;
}

export function isLastStepOfPhase(step: OnboardingStep): boolean {
  const phase = STEP_PHASE_MAP[step];
  return PHASE_LAST_STEP[phase] === step;
}
