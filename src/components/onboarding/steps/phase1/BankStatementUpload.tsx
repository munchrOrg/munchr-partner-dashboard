'use client';

import type { BankStatementFormData, FileUpload } from '@/types/onboarding';
import { CircleAlert } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { createFileUploadFromKey } from '@/lib/helpers';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { AssetType } from '@/types/onboarding';

export function BankStatementUpload() {
  const {
    openExampleDrawer,
    setIsUploading,
    profileData,
    formData,
    setStepFormData,
    setPendingFormSubmit,
  } = useOnboardingProfileStore();

  const billingInfo = profileData?.billingInfo;

  const [bankStatement, setBankStatement] = useState<BankStatementFormData>(() => {
    if (formData.bankStatement) {
      return formData.bankStatement;
    }
    const prefilled = billingInfo?.chequeBookImageKey
      ? createFileUploadFromKey(billingInfo.chequeBookImageKey, 'Bank Statement')
      : null;
    return { statementFile: prefilled };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankStatement.statementFile) {
      toast.error('Please upload your bank statement before continuing.');
      return;
    }

    setStepFormData('bankStatement', bankStatement);
    setPendingFormSubmit(true);
  };

  const handleFileChange = (file: FileUpload | null) => {
    setBankStatement({ statementFile: file });
  };

  const handleUploadingChange = useCallback(
    (isUploading: boolean) => {
      setIsUploading(isUploading);
    },
    [setIsUploading]
  );

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
          onUploadingChange={handleUploadingChange}
        />
      </div>
    </form>
  );
}
