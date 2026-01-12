'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingStep } from '@/types/onboarding';

const legalTaxSchema = z.object({
  cnicNumber: z.string().max(13).min(13, 'CNIC number is required'),
  taxRegistrationNumber: z.string().min(1, 'Tax registration number is required'),
  firstAndMiddleName: z.string().min(1, 'First and middle name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

type LegalTaxInput = z.infer<typeof legalTaxSchema>;

export function LegalTaxDetails() {
  const { formData, setFormData, openExampleDrawer, triggerNavigation } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LegalTaxInput>({
    resolver: zodResolver(legalTaxSchema),
    defaultValues: {
      cnicNumber: formData.legalTax?.cnicNumber || '',
      taxRegistrationNumber: formData.legalTax?.taxRegistrationNumber || '',
      firstAndMiddleName: formData.legalTax?.firstAndMiddleName || '',
      lastName: formData.legalTax?.lastName || '',
    },
    mode: 'all',
  });

  const onSubmit = (data: LegalTaxInput) => {
    // Save form data
    setFormData('legalTax', {
      cnicNumber: data.cnicNumber,
      taxRegistrationNumber: data.taxRegistrationNumber,
      firstAndMiddleName: data.firstAndMiddleName,
      lastName: data.lastName,
    });

    // Trigger navigation (Footer will handle it)
    triggerNavigation(OnboardingStep.LEGAL_TAX_DETAILS);
  };

  const showNameExample = () => {
    openExampleDrawer({
      title: 'Name Example',
      images: [{ label: 'Correct Name Format', src: '/name-example.png' }],
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Add your legal and tax details"
        description="We need your tac and company information to create your munchr partner contract."
      />

      <form id="legal-tax-form" onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Input
            placeholder="CNIC Number *"
            {...register('cnicNumber')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.cnicNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.cnicNumber.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Tax Registration Number *"
            {...register('taxRegistrationNumber')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.taxRegistrationNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.taxRegistrationNumber.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="First and Middle Name *"
            {...register('firstAndMiddleName')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.firstAndMiddleName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstAndMiddleName.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Last Name *"
            {...register('lastName')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </form>
      <div className="mt-6 flex items-start gap-2 rounded-lg bg-gray-100 p-4">
        <CircleAlert className="text-gray-light size-4 shrink-0" />

        <span className="text-gray-light text-sm">
          Please ensure your full name matches your NIC. Do not include your father's name.
          <Button
            variant="link"
            className="text-purple-dark ml-1 p-0 text-sm font-bold"
            onClick={showNameExample}
            type="button"
          >
            See Sample
          </Button>
        </span>
      </div>
    </div>
  );
}
