'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboardingUpdateProfile } from '@/hooks/useOnboardingUpdateProfile';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { OnboardingStep } from '@/types/onboarding';

const legalTaxSchema = z.object({
  cnicNumber: z.string().max(13).min(13, 'CNIC number is required'),
  taxRegistrationNo: z.string().min(1, 'Tax registration number is required'),
  firstAndMiddleNameForNic: z.string().min(1, 'First and middle name is required'),
  lastNameForNic: z.string().min(1, 'Last name is required'),
});

type LegalTaxInput = z.infer<typeof legalTaxSchema>;

export function LegalTaxDetails() {
  const { openExampleDrawer, profileData, formData, setStepFormData } = useOnboardingProfileStore();
  const { updateProfile } = useOnboardingUpdateProfile();

  const businessProfile = profileData?.businessProfile;

  const legalTaxDefaults = formData.legalTax || {
    cnicNumber: businessProfile?.cnicNumber || '',
    taxRegistrationNo: businessProfile?.taxRegistrationNo || '',
    firstAndMiddleNameForNic: businessProfile?.firstAndMiddleNameForNic || '',
    lastNameForNic: businessProfile?.lastNameForNic || '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LegalTaxInput>({
    resolver: zodResolver(legalTaxSchema),
    defaultValues: legalTaxDefaults,
    mode: 'all',
  });

  const onSubmit = async (data: LegalTaxInput) => {
    setStepFormData('legalTax', data);

    const payload = {
      completeStep: OnboardingStep.LEGAL_TAX_DETAILS,
      cnicNumber: data.cnicNumber,
      taxRegistrationNo: data.taxRegistrationNo,
      firstAndMiddleNameForNic: data.firstAndMiddleNameForNic,
      lastNameForNic: data.lastNameForNic,
    };

    try {
      const resp = await updateProfile(payload, { shouldAdvanceStep: true });

      if (!resp || !resp.success) {
        toast.error(resp?.message || 'Failed to save legal & tax details');
      }
    } catch (err) {
      toast.error('Something went wrong while saving legal & tax details');
      console.error(err);
    }
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

      <form id="onboarding-step-form" onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
            {...register('taxRegistrationNo')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.taxRegistrationNo && (
            <p className="mt-1 text-sm text-red-500">{errors.taxRegistrationNo.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="First and Middle Name *"
            {...register('firstAndMiddleNameForNic')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.firstAndMiddleNameForNic && (
            <p className="mt-1 text-sm text-red-500">{errors.firstAndMiddleNameForNic.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Last Name *"
            {...register('lastNameForNic')}
            className="h-12 rounded-full border-gray-300 px-4"
          />
          {errors.lastNameForNic && (
            <p className="mt-1 text-sm text-red-500">{errors.lastNameForNic.message}</p>
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
