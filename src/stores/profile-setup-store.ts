import type { LocationFormData } from '@/types/onboarding';
import type {
  ExampleDrawerConfig,
  ProfileSetupFormData,
  ProfileSetupStore,
} from '@/types/profile-setup';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProfileSetupStep } from '@/types/profile-setup';

const initialFormData: ProfileSetupFormData = {
  step1: null,
  step2: null,
  step3: null,
  step4: null,
};

export const useProfileSetupStore = create<ProfileSetupStore>()(
  persist(
    (set) => ({
      currentStep: ProfileSetupStep.STEP_1,
      completedSteps: [],
      formData: initialFormData,
      isCompleted: false,
      isProgressDrawerOpen: false,
      isMapDrawerOpen: false,
      mapLocation: null,
      mapLocationCallback: null,
      isExampleDrawerOpen: false,
      exampleDrawerConfig: null,
      isScheduleDrawerOpen: false,
      isSubmitting: false,

      setStepData: <K extends keyof ProfileSetupFormData>(
        key: K,
        data: ProfileSetupFormData[K]
      ) => {
        set((state) => ({
          formData: { ...state.formData, [key]: data },
        }));
      },

      nextStep: () =>
        set((state) => {
          const nextStepNumber = state.currentStep + 1;
          if (nextStepNumber <= ProfileSetupStep.STEP_4) {
            return { currentStep: nextStepNumber as ProfileSetupStep };
          }
          return state;
        }),

      previousStep: () =>
        set((state) => {
          const prevStepNumber = state.currentStep - 1;
          if (prevStepNumber >= ProfileSetupStep.STEP_1) {
            return { currentStep: prevStepNumber as ProfileSetupStep };
          }
          return state;
        }),

      goToStep: (step: ProfileSetupStep) => set({ currentStep: step }),

      completeStep: (step: ProfileSetupStep) => {
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        }));
      },

      completeSetup: () => set({ isCompleted: true }),

      openProgressDrawer: () => set({ isProgressDrawerOpen: true }),
      closeProgressDrawer: () => set({ isProgressDrawerOpen: false }),
      openMapDrawer: (
        location: LocationFormData,
        onConfirm: (location: LocationFormData) => void
      ) => set({ isMapDrawerOpen: true, mapLocation: location, mapLocationCallback: onConfirm }),
      closeMapDrawer: () =>
        set({ isMapDrawerOpen: false, mapLocation: null, mapLocationCallback: null }),
      updateMapLocation: (location: LocationFormData) => set({ mapLocation: location }),
      openExampleDrawer: (config: ExampleDrawerConfig) =>
        set({ isExampleDrawerOpen: true, exampleDrawerConfig: config }),
      closeExampleDrawer: () => set({ isExampleDrawerOpen: false, exampleDrawerConfig: null }),
      openScheduleDrawer: () => set({ isScheduleDrawerOpen: true }),
      closeScheduleDrawer: () => set({ isScheduleDrawerOpen: false }),
      setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

      reset: () =>
        set({
          currentStep: ProfileSetupStep.STEP_1,
          completedSteps: [],
          formData: initialFormData,
          isCompleted: false,
          isProgressDrawerOpen: false,
          isMapDrawerOpen: false,
          mapLocation: null,
          mapLocationCallback: null,
          isExampleDrawerOpen: false,
          exampleDrawerConfig: null,
          isScheduleDrawerOpen: false,
          isSubmitting: false,
        }),
    }),
    {
      name: 'profile-setup-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        formData: state.formData,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
