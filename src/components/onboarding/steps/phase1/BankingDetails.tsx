'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/stores/onboarding-store';

const bankingSchema = z.object({
  accountTitle: z.string().min(1, 'Account title is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  iban: z.string().min(1, 'IBAN is required'),
  billingAddress: z.string().min(1, 'Billing address is required'),
  billingCity: z.string().min(1, 'City is required'),
  billingState: z.string().min(1, 'State is required'),
  billingPostalCode: z.string().min(1, 'Postal code is required'),
});

type BankingInput = z.infer<typeof bankingSchema>;

export function BankingDetails() {
  const { formData, setFormData } = useOnboardingStore();

  const {
    register,
    formState: { errors },
  } = useForm<BankingInput>({
    resolver: zodResolver(bankingSchema),
    defaultValues: {
      accountTitle: formData.banking?.accountTitle || '',
      bankName: formData.banking?.bankName || '',
      accountNumber: formData.banking?.accountNumber || '',
      iban: formData.banking?.iban || '',
      billingAddress: formData.banking?.billingAddress || '',
      billingCity: formData.banking?.billingCity || '',
      billingState: formData.banking?.billingState || '',
      billingPostalCode: formData.banking?.billingPostalCode || '',
    },
    mode: 'onChange',
  });

  const handleChange = (field: keyof BankingInput, value: string) => {
    setFormData('banking', {
      accountTitle: formData.banking?.accountTitle || '',
      bankName: formData.banking?.bankName || '',
      accountNumber: formData.banking?.accountNumber || '',
      iban: formData.banking?.iban || '',
      billingAddress: formData.banking?.billingAddress || '',
      billingCity: formData.banking?.billingCity || '',
      billingState: formData.banking?.billingState || '',
      billingPostalCode: formData.banking?.billingPostalCode || '',
      [field]: value,
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Where do you get paid?"
        description="Enter your bank account details where you want to receive payments."
      />

      <form className="mt-6 space-y-4">
        <div>
          <Input
            placeholder="Account Title *"
            {...register('accountTitle')}
            onChange={(e) => handleChange('accountTitle', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.accountTitle && (
            <p className="mt-1 text-sm text-red-500">{errors.accountTitle.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Bank Name *"
            {...register('bankName')}
            onChange={(e) => handleChange('bankName', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.bankName && (
            <p className="mt-1 text-sm text-red-500">{errors.bankName.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Account Number *"
            {...register('accountNumber')}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.accountNumber.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="IBAN *"
            {...register('iban')}
            onChange={(e) => handleChange('iban', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.iban && <p className="mt-1 text-sm text-red-500">{errors.iban.message}</p>}
        </div>

        <div className="pt-4">
          <h3 className="mb-4 font-medium text-gray-900">Billing Address</h3>
        </div>

        <div>
          <Input
            placeholder="Address *"
            {...register('billingAddress')}
            onChange={(e) => handleChange('billingAddress', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.billingAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.billingAddress.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="City *"
            {...register('billingCity')}
            onChange={(e) => handleChange('billingCity', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.billingCity && (
            <p className="mt-1 text-sm text-red-500">{errors.billingCity.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="State *"
            {...register('billingState')}
            onChange={(e) => handleChange('billingState', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.billingState && (
            <p className="mt-1 text-sm text-red-500">{errors.billingState.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Postal Code *"
            {...register('billingPostalCode')}
            onChange={(e) => handleChange('billingPostalCode', e.target.value)}
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
