import type {
  ProfileOnboarding,
  ProfileResponse,
  UpdateProfileResponse,
} from '@/react-query/auth/types';
import type {
  BusinessHoursFormData,
  ConfirmModalConfig,
  DaySchedule,
  ExampleDrawerConfig,
  LocationFormData,
  OnboardingFormData,
  OnboardingPhase,
  OnboardingStep,
} from '@/types/onboarding';
import { create } from 'zustand';
import { getNextStep, getPrevStep, STEP_ORDER } from '@/config/onboarding-steps';

type OnboardingProfileState = {
  isInitialized: boolean;
  isInitializing: boolean;
  initError: string | null;

  profileData: ProfileResponse | null;

  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  completedPhases: OnboardingPhase[];

  formData: Partial<OnboardingFormData>;

  isProgressDrawerOpen: boolean;
  isExampleDrawerOpen: boolean;
  isMapDrawerOpen: boolean;
  exampleDrawerConfig: ExampleDrawerConfig | null;
  mapLocation: LocationFormData | null;
  mapLocationCallback: ((location: LocationFormData) => void) | null;
  isConfirmModalOpen: boolean;
  isEmailConfirmModalOpen: boolean;
  confirmModalConfig: ConfirmModalConfig | null;

  isSubmitting: boolean;
  isUploading: boolean;
};

type OnboardingProfileActions = {
  initialize: (profile: ProfileResponse) => void;
  setInitializing: (isInitializing: boolean) => void;
  setInitError: (error: string | null) => void;

  updateProfileData: (updates: Partial<ProfileResponse>) => void;
  mergeProfileFromResponse: (response: UpdateProfileResponse) => void;

  setCurrentStep: (step: OnboardingStep) => void;
  goToStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (step: OnboardingStep) => void;
  completePhase: (phase: OnboardingPhase) => void;

  setStepFormData: <K extends keyof OnboardingFormData>(
    stepKey: K,
    data: OnboardingFormData[K]
  ) => void;
  getStepFormData: <K extends keyof OnboardingFormData>(stepKey: K) => OnboardingFormData[K] | null;

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

  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;

  reset: () => void;
};

export type OnboardingProfileStore = OnboardingProfileState & OnboardingProfileActions;

const initialState: OnboardingProfileState = {
  isInitialized: false,
  isInitializing: false,
  initError: null,
  profileData: null,
  currentStep: 'welcome' as OnboardingStep,
  completedSteps: [],
  completedPhases: [],
  formData: {},
  isProgressDrawerOpen: false,
  isExampleDrawerOpen: false,
  isMapDrawerOpen: false,
  exampleDrawerConfig: null,
  mapLocation: null,
  mapLocationCallback: null,
  isConfirmModalOpen: false,
  isEmailConfirmModalOpen: false,
  confirmModalConfig: null,
  isSubmitting: false,
  isUploading: false,
};

function convertOperatingHoursToFormData(
  hours: { dayOfWeek: number; startTime?: string; endTime?: string; isClosed: boolean }[]
): BusinessHoursFormData {
  const dayMap: Record<number, keyof BusinessHoursFormData> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };

  const defaultSchedule: DaySchedule = { isOpen: false, slots: [] };
  const result: BusinessHoursFormData = {
    monday: { ...defaultSchedule },
    tuesday: { ...defaultSchedule },
    wednesday: { ...defaultSchedule },
    thursday: { ...defaultSchedule },
    friday: { ...defaultSchedule },
    saturday: { ...defaultSchedule },
    sunday: { ...defaultSchedule },
  };

  const hoursByDay: Record<string, typeof hours> = {};
  hours.forEach((hour) => {
    const day = dayMap[hour.dayOfWeek];
    if (day) {
      if (!hoursByDay[day]) {
        hoursByDay[day] = [];
      }
      hoursByDay[day].push(hour);
    }
  });

  Object.entries(hoursByDay).forEach(([day, dayHours]) => {
    const key = day as keyof BusinessHoursFormData;
    const isOpen = dayHours.some((h) => !h.isClosed);
    const slots = dayHours
      .filter((h) => !h.isClosed && h.startTime && h.endTime)
      .map((h) => ({ open: h.startTime!, close: h.endTime! }));

    result[key] = { isOpen, slots };
  });

  return result;
}

