import type {
  ConfirmModalConfig,
  ExampleDrawerConfig,
  OnboardingFormData,
  OnboardingPhase,
  OnboardingStep,
  OnboardingStore,
} from '@/types/onboarding';
import { create } from 'zustand';

import { persist } from 'zustand/middleware';
import { OnboardingStep as Step } from '@/types/onboarding';

const initialFormData: OnboardingFormData = {
  businessInfo: null,
  location: null,
  ownerIdentity: null,
  legalTax: null,
  banking: null,
  bankStatement: null,
  package: null,
  paymentMethod: null,
  menu: null,
  trainingCall: null,
  onboardingFee: null,
  businessHours: null,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: Step.WELCOME,
      completedSteps: [],
      completedPhases: [],
      formData: initialFormData,

      isProgressDrawerOpen: false,
      isExampleDrawerOpen: false,
      isMapDrawerOpen: false,
      isConfirmModalOpen: false,
      isEmailConfirmModalOpen: false,
      exampleDrawerConfig: null,
      confirmModalConfig: null,

      shouldNavigate: false,
      navigationStep: null,
      profile: null,

      setFormData: <K extends keyof OnboardingFormData>(key: K, data: OnboardingFormData[K]) =>
        set((state) => ({
          formData: { ...state.formData, [key]: data },
        })),

      completeStep: (step: OnboardingStep) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      completePhase: (phase: OnboardingPhase) =>
        set((state) => ({
          completedPhases: state.completedPhases.includes(phase)
            ? state.completedPhases
            : [...state.completedPhases, phase],
        })),

      goToStep: (step: OnboardingStep) => set({ currentStep: step }),

      openProgressDrawer: () => set({ isProgressDrawerOpen: true }),
      closeProgressDrawer: () => set({ isProgressDrawerOpen: false }),

      openExampleDrawer: (config: ExampleDrawerConfig) =>
        set({ isExampleDrawerOpen: true, exampleDrawerConfig: config }),
      closeExampleDrawer: () => set({ isExampleDrawerOpen: false, exampleDrawerConfig: null }),

      openMapDrawer: () => set({ isMapDrawerOpen: true }),
      closeMapDrawer: () => set({ isMapDrawerOpen: false }),

      openConfirmModal: (config: ConfirmModalConfig) =>
        set({ isConfirmModalOpen: true, confirmModalConfig: config }),
      closeConfirmModal: () => set({ isConfirmModalOpen: false, confirmModalConfig: null }),

      openEmailConfirmModal: () => set({ isEmailConfirmModalOpen: true }),
      closeEmailConfirmModal: () => set({ isEmailConfirmModalOpen: false }),

      triggerNavigation: (step: OnboardingStep) =>
        set({ shouldNavigate: true, navigationStep: step }),
      clearNavigation: () => set({ shouldNavigate: false, navigationStep: null }),
      setProfile: (profileData: any) => set({ profile: profileData }),

      syncFromBackend: (onboardingData: {
        currentStep: OnboardingStep | null;
        completedSteps: string[];
        completedPhases: string[];
      }) =>
        set({
          currentStep: (onboardingData.currentStep as OnboardingStep) || Step.WELCOME,
          completedSteps: (onboardingData.completedSteps || []) as OnboardingStep[],
          completedPhases: (onboardingData.completedPhases || []) as OnboardingPhase[],
        }),

      reset: () =>
        set({
          currentStep: Step.WELCOME,
          completedSteps: [],
          completedPhases: [],
          formData: initialFormData,
          isProgressDrawerOpen: false,
          isExampleDrawerOpen: false,
          isMapDrawerOpen: false,
          isConfirmModalOpen: false,
          isEmailConfirmModalOpen: false,
          exampleDrawerConfig: null,
          confirmModalConfig: null,
          shouldNavigate: false,
          navigationStep: null,
        }),
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        completedPhases: state.completedPhases,
        formData: state.formData,
      }),
    }
  )
);
