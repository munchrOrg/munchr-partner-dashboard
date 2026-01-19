'use client';

import type { FileUpload, MenuFormData } from '@/types/onboarding';
import { useState } from 'react';
import { toast } from 'sonner';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { createFileUploadFromKey } from '@/lib/helpers';
import { useUpdateProfile } from '@/react-query/auth/mutations';
import { useProfile } from '@/react-query/auth/queries';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { AssetType, OnboardingStep } from '@/types/onboarding';

export function DineInMenuUpload() {
  const { openExampleDrawer, openConfirmModal, triggerNavigation } = useOnboardingStore();
  const { data: profile } = useProfile();
  const businessProfile = profile?.partner?.businessProfile;
  const updateProfileMutation = useUpdateProfile();

  const [menu, setMenu] = useState<MenuFormData>(() => {
    const prefilled = businessProfile?.menuImageKey
      ? createFileUploadFromKey(businessProfile.menuImageKey, 'Menu')
      : businessProfile?.menuImage
        ? {
            name: businessProfile.menuImage.fileName || 'Unknown',
            size: businessProfile.menuImage.size || 0,
            url: businessProfile.menuImage.url || '',
          }
        : null;
    return { menuFile: prefilled };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menu.menuFile) {
      toast.error('Please upload your menu before continuing.');
      return;
    }

    try {
      const file = menu.menuFile as FileUpload & { key?: string };
      await updateProfileMutation.mutateAsync({
        currentStep: OnboardingStep.DINE_IN_MENU_UPLOAD,
        menuImageKey: file?.key || '',
      });

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
        onConfirm: () => triggerNavigation(OnboardingStep.DINE_IN_MENU_UPLOAD),
      });
    } catch (error) {
      console.error('Failed to save menu:', error);
      toast.error('Failed to save data. Please try again.');
    }
  };

  const handleFileChange = (file: FileUpload | null) => {
    setMenu({ menuFile: file });
  };

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
        />
      </div>
    </form>
  );
}