function extractFormDataFromProfile(profile: ProfileResponse): Partial<OnboardingFormData> {
  const formData: Partial<OnboardingFormData> = {};

  if (profile.location) {
    formData.location = {
      buildingPlaceName: profile.location.buildingPlaceName || '',
      street: profile.location.street || '',
      houseNumber: profile.location.houseNumber || '',
      state: profile.location.state || '',
      city: profile.location.city || '',
      area: profile.location.area || '',
      postalCode: profile.location.postalCode || '',
      addCommentAboutLocation: profile.location.addCommentAboutLocation || '',
      coordinates:
        profile.location.latitude && profile.location.longitude
          ? { lat: profile.location.latitude, lng: profile.location.longitude }
          : null,
    };
  }

  if (profile.businessProfile) {
    formData.ownerIdentity = {
      hasSNTN: profile.businessProfile.sntn ?? null,
      idCardFrontFile: profile.businessProfile.cnicFrontKey
        ? {
            name: 'ID Front',
            url: profile.businessProfile.cnicFrontKey,
            key: profile.businessProfile.cnicFrontKey,
          }
        : null,
      idCardBackFile: profile.businessProfile.cnicBackKey
        ? {
            name: 'ID Back',
            url: profile.businessProfile.cnicBackKey,
            key: profile.businessProfile.cnicBackKey,
          }
        : null,
      sntnFile: profile.businessProfile.ntnImageKey
        ? {
            name: 'NTN',
            url: profile.businessProfile.ntnImageKey,
            key: profile.businessProfile.ntnImageKey,
          }
        : null,
    };

    formData.legalTax = {
      cnicNumber: profile.businessProfile.cnicNumber || '',
      taxRegistrationNo: profile.businessProfile.taxRegistrationNo || '',
      firstAndMiddleNameForNic: profile.businessProfile.firstAndMiddleNameForNic || '',
      lastNameForNic: profile.businessProfile.lastNameForNic || '',
    };

    if (profile.businessProfile.menuImageKey) {
      formData.menu = {
        menuFile: {
          name: 'Menu',
          url: profile.businessProfile.menuImageKey,
          key: profile.businessProfile.menuImageKey,
        },
      };
    }

    if (
      profile.businessProfile.uploadScreenshotImageKey ||
      profile.businessProfile.paymentTransactionId
    ) {
      formData.onboardingFee = {
        paymentScreenshot: profile.businessProfile.uploadScreenshotImageKey
          ? {
              name: 'Payment Screenshot',
              url: profile.businessProfile.uploadScreenshotImageKey,
              key: profile.businessProfile.uploadScreenshotImageKey,
            }
          : null,
        paymentTransactionId: profile.businessProfile.paymentTransactionId || '',
      };
    }
  }

  if (profile.billingInfo) {
    formData.banking = {
      accountTitle: profile.billingInfo.bankAccountOwner || '',
      bankName: profile.billingInfo.bankName || '',
      iban: profile.billingInfo.IBAN || '',
      sameAsBusinessAddress: profile.billingInfo.billingAddressAreSame || false,
      street: profile.billingInfo.billingAddress?.street || '',
      houseNumber: profile.billingInfo.billingAddress?.houseNumber || '',
      billingState: profile.billingInfo.billingAddress?.state || '',
      billingCity: profile.billingInfo.billingAddress?.city || '',
      area: profile.billingInfo.billingAddress?.area || '',
      billingPostalCode: profile.billingInfo.billingAddress?.postalCode || '',
    };

    if (profile.billingInfo.chequeBookImageKey) {
      formData.bankStatement = {
        statementFile: {
          name: 'Bank Statement',
          url: profile.billingInfo.chequeBookImageKey,
          key: profile.billingInfo.chequeBookImageKey,
        },
      };
    }
  }

  if (profile.bookSlot) {
    formData.trainingCall = {
      networkProvider: profile.bookSlot.networkPreference as any,
      preferredDate: profile.bookSlot.bookingDate || '',
      preferredTime: profile.bookSlot.bookingTime || '',
    };
  }

  if (profile.primaryBranch?.operatingHours && profile.primaryBranch.operatingHours.length > 0) {
    formData.businessHours = convertOperatingHoursToFormData(profile.primaryBranch.operatingHours);
  }

  return formData;
}

