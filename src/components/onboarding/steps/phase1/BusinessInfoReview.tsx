'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Checkbox } from '@/components/ui/checkbox';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSignupStore } from '@/stores/signup-store';
import { OnboardingStep } from '@/types/onboarding';

export function BusinessInfoReview() {
  const router = useRouter();
  const { formData, profile } = useOnboardingStore();
  const { formData: signupData } = useSignupStore();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const businessProfile = profile?.partner?.businessProfile;

  const handleChange = (step: OnboardingStep) => {
    router.push(`/onboarding/${step}`);
  };

  // Helper to format address from location data
  const formatAddress = () => {
    const loc: any = formData.location || {};

    const buildingPlaceName = loc.buildingPlaceName || businessProfile?.buildingName || '';
    const street = loc.street || businessProfile?.street || '';
    const houseNumber = loc.houseNumber || businessProfile?.houseNumber || '';
    const postalCode = loc.postalCode || businessProfile?.postalCode || '';
    const city = loc.city || businessProfile?.city || '';
    const state = loc.state || businessProfile?.state || '';

    const parts = [buildingPlaceName, street, houseNumber, postalCode, city, state].filter(Boolean);

    return parts.length ? parts.join(', ') : 'Not provided';
  };

  const formatBillingAddress = () => {
    const billing: any = formData.banking || {};
    const buildingName =
      billing.buildingName || businessProfile?.billingInfo?.billingBuildingPlaceName || '';
    const street = billing.street || businessProfile?.billingInfo?.billingStreet || '';
    const houseNumber =
      billing.houseNumber || businessProfile?.billingInfo?.billingHouseNumber || '';
    const billingState = billing.billingState || businessProfile?.billingInfo?.billingState || '';
    const billingCity = billing.billingCity || businessProfile?.billingInfo?.billingCity || '';
    const area = billing.area || businessProfile?.billingInfo?.billingArea || '';
    const postalCode =
      billing.billingPostalCode || businessProfile?.billingInfo?.billingPostalCode || '';
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
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
              onClick={() => handleChange(OnboardingStep.ADD_BUSINESS_INTRO)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Business name</span>
              <span className="font-medium">
                {signupData.businessName ||
                  formData.businessInfo?.businessName ||
                  profile?.partner?.businessName ||
                  'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business type</span>
              <span className="font-medium capitalize">
                {(signupData.serviceProviderType ||
                  formData.businessInfo?.serviceProviderType ||
                  profile?.partner?.serviceProviderType) === 'restaurant'
                  ? 'Restaurant'
                  : (signupData.serviceProviderType ||
                        formData.businessInfo?.serviceProviderType ||
                        profile?.partner?.serviceProviderType) === 'home-chef'
                    ? 'Home Chef'
                    : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business category</span>
              <span className="font-medium">
                {(signupData.serviceProviderType ||
                  formData.businessInfo?.serviceProviderType ||
                  profile?.partner?.serviceProviderType) === 'home-chef'
                  ? 'Home Based Kitchen'
                  : (signupData.serviceProviderType ||
                        formData.businessInfo?.serviceProviderType ||
                        profile?.partner?.serviceProviderType) === 'restaurant'
                    ? 'Restaurant'
                    : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business cuisine</span>
              <span className="font-medium">
                {signupData.cuisines?.length
                  ? signupData.cuisines.join(', ')
                  : formData.businessInfo?.cuisines?.length
                    ? formData.businessInfo.cuisines.join(', ')
                    : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile phone number</span>
              <span className="font-medium">
                {signupData.phoneNumber ||
                  formData.businessInfo?.phoneNumber ||
                  profile?.partner?.phone ||
                  'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business phone number</span>
              <span className="font-medium">
                {signupData.phoneNumber ||
                  formData.businessInfo?.phoneNumber ||
                  profile?.partner?.phone ||
                  'Not provided'}
              </span>
            </div>
          </div>
        </div>

        {/* Where is your business located */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">Where is your business located?</h2>
            <button
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
              <span className="font-medium">
                {businessProfile?.sntn || formData.ownerIdentity?.hasSNTN ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Add your legal and tax details */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">Add your legal and tax details</h2>
            <button
              onClick={() => handleChange(OnboardingStep.LEGAL_TAX_DETAILS)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">CNIC Number</span>
              <span className="font-medium">
                {formData.legalTax?.cnicNumber || businessProfile?.cnicNumber || 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">First & Middle Name Per CNIC</span>
              <span className="font-medium">
                {formData.legalTax?.firstAndMiddleNameForNic ||
                  businessProfile?.firstAndMiddleNameForNic ||
                  'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Name Per CNIC</span>
              <span className="font-medium">
                {formData.legalTax?.lastNameForNic ||
                  businessProfile?.lastNameForNic ||
                  'Not provided'}
              </span>
            </div>
          </div>
        </div>

        {/* Where do you want to get paid */}
        <div>
          <div className="mb-4 flex items-center justify-between border-t pt-4">
            <h2 className="text-xl font-bold">Where do you want to get paid?</h2>
            <button
              onClick={() => handleChange(OnboardingStep.BANKING_DETAILS)}
              className="text-purple-dark text-base font-bold hover:underline"
            >
              Change
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Account Owner/Title</span>
              <span className="font-medium">
                {formData.banking?.accountTitle ||
                  businessProfile?.billingInfo?.bankAccountOwner ||
                  'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bank name</span>
              <span className="font-medium">
                {formData.banking?.bankName ||
                  businessProfile?.billingInfo?.bankName ||
                  'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IBAN</span>
              <span className="font-medium">
                {formData.banking?.iban || businessProfile?.billingInfo?.IBAN || 'Not provided'}
              </span>
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
                {formData.package?.selectedPackageId === 'tablet-plan'
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
    </div>
  );
}
