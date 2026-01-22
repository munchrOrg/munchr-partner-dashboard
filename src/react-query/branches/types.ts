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

export type BranchesResponse = {
  data: Branch[];
};

export type BranchProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    branch: {
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
    bankingDetails: {
      bankAccountOwner?: string;
      bankName?: string;
      IBAN?: string;
      chequeBookImageKey?: string;
      billingAddressAreSame?: boolean;
      billingAddress?: BillingAddress;
    } | null;
    onboarding: {
      currentStep: number;
      completedSteps: number[];
      isOnboardingCompleted: boolean;
    };
  };
};

export type BranchProfileUpdateRequest = {
  branchName?: string;
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

  bankAccountOwner?: string;
  bankName?: string;
  IBAN?: string;
  billingAddressAreSame?: boolean;
  billingAddress?: BillingAddress;

  openingTiming?: OpeningTiming[];

  currentStep?: number;
  completeStep?: number;
  markOnboardingComplete?: boolean;
};