export const useOnboardingProfileStore = create<OnboardingProfileStore>()((set, get) => ({
  ...initialState,

  initialize: (profile: ProfileResponse) => {
    const formData = extractFormDataFromProfile(profile);
    const currentStep =
      (profile.onboarding?.currentStep as OnboardingStep) || ('welcome' as OnboardingStep);
    const completedSteps = (profile.onboarding?.completedSteps || []) as OnboardingStep[];
    const completedPhases = (profile.onboarding?.completedPhases || []) as OnboardingPhase[];

    set({
      isInitialized: true,
      isInitializing: false,
      initError: null,
      profileData: profile,
      currentStep,
      completedSteps,
      completedPhases,
      formData,
    });
  },

  setInitializing: (isInitializing: boolean) => set({ isInitializing }),
  setInitError: (error: string | null) => set({ initError: error, isInitializing: false }),

  updateProfileData: (updates: Partial<ProfileResponse>) => {
    set((state) => ({
      profileData: state.profileData ? { ...state.profileData, ...updates } : null,
    }));
  },

  mergeProfileFromResponse: (response: UpdateProfileResponse) => {
    set((state) => {
      if (!state.profileData) {
        return state;
      }

      const newOnboarding = response.data?.onboarding || {};
      // Convert null to undefined for currentStep to match ProfileOnboarding type
      const mergedOnboarding: ProfileOnboarding = {
        ...state.profileData.onboarding,
        ...newOnboarding,
        currentStep: newOnboarding.currentStep ?? state.profileData.onboarding?.currentStep,
      };
      const updatedProfile: ProfileResponse = {
        ...state.profileData,
        onboarding: mergedOnboarding,
      };

      const currentStep = (newOnboarding.currentStep as OnboardingStep) || state.currentStep;
      const completedSteps =
        (newOnboarding.completedSteps as OnboardingStep[]) || state.completedSteps;
      const completedPhases =
        (newOnboarding.completedPhases as OnboardingPhase[]) || state.completedPhases;

      return {
        profileData: updatedProfile,
        currentStep,
        completedSteps,
        completedPhases,
      };
    });
  },

  setCurrentStep: (step: OnboardingStep) => set({ currentStep: step }),

  goToStep: (step: OnboardingStep) => {
    const { completedSteps, currentStep } = get();
    const stepIndex = STEP_ORDER.indexOf(step);
    const currentIndex = STEP_ORDER.indexOf(currentStep);

    const isBackNavigation = stepIndex < currentIndex && completedSteps.includes(step);
    const isCurrentStep = step === currentStep;

    if (isBackNavigation || isCurrentStep || stepIndex === currentIndex + 1) {
      set({ currentStep: step });
    }
  },

  nextStep: () => {
    const { currentStep } = get();
    const next = getNextStep(currentStep);
    if (next) {
      set({ currentStep: next });
    }
  },

  previousStep: () => {
    const { currentStep, completedSteps } = get();
    const prev = getPrevStep(currentStep);
    if (prev && (completedSteps.includes(prev) || prev === ('welcome' as OnboardingStep))) {
      set({ currentStep: prev });
    }
  },

  completeStep: (step: OnboardingStep) => {
    set((state) => ({
      completedSteps: state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step],
    }));
  },

  completePhase: (phase: OnboardingPhase) => {
    set((state) => ({
      completedPhases: state.completedPhases.includes(phase)
        ? state.completedPhases
        : [...state.completedPhases, phase],
    }));
  },

  setStepFormData: <K extends keyof OnboardingFormData>(
    stepKey: K,
    data: OnboardingFormData[K]
  ) => {
    set((state) => ({
      formData: { ...state.formData, [stepKey]: data },
    }));
  },

  getStepFormData: <K extends keyof OnboardingFormData>(stepKey: K) => {
    return (get().formData[stepKey] as OnboardingFormData[K]) || null;
  },

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

  setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
  setIsUploading: (isUploading: boolean) => set({ isUploading }),

  reset: () => set(initialState),
}));
