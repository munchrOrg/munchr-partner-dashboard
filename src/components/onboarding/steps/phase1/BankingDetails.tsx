'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/stores/onboarding-store';

const bankingSchema = z.object({
  accountTitle: z.string().min(1, 'Account title is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  iban: z.string().min(1, 'IBAN is required'),
  sameAsBusinessAddress: z.boolean().default(false),
  enterAddress: z.string().optional(),
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
  const { formData, setFormData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BankingInput>({
    resolver: zodResolver(bankingSchema),
    defaultValues: {
      accountTitle: formData.banking?.accountTitle || '',
      bankName: formData.banking?.bankName || '',
      iban: formData.banking?.iban || '',
      sameAsBusinessAddress: formData.banking?.sameAsBusinessAddress || false,
      enterAddress: formData.banking?.enterAddress || '',
      buildingName: formData.banking?.buildingName || '',
      street: formData.banking?.street || '',
      houseNumber: formData.banking?.houseNumber || '',
      billingState: formData.banking?.billingState || '',
      billingCity: formData.banking?.billingCity || '',
      area: formData.banking?.area || '',
      billingPostalCode: formData.banking?.billingPostalCode || '',
    },
    mode: 'onChange',
  });

  const sameAsBusinessAddress = watch('sameAsBusinessAddress');

  const onSubmit = (data: BankingInput) => {
    setFormData('banking', {
      accountTitle: data.accountTitle,
      bankName: data.bankName,
      iban: data.iban,
      sameAsBusinessAddress: data.sameAsBusinessAddress,
      enterAddress: data.enterAddress || '',
      buildingName: data.buildingName || '',
      street: data.street,
      houseNumber: data.houseNumber,
      billingState: data.billingState,
      billingCity: data.billingCity || '',
      area: data.area || '',
      billingPostalCode: data.billingPostalCode,
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Where do you get paid?"
        description="Your bank details are encrypted and secure so no one access them, not even us."
      />

      <form id="banking-form" onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-gray-600" />
          <div className="text-sm text-gray-700">
            <p className="mb-2 font-semibold">
              Note: your have to upload a bank proof later in this process and the proof must
              matches with the details you share here. Please considfer the following.
            </p>
            <ul className="ml-1 list-inside list-disc space-y-1">
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
                setValue('sameAsBusinessAddress', checked as boolean);
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
            {...register('enterAddress')}
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
