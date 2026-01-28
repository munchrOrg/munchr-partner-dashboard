'use client';

import type { FileUpload, OwnerIdentityFormData } from '@/types/onboarding';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createFileUploadFromKey } from '@/lib/helpers';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { AssetType } from '@/types/onboarding';

export function OwnerIdentityUpload() {
  const {
    openExampleDrawer,
    setIsUploading,
    profileData,
    formData,
    setStepFormData,
    setPendingFormSubmit,
  } = useOnboardingProfileStore();

  const businessProfile = profileData?.businessProfile;

  const uploadCountRef = useRef(0);
  const handleUploadingChange = useCallback(
    (isUploading: boolean) => {
      uploadCountRef.current += isUploading ? 1 : -1;
      setIsUploading(uploadCountRef.current > 0);
    },
    [setIsUploading]
  );

  const [ownerIdentity, setOwnerIdentity] = useState<OwnerIdentityFormData>(() => {
    if (formData.ownerIdentity) {
      return formData.ownerIdentity;
    }
    return {
      hasSNTN: businessProfile?.sntn ?? null,
      idCardFrontFile: businessProfile?.cnicFrontKey
        ? createFileUploadFromKey(businessProfile.cnicFrontKey, 'CNIC Front')
        : null,
      idCardBackFile: businessProfile?.cnicBackKey
        ? createFileUploadFromKey(businessProfile.cnicBackKey, 'CNIC Back')
        : null,
      sntnFile: businessProfile?.ntnImageKey
        ? createFileUploadFromKey(businessProfile.ntnImageKey, 'NTN')
        : null,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (ownerIdentity.hasSNTN === null) {
      toast.error('Please select whether you have a Sales Tax Registration Number (SNTN).');
      return;
    }

    if (!ownerIdentity.idCardFrontFile) {
      toast.error('Please upload the front of your ID card.');
      return;
    }
    if (!ownerIdentity.idCardBackFile) {
      toast.error('Please upload the back of your ID card.');
      return;
    }

    if (ownerIdentity.hasSNTN && !ownerIdentity.sntnFile) {
      toast.error('Please upload your SNTN document.');
      return;
    }

    setStepFormData('ownerIdentity', ownerIdentity);
    setPendingFormSubmit(true);
  };

  const handleSNTNChange = (value: string) => {
    const newValue = value === 'yes';
    setOwnerIdentity((prev) => ({
      ...prev,
      hasSNTN: newValue,
      sntnFile: newValue ? prev.sntnFile : null,
    }));
  };

  const handleIdCardFrontChange = (file: FileUpload | null) => {
    setOwnerIdentity((prev) => ({
      ...prev,
      idCardFrontFile: file,
    }));
  };

  const handleIdCardBackChange = (file: FileUpload | null) => {
    setOwnerIdentity((prev) => ({
      ...prev,
      idCardBackFile: file,
    }));
  };

  const handleSntnChange = (file: FileUpload | null) => {
    setOwnerIdentity((prev) => ({
      ...prev,
      sntnFile: file,
    }));
  };

  const showIdCardExample = () => {
    openExampleDrawer({
      title: 'ID Card Example',
      images: [
        { label: 'Front Side', src: '/cnic-front.png' },
        { label: 'Back Side', src: '/cnic-back.png' },
      ],
    });
  };

  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleSubmit}
      className="flex h-full w-full items-start justify-center px-4 py-10 sm:px-8"
    >
      <div className="flex w-full max-w-xl flex-col items-start justify-start">
        <StepHeader
          title="Upload Business Owner ID"
          description="We need to verify your identity. Please upload front and back of your ID card."
          showExamples={true}
          onViewExample={showIdCardExample}
        />

        <div className="space-y-6">
          {/* SNTN Question */}
          <div>
            <p className="mb-3 text-lg font-bold">
              Does your restaurant have Sales tax Registration Number (SNTN)?
            </p>
            <RadioGroup
              value={
                ownerIdentity.hasSNTN === null ? undefined : ownerIdentity.hasSNTN ? 'yes' : 'no'
              }
              onValueChange={handleSNTNChange}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sntn-yes" />
                <Label htmlFor="sntn-yes" className="text-lg font-bold">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sntn-no" />
                <Label htmlFor="sntn-no" className="text-lg font-bold">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {ownerIdentity.hasSNTN !== null && (
            <div className="space-y-4">
              <FileUploadBox
                label="ID Card (Front) *"
                value={ownerIdentity.idCardFrontFile}
                onChange={handleIdCardFrontChange}
                assetType={AssetType.CNIC_FRONT}
                onUploadingChange={handleUploadingChange}
              />
              <FileUploadBox
                label="ID Card (Back) *"
                value={ownerIdentity.idCardBackFile}
                onChange={handleIdCardBackChange}
                assetType={AssetType.CNIC_BACK}
                onUploadingChange={handleUploadingChange}
              />
              {ownerIdentity.hasSNTN === true && (
                <FileUploadBox
                  label="SNTN *"
                  value={ownerIdentity.sntnFile}
                  onChange={handleSntnChange}
                  assetType={AssetType.NTN}
                  onUploadingChange={handleUploadingChange}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
