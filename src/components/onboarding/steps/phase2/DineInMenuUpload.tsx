'use client';

import type { FileUpload } from '@/types/onboarding';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function DineInMenuUpload() {
  const { formData, setFormData, openExampleDrawer, openConfirmModal } = useOnboardingStore();

  const handleFileChange = (file: FileUpload | null) => {
    setFormData('menu', { menuFile: file });

    if (file) {
      // Show requirements confirmation modal after upload
      openConfirmModal({
        title: 'Does your menu meet the requirements?',
        description:
          'Please make sure your menu is clear, readable, and includes all items with prices. Low quality images may delay the verification process.',
        confirmText: 'Yes, it meets requirements',
        onConfirm: () => {
          // Continue - handled by modal close
        },
      });
    }
  };

  const showExample = () => {
    openExampleDrawer({
      title: 'Menu Example',
      images: [{ label: 'Sample Menu', src: '/menu-example.png' }],
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Add your Dine-in Menu"
        description="Upload a clear photo of your complete menu. This will be displayed to customers."
      />

      <div className="mt-6">
        <FileUploadBox
          label="Menu"
          value={formData.menu?.menuFile || null}
          onChange={handleFileChange}
          onViewExample={showExample}
        />

        <div className="mt-4 rounded-lg bg-amber-50 p-4">
          <h4 className="font-medium text-amber-800">Menu Requirements</h4>
          <ul className="mt-2 space-y-1 text-sm text-amber-700">
            <li>• Clear, high-resolution image</li>
            <li>• All items with accurate prices</li>
            <li>• Readable text and item descriptions</li>
            <li>• Current and up-to-date menu</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
