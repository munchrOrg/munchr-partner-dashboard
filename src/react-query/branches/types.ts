export type OpeningTiming = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
};

export type BillingAddress = {
  address: string;
  landName: string;
  street: string;
  houseNumber: string;
  state: string;
  city: string;
  area: string;
  postalCode: string;
};

export type Branch = {
  id: string;
  businessName: string;
  description: string;
  cuisineIds: string[];
  email: string;
  buildingPlaceName: string;
  street: string;
  houseNumber: string;
  state: string;
  city: string;
  area: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  addCommentAboutLocation?: string;
  chequeBookImageKey?: string;
  bankName?: string;
  accountDetail?: string;
  iban?: string;
  billingAddressAreSame?: boolean;
  billingAddress?: BillingAddress;
  openingTiming?: OpeningTiming[];
  status?: string;
};

export type BranchDetails = {
  id: string;
  branchName: string;
  description: string;
  contactEmail: string;
  cuisineIds: string[];
  buildingPlaceName: string;
  street: string;
  houseNumber: string;
  state: string;
  city: string;
  area: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  addCommentAboutLocation?: string;
  operatingHours: OpeningTiming[];
};

export type BankingDetails = {
  bankAccountOwner?: string;
  bankName?: string;
  IBAN?: string;
  chequeBookImageKey?: string;
  billingAddressAreSame?: boolean;
  billingAddress?: BillingAddress;
};

export type OnboardingProgress = {
  currentStep: number;
  completedSteps: number[];
  isOnboardingCompleted: boolean;
};

export type BranchProfile = {
  branch: BranchDetails;
  bankingDetails: BankingDetails | null;
  onboarding: OnboardingProgress;
};

// Response types for GET /branches
export type BranchLocation = {
  buildingPlaceName: string | null;
  street: string | null;
  houseNumber: string | null;
  state: string | null;
  city: string | null;
  area: string | null;
  postalCode: string | null;
  addCommentAboutLocation: string | null;
  latitude: string | null;
  longitude: string | null;
};

export type BranchBillingAddress = {
  buildingPlaceName: string | null;
  street: string | null;
  houseNumber: string | null;
  state: string | null;
  city: string | null;
  area: string | null;
  postalCode: string | null;
  addCommentAboutLocation: string | null;
};

export type BranchBillingInfo = {
  id: string;
  bankAccountOwner: string | null;
  bankName: string | null;
  IBAN: string | null;
  chequeBookImageKey: string | null;
  billingAddressAreSame: boolean;
  billingAddress: BranchBillingAddress;
};

export type BranchOperatingHours = {
  dayOfWeek: number;
  startTime: string | null;
  endTime: string | null;
  isClosed: boolean;
};

export type BranchOnboarding = {
  currentStep: string | null;
  completedSteps: string[];
  steps: string[];
  isOnboardingCompleted: boolean;
};

export type BranchListItem = {
  id: string;
  partnerId: string;
  branchName: string;
  description: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  cuisineIds: string[];
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  location: BranchLocation;
  billingInfo: BranchBillingInfo | null;
  operatingHours: BranchOperatingHours[];
  onboarding: BranchOnboarding;
};

export type GetBranchesResponse = {
  branches: BranchListItem[];
};

export type BranchProfileUpdateRequest = {
  businessName?: string;
  description?: string;
  cuisineIds?: string[];
  buildingPlaceName?: string;
  street?: string;
  houseNumber?: string;
  state?: string;
  city?: string;
  area?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  addCommentAboutLocation?: string;
  chequeBookImageKey?: string;
  accountDetail?: string;
  bankName?: string;
  iban?: string;
  billingAddressAreSame?: boolean;
  billingAddress?: BillingAddress;
  openingTiming?: OpeningTiming[];
  markOnboardingComplete?: boolean;
};
