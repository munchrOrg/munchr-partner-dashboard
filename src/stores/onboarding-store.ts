import type {
  ConfirmModalConfig,
  ExampleDrawerConfig,
  LocationFormData,
  OnboardingStep,
} from '@/types/onboarding';
import { create } from 'zustand';

type OnboardingUIState = {
  isProgressDrawerOpen: boolean;
  isExampleDrawerOpen: boolean;
  isMapDrawerOpen: boolean;
  exampleDrawerConfig: ExampleDrawerConfig | null;

  mapLocation: LocationFormData | null;
  mapLocationCallback: ((location: LocationFormData) => void) | null;

  isConfirmModalOpen: boolean;
  isEmailConfirmModalOpen: boolean;
  confirmModalConfig: ConfirmModalConfig | null;

  shouldNavigate: boolean;
  navigationStep: OnboardingStep | null;
};

type OnboardingUIActions = {
  openProgressDrawer: () => void;
  closeProgressDrawer: () => void;
  openExampleDrawer: (config: ExampleDrawerConfig) => void;
  closeExampleDrawer: () => void;
  openMapDrawer: (
    location: LocationFormData,
    onConfirm: (location: LocationFormData) => void
  ) => void;
  closeMapDrawer: () => void;
  updateMapLocation: (location: LocationFormData) => void;

  openConfirmModal: (config: ConfirmModalConfig) => void;
  closeConfirmModal: () => void;
  openEmailConfirmModal: () => void;
  closeEmailConfirmModal: () => void;

  triggerNavigation: (step: OnboardingStep) => void;
  clearNavigation: () => void;

  reset: () => void;
};

export type OnboardingUIStore = OnboardingUIState & OnboardingUIActions;

const initialState: OnboardingUIState = {
  isProgressDrawerOpen: false,
  isExampleDrawerOpen: false,
  isMapDrawerOpen: false,
  exampleDrawerConfig: null,
  mapLocation: null,
  mapLocationCallback: null,
  isConfirmModalOpen: false,
  isEmailConfirmModalOpen: false,
  confirmModalConfig: null,
  shouldNavigate: false,
  navigationStep: null,
};

export const useOnboardingStore = create<OnboardingUIStore>()((set) => ({
  ...initialState,

  openProgressDrawer: () => set({ isProgressDrawerOpen: true }),
  closeProgressDrawer: () => set({ isProgressDrawerOpen: false }),

  openExampleDrawer: (config: ExampleDrawerConfig) =>
    set({ isExampleDrawerOpen: true, exampleDrawerConfig: config }),
  closeExampleDrawer: () => set({ isExampleDrawerOpen: false, exampleDrawerConfig: null }),

  openMapDrawer: (location: LocationFormData, onConfirm: (location: LocationFormData) => void) =>
    set({ isMapDrawerOpen: true, mapLocation: location, mapLocationCallback: onConfirm }),
  closeMapDrawer: () =>
    set({ isMapDrawerOpen: false, mapLocation: null, mapLocationCallback: null }),
  updateMapLocation: (location: LocationFormData) => set({ mapLocation: location }),

  openConfirmModal: (config: ConfirmModalConfig) =>
    set({ isConfirmModalOpen: true, confirmModalConfig: config }),
  closeConfirmModal: () => set({ isConfirmModalOpen: false, confirmModalConfig: null }),

  openEmailConfirmModal: () => set({ isEmailConfirmModalOpen: true }),
  closeEmailConfirmModal: () => set({ isEmailConfirmModalOpen: false }),

  triggerNavigation: (step: OnboardingStep) => set({ shouldNavigate: true, navigationStep: step }),
  clearNavigation: () => set({ shouldNavigate: false, navigationStep: null }),

  reset: () => set(initialState),
}));
