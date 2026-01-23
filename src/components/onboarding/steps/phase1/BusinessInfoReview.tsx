'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { EmailConfirmModal } from '@/components/onboarding/shared/EmailConfirmModal';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Checkbox } from '@/components/ui/checkbox';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { OnboardingStep } from '@/types/onboarding';

export function BusinessInfoReview() {
  const { profileData, openEmailConfirmModal, goToStep } = useOnboardingProfileStore();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms and Conditions to continue');
      return;
    }

    openEmailConfirmModal();
  };

  const partner = profileData?.partner;
  const businessProfile = profileData?.businessProfile;
  const location = profileData?.location;
  const billingInfo = profileData?.billingInfo;

  const handleChange = (step: OnboardingStep) => {
    goToStep(step);
  };

  const formatAddress = () => {
    const buildingPlaceName = location?.buildingPlaceName || '';
    const street = location?.street || '';
    const houseNumber = location?.houseNumber || '';
    const postalCode = location?.postalCode || '';
    const city = location?.city || '';
    const state = location?.state || '';

    const parts = [buildingPlaceName, street, houseNumber, postalCode, city, state].filter(Boolean);

    return parts.length ? parts.join(', ') : 'Not provided';
  };

  const formatBillingAddress = () => {
    const billingAddress = billingInfo?.billingAddress;
    const buildingName = billingAddress?.buildingPlaceName || '';
    const street = billingAddress?.street || '';
    const houseNumber = billingAddress?.houseNumber || '';
    const billingState = billingAddress?.state || '';
    const billingCity = billingAddress?.city || '';
    const area = billingAddress?.area || '';
    const postalCode = billingAddress?.postalCode || '';
    const parts = [
      buildingName,
      street,
      houseNumber,
      billingState,
      billingCity,
      area,
      postalCode,
    ].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Not provided';
  };
  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl px-4 py-8 sm:px-8"
    >
      <StepHeader
        title="Make sure everything is correct"
        description="Check all your business information is correct before we add it to our partner portal and create your contract."
      />

      <div className="mt-8 space-y-8">
        {/* What does your business do */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">What does your business do?</h2>
            <button
              type="button"
              onClick={() => handleChange(OnboardingStep.ADD_BUSINESS_INTRO)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Business name</span>
              <span className="font-medium">{businessProfile?.businessName || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business type</span>
              <span className="font-medium capitalize">
                {partner?.serviceProviderType === 'restaurant'
                  ? 'Restaurant'
                  : partner?.serviceProviderType === 'home_chef'
                    ? 'Home Chef'
                    : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business category</span>
              <span className="font-medium">
                {partner?.serviceProviderType === 'home_chef'
                  ? 'Home Based Kitchen'
                  : partner?.serviceProviderType === 'restaurant'
                    ? 'Restaurant'
                    : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business cuisine</span>
              <span className="font-medium">
                {businessProfile?.cuisines?.length
                  ? businessProfile.cuisines.join(', ')
                  : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile phone number</span>
              <span className="font-medium">{partner?.phone || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business phone number</span>
              <span className="font-medium">
                {businessProfile?.businessPhone || partner?.phone || 'Not provided'}
              </span>
            </div>
          </div>
        </div>

        {/* Where is your business located */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">Where is your business located?</h2>
            <button
              type="button"
              onClick={() => handleChange(OnboardingStep.BUSINESS_LOCATION)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Restaurant Address</span>
              <span className="max-w-md text-right font-medium">{formatAddress()}</span>
            </div>
          </div>
        </div>

        {/* Upload Business Owner ID */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">Upload Business Owner ID (Front and Back)</h2>
            <button
              type="button"
              onClick={() => handleChange(OnboardingStep.OWNER_IDENTITY_UPLOAD)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Does your restaurant have Sales tax Registration Number (SNTN)?
              </span>
              <span className="font-medium">{businessProfile?.sntn ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Add your legal and tax details */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">Add your legal and tax details</h2>
            <button
              type="button"
              onClick={() => handleChange(OnboardingStep.LEGAL_TAX_DETAILS)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">CNIC Number</span>
              <span className="font-medium">{businessProfile?.cnicNumber || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">First & Middle Name Per CNIC</span>
              <span className="font-medium">
                {businessProfile?.firstAndMiddleNameForNic || 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Name Per CNIC</span>
              <span className="font-medium">
                {businessProfile?.lastNameForNic || 'Not provided'}
              </span>
            </div>
          </div>
        </div>

        {/* Where do you want to get paid */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">Where do you want to get paid?</h2>
            <button
              type="button"
              onClick={() => handleChange(OnboardingStep.BANKING_DETAILS)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Account Owner/Title</span>
              <span className="font-medium">{billingInfo?.bankAccountOwner || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bank name</span>
              <span className="font-medium">{billingInfo?.bankName || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IBAN</span>
              <span className="font-medium">{billingInfo?.IBAN || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billing Address</span>
              <span className="max-w-md text-right font-medium">{formatBillingAddress()}</span>
            </div>
          </div>
        </div>

        {/* Partnership Package */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">Partnership Package</h2>
            <button
              type="button"
              onClick={() => handleChange(OnboardingStep.PARTNERSHIP_PACKAGE)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tariff</span>
              <span className="font-medium">
                {businessProfile?.partnershipPackage === 'tablet-plan'
                  ? 'Your Own Phone (Tablet + Godroid App)'
                  : 'Your Own Phone (Godroid App)'}
              </span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
            By ticking this box, I confirm that I am authorised by the Vendor to accept this
            Registration Form and the following{' '}
            <a href="/terms&conditions" className="text-purple-dark font-bold underline">
              Terms and Conditions
            </a>{' '}
            *
          </label>
        </div>
      </div>
      <EmailConfirmModal />
    </form>
  );
}
