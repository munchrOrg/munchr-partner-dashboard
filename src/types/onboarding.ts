// ===== Base Types (Reusable) =====
export type FileUpload = {
  name: string;
  url: string;
  size?: number;
  key?: string;
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

export enum AssetType {
  CNIC_FRONT = 'cnic-front',
  CNIC_BACK = 'cnic-back',
  NTN = 'ntn',
  CHEQUE_BOOK = 'cheque-book',
  PAYMENT_SCREENSHOT = 'payment-screenshot',
  MENU = 'menu',
  LOGO = 'logo',
  OTHER = 'other',
}

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
  buildingPlaceName: string;
  street: string;
  houseNumber: string;
  state: string;
  city: string;
  area: string;
  postalCode: string;
  addCommentAboutLocation: string;
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
  taxRegistrationNo: string;
  firstAndMiddleNameForNic: string;
  lastNameForNic: string;
};

export type BankingFormData = {
  accountTitle: string;
  bankName: string;
  iban: string;
  sameAsBusinessAddress: boolean;
  address?: string;
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

export type SavedPaymentAccount = {
  id: string;
  method: PaymentMethod;
  accountNumber?: string;
  accountTitle?: string;
  cardNumber?: string;
  cardExpiry?: string;
};

export type PaymentMethodFormData = {
  savedAccounts: SavedPaymentAccount[];
  selectedAccountId: string | null;
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
  paymentTransactionId: string;
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
  assetType?: AssetType | string;
};

export type IntroStepProps = {
  phaseLabel?: string;
  title: string;
  description: string;
  items?: { label: string; completed?: boolean }[];
  illustrationName?: string;
  illustrationClassName?: string;
};
