'use client';

import type { BankStatementFormData, FileUpload } from '@/types/onboarding';
import { CircleAlert } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { createFileUploadFromKey } from '@/lib/helpers';
import { useUpdateProfile } from '@/react-query/auth/mutations';
import { useProfile } from '@/react-query/auth/queries';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { AssetType, OnboardingStep } from '@/types/onboarding';

export function BankStatementUpload() {
  const { openExampleDrawer, triggerNavigation } = useOnboardingStore();
  const { data: profile } = useProfile();
  const billingInfo = profile?.partner?.businessProfile?.billingInfo;
  const updateProfileMutation = useUpdateProfile();

  const [bankStatement, setBankStatement] = useState<BankStatementFormData>(() => {
    const prefilled = billingInfo?.chequeBookImageKey
      ? createFileUploadFromKey(billingInfo.chequeBookImageKey, 'Bank Statement')
      : billingInfo?.checkBookImage
        ? {
            name: billingInfo.checkBookImage.fileName || 'Unknown',
            size: billingInfo.checkBookImage.size || 0,
            url: billingInfo.checkBookImage.url || '',
          }
        : null;
    return { statementFile: prefilled };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankStatement.statementFile) {
      toast.error('Please upload your bank statement before continuing.');
      return;
    }

    try {
      const file = bankStatement.statementFile as FileUpload & { key?: string };
      await updateProfileMutation.mutateAsync({
        currentStep: OnboardingStep.BANK_STATEMENT_UPLOAD,
        chequeBookImageKey: file?.key || '',
      });

      triggerNavigation(OnboardingStep.BANK_STATEMENT_UPLOAD);
    } catch (error) {
      console.error('Failed to save bank statement:', error);
      toast.error('Failed to save data. Please try again.');
    }
  };

  const handleFileChange = (file: FileUpload | null) => {
    setBankStatement({ statementFile: file });
  };

  const showExample = () => {
    openExampleDrawer({
      title: 'Bank Statement Example',
      images: [{ label: 'Bank Statement / Book', src: '/cheque.png' }],
    });
  };

  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl px-4 py-8 sm:px-8"
    >
      <StepHeader
        title="Upload Bank Book / Account Statement"
        description="We need to verify a few things on out side."
        showExamples={true}
        onViewExample={showExample}
      />

      <div className="mt-6 flex items-start gap-3 rounded-lg bg-gray-100 p-4">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-gray-600" />
        <div className="text-sm text-gray-700">
          <p className="mb-2 font-semibold">Reminder:</p>
          <ul className="ml-1 list-inside list-disc space-y-1">
            <li>
              Your bank proof must show bank name, bank account owner name, and bank account number.
              (See sample at the top of this page.)
            </li>
            <li>
              If the details appear on separate pages or screens, you can upload multiple images or
              files.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <FileUploadBox
          label="Bank Statement"
          value={bankStatement.statementFile}
          onChange={handleFileChange}
          assetType={AssetType.CHEQUE_BOOK}
        />
      </div>
    </form>
  );
}
