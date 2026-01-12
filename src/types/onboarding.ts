// ===== Base Types (Reusable) =====
export type FileUpload = {
  name: string;
  url: string;
  size?: number;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type TimeSlot = {
  open: string;
  close: string;
};

export type DaySchedule = {
  isOpen: boolean;
  slots: TimeSlot[];
};

// ===== Enums =====
export enum OnboardingStep {
  // Phase 1: Add Your Business
  WELCOME = 'welcome',
  ADD_BUSINESS_INTRO = 'add-business-intro',
  BUSINESS_LOCATION = 'business-location',
  OWNER_IDENTITY_UPLOAD = 'owner-identity-upload',
  LEGAL_TAX_DETAILS = 'legal-tax-details',
  BANKING_DETAILS = 'banking-details',
  BANK_STATEMENT_UPLOAD = 'bank-statement-upload',
  PARTNERSHIP_PACKAGE = 'partnership-package',
  PAYMENT_METHOD_SELECTION = 'payment-method-selection',
  BUSINESS_INFO_REVIEW = 'business-info-review',

  // Phase 2: Verify Your Business
  VERIFY_BUSINESS_INTRO = 'verify-business-intro',
  DINE_IN_MENU_UPLOAD = 'dine-in-menu-upload',
  TRAINING_CALL_PREFERENCE = 'training-call-preference',
  GROWTH_INFORMATION = 'growth-information',
  ONBOARDING_FEE_PAYMENT = 'onboarding-fee-payment',
  PORTAL_SETUP_COMPLETE = 'portal-setup-complete',

  // Phase 3: Open Your Business
  OPEN_BUSINESS_INTRO = 'open-business-intro',
  BUSINESS_HOURS_SETUP = 'business-hours-setup',
}

export enum OnboardingPhase {
  ADD_BUSINESS = 'add-business',
  VERIFY_BUSINESS = 'verify-business',
  OPEN_BUSINESS = 'open-business',
}

export enum PaymentMethod {
  EASYPAISA = 'easypaisa',
  JAZZCASH = 'jazzcash',
  MYPAY = 'mypay',
  CARD = 'card',
}

export enum NetworkProvider {
  ZONG = 'zong',
  UFONE = 'ufone',
  JAZZ = 'jazz',
  TELENOR = 'telenor',
}

// export enum DayOfWeek {
//   MONDAY = 'monday',
//   TUESDAY = 'tuesday',
//   WEDNESDAY = 'wednesday',
//   THURSDAY = 'thursday',
//   FRIDAY = 'friday',
//   SATURDAY = 'saturday',
//   SUNDAY = 'sunday',
// }

// ===== Form Data Types =====
export type BusinessInfoFormData = {
  serviceProviderType: 'restaurant' | 'home-chef';
  businessName: string;
  businessDescription: string;
  email: string;
  phoneNumber: string;
  cuisines: string[];
};

export type LocationFormData = {
  buildingName: string;
  street: string;
  houseNumber: string;
  state: string;
  city: string;
  area: string;
  postalCode: string;
  comment: string;
  coordinates: Coordinates | null;
};

export type OwnerIdentityFormData = {
  hasSNTN: boolean | null;
  idCardFrontFile: FileUpload | null;
  idCardBackFile: FileUpload | null;
  sntnFile: FileUpload | null;
};

export type LegalTaxFormData = {
  cnicNumber: string;
  taxRegistrationNumber: string;
  firstAndMiddleName: string;
  lastName: string;
};

export type BankingFormData = {
  accountTitle: string;
  bankName: string;
  iban: string;
  sameAsBusinessAddress: boolean;
  enterAddress?: string;
  buildingName?: string;
  street: string;
  houseNumber: string;
  billingState: string;
  billingCity?: string;
  area?: string;
  billingPostalCode: string;
};

export type BankStatementFormData = {
  statementFile: FileUpload | null;
};

export type PackageFormData = {
  selectedPackageId: string;
};

export type PaymentMethodFormData = {
  method: PaymentMethod | null;
  accountNumber?: string;
  accountTitle?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
};

export type MenuFormData = {
  menuFile: FileUpload | null;
};

export type TrainingCallFormData = {
  networkProvider: NetworkProvider | null;
  preferredDate: string;
  preferredTime: string;
};

export type OnboardingFeeFormData = {
  paymentScreenshot: FileUpload | null;
};

export type BusinessHoursFormData = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

// ===== Store Types =====
export type OnboardingFormData = {
  businessInfo: BusinessInfoFormData | null;
  location: LocationFormData | null;
  ownerIdentity: OwnerIdentityFormData | null;
  legalTax: LegalTaxFormData | null;
  banking: BankingFormData | null;
  bankStatement: BankStatementFormData | null;
  package: PackageFormData | null;
  paymentMethod: PaymentMethodFormData | null;
  menu: MenuFormData | null;
  trainingCall: TrainingCallFormData | null;
  onboardingFee: OnboardingFeeFormData | null;
  businessHours: BusinessHoursFormData | null;
};

type OnboardingState = {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  completedPhases: OnboardingPhase[];
  formData: OnboardingFormData;

  // UI State
  isProgressDrawerOpen: boolean;
  isExampleDrawerOpen: boolean;
  isMapDrawerOpen: boolean;
  isConfirmModalOpen: boolean;
  isEmailConfirmModalOpen: boolean;
  exampleDrawerConfig: ExampleDrawerConfig | null;
  confirmModalConfig: ConfirmModalConfig | null;

  // Navigation State
  shouldNavigate: boolean;
  navigationStep: OnboardingStep | null;
};

type OnboardingActions = {
  setFormData: <K extends keyof OnboardingFormData>(key: K, data: OnboardingFormData[K]) => void;
  completeStep: (step: OnboardingStep) => void;
  completePhase: (phase: OnboardingPhase) => void;
  goToStep: (step: OnboardingStep) => void;

  // UI Actions
  openProgressDrawer: () => void;
  closeProgressDrawer: () => void;
  openExampleDrawer: (config: ExampleDrawerConfig) => void;
  closeExampleDrawer: () => void;
  openMapDrawer: () => void;
  closeMapDrawer: () => void;
  openConfirmModal: (config: ConfirmModalConfig) => void;
  closeConfirmModal: () => void;
  openEmailConfirmModal: () => void;
  closeEmailConfirmModal: () => void;

  // Navigation Actions
  triggerNavigation: (step: OnboardingStep) => void;
  clearNavigation: () => void;

  reset: () => void;
};

export type OnboardingStore = OnboardingState & OnboardingActions;

// ===== UI Config Types =====
export type ExampleDrawerConfig = {
  title: string;
  images: { label: string; src: string }[];
  imageContainerClass?: string;
};

export type ConfirmModalConfig = {
  title: string;
  description: string;
  bulletPoints?: string[];
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

// ===== Component Props =====
export type StepHeaderProps = {
  phase?: string;
  title: string;
  description?: string;
  centered?: boolean;
  showExamples?: boolean;
  onViewExample?: () => void;
};

export type FileUploadBoxProps = {
  label: string;
  value: FileUpload | null;
  onChange: (file: FileUpload | null) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
};

export type IntroStepProps = {
  phaseLabel?: string;
  title: string;
  description: string;
  items?: { label: string; completed?: boolean }[];
  illustrationName?: string;
  illustrationClassName?: string;
};
