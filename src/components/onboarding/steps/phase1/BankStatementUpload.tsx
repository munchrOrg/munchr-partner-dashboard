'use client';

import type { FileUpload } from '@/types/onboarding';
import { CircleAlert } from 'lucide-react';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function BankStatementUpload() {
  const { formData, setFormData, openExampleDrawer } = useOnboardingStore();

  const handleFileChange = (file: FileUpload | null) => {
    setFormData('bankStatement', { statementFile: file });
  };

  const showExample = () => {
    openExampleDrawer({
      title: 'Bank Statement Example',
      images: [{ label: 'Bank Statement / Book', src: '/cheque.png' }],
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
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
          value={formData.bankStatement?.statementFile || null}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
