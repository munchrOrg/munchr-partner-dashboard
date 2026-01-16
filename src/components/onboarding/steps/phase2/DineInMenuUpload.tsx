'use client';

import type { FileUpload } from '@/types/onboarding';
import { useEffect } from 'react';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function DineInMenuUpload() {
  const { formData, setFormData, openExampleDrawer, profile } = useOnboardingStore();
  const businessProfile = profile?.partner?.businessProfile;
  const prefilledMenuFile = businessProfile?.menuImage
    ? {
        name: businessProfile.menuImage.fileName || 'Unknown',
        size: businessProfile.menuImage.size || 0,
        url: businessProfile.menuImage.url || '',
      }
    : formData.menu?.menuFile || null;

  useEffect(() => {
    setFormData('menu', { menuFile: prefilledMenuFile });
  }, [profile]);

  const handleFileChange = (file: FileUpload | null) => {
    setFormData('menu', { menuFile: file });
  };

  const showExample = () => {
    openExampleDrawer({
      title: 'Menu Example',
      images: [{ label: 'Sample Menu', src: '/food-menu.png' }],
      imageContainerClass: 'aspect-square',
    });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Add your Dine-in Menu"
        description="Upload a menu image or file, and we'll extract the items and prices for you: no manual typing needed! Just make sure it's clear and readable with visible prices."
        onViewExample={showExample}
        showExamples={true}
      />

      <div className="mt-8">
        <FileUploadBox
          label="Menu"
          value={prefilledMenuFile || null}
          onChange={handleFileChange}
          acceptedFormats=".jpg, .png, .jpeg, .pdf, .tiff, .docx, .xlsx"
          maxSizeMB={4}
        />
      </div>
    </div>
  );
}
