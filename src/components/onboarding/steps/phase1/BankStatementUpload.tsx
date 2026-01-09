'use client';

import type { FileUpload } from '@/types/onboarding';
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
      images: [{ label: 'Bank Statement / Book', src: '/bank-statement-example.png' }],
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Upload Bank Book / Account Statement"
        description="Please upload a copy of your bank book or recent account statement for verification."
      />

      <div className="mt-6">
        <FileUploadBox
          label="Bank Statement"
          value={formData.bankStatement?.statementFile || null}
          onChange={handleFileChange}
          onViewExample={showExample}
        />
      </div>
    </div>
  );
}
