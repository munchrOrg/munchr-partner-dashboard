'use client';

import type { FileUpload } from '@/types/onboarding';
import { useEffect } from 'react';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function OwnerIdentityUpload() {
  const { formData, setFormData, openExampleDrawer, profile } = useOnboardingStore();
  const businessProfile = profile?.partner?.businessProfile;

  const ownerIdentity = {
    hasSNTN: businessProfile?.sntn ?? formData.ownerIdentity?.hasSNTN ?? null,

    idCardFrontFile:
      businessProfile?.idCardFrontFile ?? formData.ownerIdentity?.idCardFrontFile ?? null,

    idCardBackFile:
      businessProfile?.idCardBackFile ?? formData.ownerIdentity?.idCardBackFile ?? null,

    sntnFile: businessProfile?.ntnImages ?? formData.ownerIdentity?.sntnFile ?? null,
  };
  useEffect(() => {
    setFormData('ownerIdentity', ownerIdentity);
  }, [profile]);

  const handleSNTNChange = (value: string) => {
    setFormData('ownerIdentity', {
      ...ownerIdentity,
      hasSNTN: value === 'yes',
    });
  };

  const handleIdCardFrontChange = (file: FileUpload | null) => {
    setFormData('ownerIdentity', {
      ...ownerIdentity,
      idCardFrontFile: file,
    });
  };

  const handleIdCardBackChange = (file: FileUpload | null) => {
    setFormData('ownerIdentity', {
      ...ownerIdentity,
      idCardBackFile: file,
    });
  };

  const handleSntnChange = (file: FileUpload | null) => {
    setFormData('ownerIdentity', {
      ...ownerIdentity,
      sntnFile: file,
    });
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
    <div className="flex h-full w-full items-start justify-center px-4 py-10 sm:px-8">
      <div className="flex w-full max-w-xl flex-col items-start justify-start">
        <StepHeader
          title="Upload Business Owner ID (Front and Back)"
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

          {/* Conditional Upload Boxes */}
          {ownerIdentity.hasSNTN === true && (
            <FileUploadBox
              label="SNTN"
              value={ownerIdentity.sntnFile}
              onChange={handleSntnChange}
            />
          )}

          {ownerIdentity.hasSNTN === false && (
            <div className="space-y-4">
              <FileUploadBox
                label="ID Card (Front)"
                value={ownerIdentity.idCardFrontFile}
                onChange={handleIdCardFrontChange}
              />
              <FileUploadBox
                label="ID Card (Back)"
                value={ownerIdentity.idCardBackFile}
                onChange={handleIdCardBackChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
