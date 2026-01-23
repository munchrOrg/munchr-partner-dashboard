import type { UpdateProfileRequest } from '@/react-query/auth/types';
import type {
  BankingFormData,
  BankStatementFormData,
  BusinessHoursFormData,
  FileUpload,
  LegalTaxFormData,
  LocationFormData,
  MenuFormData,
  OnboardingFeeFormData,
  OnboardingFormData,
  OwnerIdentityFormData,
  TrainingCallFormData,
} from '@/types/onboarding';
import { convertTo24HourFormat, is24HourFormat } from '@/lib/helpers';

type FileWithKey = FileUpload & { key?: string };

export function transformFormDataToPayload(
  formKey: keyof OnboardingFormData,
  formData: OnboardingFormData[keyof OnboardingFormData] | null
): Partial<UpdateProfileRequest> {
  if (!formData) {
    return {};
  }

  switch (formKey) {
    case 'location':
      return transformLocationPayload(formData as LocationFormData);

    case 'ownerIdentity':
      return transformOwnerIdentityPayload(formData as OwnerIdentityFormData);

    case 'legalTax':
      return transformLegalTaxPayload(formData as LegalTaxFormData);

    case 'banking':
      return transformBankingPayload(formData as BankingFormData);

    case 'bankStatement':
      return transformBankStatementPayload(formData as BankStatementFormData);

    case 'menu':
      return transformMenuPayload(formData as MenuFormData);

    case 'trainingCall':
      return transformTrainingCallPayload(formData as TrainingCallFormData);

    case 'onboardingFee':
      return transformOnboardingFeePayload(formData as OnboardingFeeFormData);

    case 'businessHours':
      return transformBusinessHoursPayload(formData as BusinessHoursFormData);

    default:
      return {};
  }
}

function transformLocationPayload(data: LocationFormData): Partial<UpdateProfileRequest> {
  return {
    buildingPlaceName: data.buildingPlaceName,
    street: data.street,
    houseNumber: data.houseNumber,
    state: data.state,
    city: data.city,
    area: data.area,
    postalCode: data.postalCode,
    addCommentAboutLocation: data.addCommentAboutLocation,
    latitude: data.coordinates?.lat,
    longitude: data.coordinates?.lng,
  };
}

function transformOwnerIdentityPayload(data: OwnerIdentityFormData): Partial<UpdateProfileRequest> {
  const payload: Partial<UpdateProfileRequest> = {
    sntn: data.hasSNTN ?? undefined,
  };

  const front = data.idCardFrontFile as FileWithKey;
  const back = data.idCardBackFile as FileWithKey;
  if (front?.key) {
    payload.cnicFrontKey = front.key;
  }
  if (back?.key) {
    payload.cnicBackKey = back.key;
  }

  if (data.hasSNTN) {
    const sntnFile = data.sntnFile as FileWithKey;
    if (sntnFile?.key) {
      payload.ntnImageKey = sntnFile.key;
    }
  }

  return payload;
}

function transformLegalTaxPayload(data: LegalTaxFormData): Partial<UpdateProfileRequest> {
  return {
    cnicNumber: data.cnicNumber,
    taxRegistrationNo: data.taxRegistrationNo,
    firstAndMiddleNameForNic: data.firstAndMiddleNameForNic,
    lastNameForNic: data.lastNameForNic,
  };
}

function transformBankingPayload(data: BankingFormData): Partial<UpdateProfileRequest> {
  const payload: Partial<UpdateProfileRequest> = {
    billingAddressAreSame: data.sameAsBusinessAddress,
    bankAccountOwner: data.accountTitle,
    bankName: data.bankName,
    IBAN: data.iban,
  };

  if (!data.sameAsBusinessAddress) {
    payload.billingAddress = {
      address: data.address || '',
      street: data.street || '',
      houseNumber: data.houseNumber || '',
      state: data.billingState || '',
      city: data.billingCity || '',
      area: data.area || '',
      postalCode: data.billingPostalCode || '',
    };
  }

  return payload;
}

function transformBankStatementPayload(data: BankStatementFormData): Partial<UpdateProfileRequest> {
  const file = data.statementFile as FileWithKey;
  return {
    chequeBookImageKey: file?.key || '',
  };
}

function transformMenuPayload(data: MenuFormData): Partial<UpdateProfileRequest> {
  const file = data.menuFile as FileWithKey;
  return {
    menuImageKey: file?.key || '',
  };
}

function transformTrainingCallPayload(data: TrainingCallFormData): Partial<UpdateProfileRequest> {
  const time24 =
    data.preferredTime && !is24HourFormat(data.preferredTime)
      ? convertTo24HourFormat(data.preferredTime)
      : data.preferredTime;

  return {
    bookSlot: {
      networkPreference: data.networkProvider || '',
      date: data.preferredDate,
      time: time24,
    },
  };
}

function transformOnboardingFeePayload(data: OnboardingFeeFormData): Partial<UpdateProfileRequest> {
  const file = data.paymentScreenshot as FileWithKey;
  return {
    uploadScreenshotImageKey: file?.key || '',
    paymentTransactionId: data.paymentTransactionId,
  };
}

function transformBusinessHoursPayload(data: BusinessHoursFormData): Partial<UpdateProfileRequest> {
  const dayMapping: Record<string, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
  };

  const operatingHours: UpdateProfileRequest['operatingHours'] = [];

  Object.entries(data).forEach(([day, schedule]) => {
    const dayOfWeek = dayMapping[day];
    if (dayOfWeek === undefined) {
      return;
    }

    if (schedule.isOpen && schedule.slots.length > 0) {
      schedule.slots.forEach((slot) => {
        operatingHours.push({
          dayOfWeek,
          startTime: slot.open,
          endTime: slot.close,
          isClosed: false,
        });
      });
    } else {
      operatingHours.push({
        dayOfWeek,
        startTime: '00:00',
        endTime: '00:00',
        isClosed: true,
      });
    }
  });

  return { operatingHours };
}
