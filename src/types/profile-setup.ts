import type { Coordinates } from '@/types/onboarding';

// ===== Enums =====
export enum ProfileSetupStep {
  STEP_1 = 1,
  STEP_2 = 2,
  STEP_3 = 3,
  STEP_4 = 4,
}

// ===== Form Data Types =====

export type Step1FormData = {
  businessName: string;
  businessDescription: string;
  cuisines: string;
  location: string;
  coordinates?: Coordinates | null;
};

export type Step2FormData = {
  phoneNumber: string;
  address: string;
  city: string;
};

export type Step3FormData = {
  languagePreference: string;
  timezone: string;
  notificationPreferences: string[];
};

export type Step4FormData = {
  termsAndConditions: boolean;
  privacyPolicy: boolean;
  marketingEmails: boolean;
};

// ===== Store Types =====
export type ProfileSetupFormData = {
  step1: Step1FormData | null;
  step2: Step2FormData | null;
  step3: Step3FormData | null;
  step4: Step4FormData | null;
};

// ===== Step Information =====
export const STEP_INFO: Record<ProfileSetupStep, { title: string; description: string }> = {
  [ProfileSetupStep.STEP_1]: {
    title: 'Basic Information',
    description: 'Provide your basic personal information',
  },
  [ProfileSetupStep.STEP_2]: {
    title: 'Contact Details',
    description: 'Provide your contact information',
  },
  [ProfileSetupStep.STEP_3]: {
    title: 'Preferences',
    description: 'Customize your preferences',
  },
  [ProfileSetupStep.STEP_4]: {
    title: 'Review & Complete',
    description: 'Review and accept terms to complete',
  },
};

type ProfileSetupState = {
  currentStep: ProfileSetupStep;
  completedSteps: ProfileSetupStep[];
  formData: ProfileSetupFormData;
  isCompleted: boolean;
  isProgressDrawerOpen: boolean;
  isMapDrawerOpen: boolean;
  isSubmitting: boolean;
};

type ProfileSetupActions = {
  setStepData: <K extends keyof ProfileSetupFormData>(
    key: K,
    data: ProfileSetupFormData[K]
  ) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: ProfileSetupStep) => void;
  completeStep: (step: ProfileSetupStep) => void;
  completeSetup: () => void;
  openProgressDrawer: () => void;
  closeProgressDrawer: () => void;
  openMapDrawer: () => void;
  closeMapDrawer: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
};

export type ProfileSetupStore = ProfileSetupState & ProfileSetupActions;
