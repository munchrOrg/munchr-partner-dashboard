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
