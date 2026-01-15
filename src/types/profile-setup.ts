import type { Coordinates, FileUpload } from '@/types/onboarding';

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
  bankProofFiles: FileUpload[];
};

export type Step3FormData = {
  accountTitle: string;
  bankName: string;
  iban: string;
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
    title: 'Bank Proof',
    description: 'Upload your bank proof documents',
  },
  [ProfileSetupStep.STEP_3]: {
    title: 'Banking Details',
    description: '',
  },
  [ProfileSetupStep.STEP_4]: {
    title: 'Review & Complete',
    description: 'Review and accept terms to complete',
  },
};

export type ExampleDrawerConfig = {
  title: string;
  images: Array<{ label: string; src: string }>;
  imageContainerClass?: string;
};

type ProfileSetupState = {
  currentStep: ProfileSetupStep;
  completedSteps: ProfileSetupStep[];
  formData: ProfileSetupFormData;
  isCompleted: boolean;
  isProgressDrawerOpen: boolean;
  isMapDrawerOpen: boolean;
  isExampleDrawerOpen: boolean;
  exampleDrawerConfig: ExampleDrawerConfig | null;
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
  openExampleDrawer: (config: ExampleDrawerConfig) => void;
  closeExampleDrawer: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
};

export type ProfileSetupStore = ProfileSetupState & ProfileSetupActions;
