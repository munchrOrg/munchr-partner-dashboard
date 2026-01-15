'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { toast } from 'sonner';
import { z } from 'zod';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useUpdateProfile } from '@/react-query/auth/mutations';
import { useProfile } from '@/react-query/auth/queries';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingStep } from '@/types/onboarding';

const bankingSchema = z.object({
  accountTitle: z.string().min(1, 'Account title is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  iban: z.string().min(1, 'IBAN is required'),
  sameAsBusinessAddress: z.boolean(),
  address: z.string().optional(),
  buildingName: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  billingState: z.string().min(1, 'State is required'),
  billingCity: z.string().optional(),
  area: z.string().optional(),
  billingPostalCode: z.string().min(1, 'Postal code is required'),
});

type BankingInput = z.infer<typeof bankingSchema>;

export function BankingDetails() {
  const { data: profile } = useProfile();
  const { triggerNavigation } = useOnboardingStore();
  const updateProfileMutation = useUpdateProfile();

  const businessProfile = profile?.partner?.businessProfile?.billingInfo;
  const businessProfileAddressData = profile?.partner?.businessProfile;

  const bankingPrefill = {
    accountTitle: businessProfile?.bankAccountOwner || '',
    bankName: businessProfile?.bankName || '',
    iban: businessProfile?.IBAN || '',
    sameAsBusinessAddress: businessProfile?.billingAddressAreSame || false,
    address: '',
    buildingName: businessProfile?.billingBuildingPlaceName || '',
    street: businessProfile?.billingStreet || '',
    houseNumber: businessProfile?.billingHouseNumber || '',
    billingState: businessProfile?.billingState || '',
    billingCity: businessProfile?.billingCity || '',
    area: businessProfile?.billingArea || '',
    billingPostalCode: businessProfile?.billingPostalCode || '',
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BankingInput>({
    resolver: zodResolver(bankingSchema),
    defaultValues: bankingPrefill,
    mode: 'all',
  });

  const sameAsBusinessAddress = useWatch({ control, name: 'sameAsBusinessAddress' });

  useEffect(() => {
    if (sameAsBusinessAddress) {
      setValue('address', businessProfileAddressData?.address || '');
      setValue('buildingName', businessProfileAddressData?.buildingPlaceName || '');
      setValue('street', businessProfileAddressData?.street || '');
      setValue('houseNumber', businessProfileAddressData?.houseNumber || '');
      setValue('billingState', businessProfileAddressData?.state || '');
      setValue('billingCity', businessProfileAddressData?.city || '');
      setValue('area', businessProfileAddressData?.area || '');
      setValue('billingPostalCode', businessProfileAddressData?.postalCode || '');
    } else {
      // Clear all fields
      setValue('address', '');
      setValue('buildingName', '');
      setValue('street', '');
      setValue('houseNumber', '');
      setValue('billingState', '');
      setValue('billingCity', '');
      setValue('area', '');
      setValue('billingPostalCode', '');
    }
  }, [sameAsBusinessAddress, businessProfileAddressData, setValue]);

  const onSubmit = async (data: BankingInput) => {
    const payload: any = {
      currentStep: OnboardingStep.BANKING_DETAILS,
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

    try {
      const resp = await updateProfileMutation.mutateAsync(payload);
      if (!resp || !resp.success) {
        toast.error(resp?.message || 'Failed to save banking details');
        return;
      }
      triggerNavigation(OnboardingStep.BANKING_DETAILS);
    } catch (err) {
      toast.error('Something went wrong while saving banking details');
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Where do you get paid?"
        description="Your bank details are encrypted and secure so no one access them, not even us."
      />

      <form id="onboarding-step-form" onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Input
            placeholder="Bank Account Owner / Title *"
            {...register('accountTitle')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.accountTitle && (
            <p className="mt-1 text-sm text-red-500">{errors.accountTitle.message}</p>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-lg bg-gray-100 p-4">
          <CircleAlert className="text-gray-light mt-0.5 size-5 shrink-0" />
          <div className="text-gray-light text-sm">
            <p className="mb-2">
              Note: you have to upload a bank proof later in this process and the proof must match
              with the details you share here. Please consider the following.
            </p>
            <ul className="text-gray-light ml-1 list-inside list-disc space-y-1 text-sm">
              <li>The bank account holder's name exactly as it appears on the bank statement</li>
              <li>
                If the bank account is under your business name, add the business name rather than
                the personal name.
              </li>
            </ul>
          </div>
        </div>

        <div>
          <Input
            placeholder="Bank Name *"
            {...register('bankName')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.bankName && (
            <p className="mt-1 text-sm text-red-500">{errors.bankName.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="IBAN *"
            {...register('iban')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.iban && <p className="mt-1 text-sm text-red-500">{errors.iban.message}</p>}
        </div>

        <div className="pt-6">
          <h3 className="mb-2 text-2xl font-bold">Billing Address</h3>
          <p className="mb-4 text-base font-semibold text-gray-700">
            Please Provide your billing address. Select the checkbox if your business is same as
            billing address
          </p>

          <div className="mb-4 flex items-center space-x-2">
            <Checkbox
              id="sameAddress"
              checked={sameAsBusinessAddress}
              onCheckedChange={(checked) => {
                setValue('sameAsBusinessAddress', Boolean(checked));
              }}
            />
            <label
              htmlFor="sameAddress"
              className="text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              My billing & business address are same
            </label>
          </div>
        </div>

        <div>
          <Input
            placeholder="Enter Address"
            {...register('address')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
        </div>

        <div>
          <Input
            placeholder="Building or Lace naem"
            {...register('buildingName')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
        </div>

        <div>
          <Input
            placeholder="Street *"
            {...register('street')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>}
        </div>

        <div>
          <Input
            placeholder="House Number *"
            {...register('houseNumber')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.houseNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.houseNumber.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="State *"
            {...register('billingState')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.billingState && (
            <p className="mt-1 text-sm text-red-500">{errors.billingState.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="City"
            {...register('billingCity')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
        </div>

        <div>
          <Input
            placeholder="Area"
            {...register('area')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
        </div>

        <div>
          <Input
            placeholder="Postal Code *"
            {...register('billingPostalCode')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.billingPostalCode && (
            <p className="mt-1 text-sm text-red-500">{errors.billingPostalCode.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}
