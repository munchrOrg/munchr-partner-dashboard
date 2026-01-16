'use client';

import type { Step2Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BankProofUploadBox } from '@/components/profile-setup/shared/BankProofUploadBox';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step2Schema } from '@/validations/profile-setup';

export function Step2() {
  const { formData, setStepData, completeStep, nextStep, openExampleDrawer } =
    useProfileSetupStore();

  const form = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData.step2 || {
      bankProofFiles: [],
    },
  });

  useEffect(() => {
    if (formData.step2) {
      form.reset(formData.step2);
    }
  }, [formData.step2, form]);

  const showExample = () => {
    openExampleDrawer({
      title: 'Bank Proof Example',
      images: [{ label: 'Bank Statement / Book', src: '/assets/images/PK_Bank 1.png' }],
      imageContainerClass: 'w-[400px] h-[250px]',
    });
  };

  const onSubmit = (data: Step2Input) => {
    setStepData('step2', data);
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
        <form
          id="profile-setup-step2-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Reminder Section */}
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
            control={form.control}
            name="bankProofFiles"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <BankProofUploadBox
                    value={field.value || []}
                    onChange={field.onChange}
                    acceptedFormats=".jpg, .png, .jpeg, .pdf, .tiff, .docx, .xlsx"
                    maxSizeMB={4}
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
