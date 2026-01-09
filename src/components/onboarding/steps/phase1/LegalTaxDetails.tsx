'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/stores/onboarding-store';

const legalTaxSchema = z.object({
  businessRegistrationNumber: z.string().min(1, 'Business registration number is required'),
  ntnNumber: z.string().min(1, 'NTN number is required'),
  stnNumber: z.string().optional(),
});

type LegalTaxInput = z.infer<typeof legalTaxSchema>;

export function LegalTaxDetails() {
  const { formData, setFormData } = useOnboardingStore();

  const {
    register,
    formState: { errors },
  } = useForm<LegalTaxInput>({
    resolver: zodResolver(legalTaxSchema),
    defaultValues: {
      businessRegistrationNumber: formData.legalTax?.businessRegistrationNumber || '',
      ntnNumber: formData.legalTax?.ntnNumber || '',
      stnNumber: formData.legalTax?.stnNumber || '',
    },
    mode: 'onChange',
  });

  const handleChange = (field: keyof LegalTaxInput, value: string) => {
    setFormData('legalTax', {
      businessRegistrationNumber: formData.legalTax?.businessRegistrationNumber || '',
      ntnNumber: formData.legalTax?.ntnNumber || '',
      stnNumber: formData.legalTax?.stnNumber || '',
      [field]: value,
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Add your legal and tax details"
        description="We need this information to verify your business and for tax purposes."
      />

      <form className="mt-6 space-y-4">
        <div>
          <Input
            placeholder="Business Registration Number *"
            {...register('businessRegistrationNumber')}
            onChange={(e) => handleChange('businessRegistrationNumber', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.businessRegistrationNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.businessRegistrationNumber.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="NTN Number *"
            {...register('ntnNumber')}
            onChange={(e) => handleChange('ntnNumber', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.ntnNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.ntnNumber.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="STN Number (Optional)"
            {...register('stnNumber')}
            onChange={(e) => handleChange('stnNumber', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
        </div>
      </form>
    </div>
  );
}
