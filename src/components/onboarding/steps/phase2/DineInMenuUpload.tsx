'use client';

import type { FileUpload, MenuFormData } from '@/types/onboarding';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { createFileUploadFromKey } from '@/lib/helpers';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { AssetType } from '@/types/onboarding';

export function DineInMenuUpload() {
  const {
    openExampleDrawer,
    openConfirmModal,
    setIsUploading,
    profileData,
    formData,
    setStepFormData,
    setPendingFormSubmit,
  } = useOnboardingProfileStore();

  const businessProfile = profileData?.businessProfile;

  const [menu, setMenu] = useState<MenuFormData>(() => {
    if (formData.menu) {
      return formData.menu;
    }
    const prefilled = businessProfile?.menuImageKey
      ? createFileUploadFromKey(businessProfile.menuImageKey, 'Menu')
      : null;
    return { menuFile: prefilled };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!menu.menuFile) {
      toast.error('Please upload your menu before continuing.');
      return;
    }

    setStepFormData('menu', menu);

    openConfirmModal({
      title: 'Does your menu meet the requirements?',
      description:
        'If the menu fails to meet the conditions, we cannot process your request to join munchr.',
      bulletPoints: [
        'A minimum of menu items for Regular Restaurants, or 18 items for Home Chefs.',
        'All menu items have a price',
      ],
      confirmText: 'Yes, Continue',
      cancelText: 'No, Re-upload Menu',
      onConfirm: () => {
        setPendingFormSubmit(true);
      },
    });
  };

  const handleFileChange = (file: FileUpload | null) => {
    setMenu({ menuFile: file });
  };

  const handleUploadingChange = useCallback(
    (isUploading: boolean) => {
      setIsUploading(isUploading);
    },
    [setIsUploading]
  );

  const showExample = () => {
    openExampleDrawer({
      title: 'Menu Example',
      images: [{ label: 'Sample Menu', src: '/food-menu.png' }],
      imageContainerClass: 'aspect-square',
    });
  };

  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl px-4 py-8 sm:px-8"
    >
      <StepHeader
        title="Add your Dine-in Menu"
        description="Upload a menu image or file, and we'll extract the items and prices for you: no manual typing needed! Just make sure it's clear and readable with visible prices."
        onViewExample={showExample}
        showExamples={true}
      />

      <div className="mt-8">
        <FileUploadBox
          label="Menu"
          value={menu.menuFile}
          onChange={handleFileChange}
          acceptedFormats=".jpg, .png, .jpeg, .pdf, .tiff, .docx, .xlsx"
          maxSizeMB={4}
          assetType={AssetType.MENU}
          onUploadingChange={handleUploadingChange}
        />
      </div>
    </form>
  );
}
