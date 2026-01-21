'use client';

import type { Step2Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useUpdateBranch } from '@/react-query/branches/mutations';
import { useBranchOnboardingProfile } from '@/react-query/branches/queries';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { AssetType } from '@/types/onboarding';
import { step2Schema } from '@/validations/profile-setup';

export function Step2() {
  const { formData, setStepData, completeStep, nextStep, openExampleDrawer } =
    useProfileSetupStore();

  const form = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData.step2 || { bankProofFiles: [] },
  });
  const { reset, control, handleSubmit } = form;

  useEffect(() => {
    if (formData.step2) {
      reset(formData.step2);
    }
  }, [formData.step2, reset]);
  const { mutate: updateBranch } = useUpdateBranch();

  const showExample = () => {
    openExampleDrawer({
      title: 'Bank Proof Example',
      images: [{ label: 'Bank Statement / Book', src: '/assets/images/PK_Bank 1.png' }],
      imageContainerClass: 'w-[400px] h-[250px]',
    });
  };

  const { data: branchData }: any = useBranchOnboardingProfile();
  const branchName = branchData?.data?.branch?.branchName;
  const onSubmit = async (data: Step2Input) => {
    setStepData('step2', data);
    await updateBranch({
      chequeBookImageKey: data?.bankProofFiles[0]?.name,
      businessName: branchName,
    } as any);
    completeStep(2);
    nextStep();
  };

  return (
    <div className="mx-auto mt-2 space-y-6 lg:max-w-[446px]">
      <div className="flex gap-1">
        <p>We need to verify a few things on our side.</p>
        <button
          type="button"
          onClick={showExample}
          className="text-sm font-medium text-[#2C2F2E] hover:underline"
        >
          See example
        </button>
      </div>
      <Form {...form}>
        <form id="profile-setup-step2-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-start gap-3 rounded-[15px] bg-[#F4F4F4] p-[22px]">
            <Info className="mt-0.5 size-5 shrink-0 text-[#918D8C]" />
            <div className="text-sm text-[#918D8C]">
              <p className="mb-2 text-[14px] font-bold">Reminder:</p>
              <ul className="list-inside list-disc space-y-1 text-[14px] font-normal">
                <li>
                  Your bank proof must show bank name, bank account owner name, and bank account
                  number. (See sample at the top of this page.)
                </li>
                <li>
                  If the details appear on separate pages or screens, you can upload multiple images
                  or files.
                </li>
              </ul>
            </div>
          </div>

          {/* File Upload */}
          <FormField
            control={control}
            name="bankProofFiles"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUploadBox
                    label="Bank Statement"
                    value={field.value?.[0] || null}
                    onChange={(file) => field.onChange(file ? [file] : [])}
                    assetType={AssetType.CHEQUE_BOOK}
                    maxSizeMB={4}
                    acceptedFormats=".jpg, .png, .jpeg, .pdf, .tiff, .docx, .xlsx"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
