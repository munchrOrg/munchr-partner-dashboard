'use client';

import { useState } from 'react';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function BusinessInfoReview() {
  const { formData } = useOnboardingStore();
  const [confirmed, setConfirmed] = useState(false);

  const location = formData.location;
  const banking = formData.banking;
  const legalTax = formData.legalTax;
  const selectedPackage = formData.package;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Make sure everything is correct"
        description="Please review your information before proceeding."
      />

      <div className="mt-6 space-y-6">
        {/* Business Location */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-medium text-gray-900">Business Location</h3>
          {location ? (
            <div className="text-sm text-gray-600">
              <p>{location.buildingName}</p>
              <p>
                {location.houseNumber} {location.street}
              </p>
              <p>
                {location.area && `${location.area}, `}
                {location.city}
              </p>
              <p>
                {location.state}, {location.postalCode}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Not provided</p>
          )}
        </div>

        {/* Banking Details */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-medium text-gray-900">Banking Details</h3>
          {banking ? (
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Bank:</span> {banking.bankName}
              </p>
              <p>
                <span className="font-medium">Account:</span> {banking.accountTitle}
              </p>
              <p>
                <span className="font-medium">IBAN:</span> {banking.iban}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Not provided</p>
          )}
        </div>

        {/* Legal & Tax */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-medium text-gray-900">Legal & Tax Details</h3>
          {legalTax ? (
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Registration #:</span>{' '}
                {legalTax.businessRegistrationNumber}
              </p>
              <p>
                <span className="font-medium">NTN:</span> {legalTax.ntnNumber}
              </p>
              {legalTax.stnNumber && (
                <p>
                  <span className="font-medium">STN:</span> {legalTax.stnNumber}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Not provided</p>
          )}
        </div>

        {/* Selected Package */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-medium text-gray-900">Selected Package</h3>
          {selectedPackage ? (
            <p className="text-sm text-gray-600 capitalize">
              {selectedPackage.selectedPackageId} Package
            </p>
          ) : (
            <p className="text-sm text-gray-400">Not selected</p>
          )}
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-4">
          <Checkbox
            id="confirm"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
          />
          <Label htmlFor="confirm" className="cursor-pointer text-sm text-gray-700">
            I confirm that all the information provided above is correct and accurate. I understand
            that providing false information may result in account suspension.
          </Label>
        </div>
      </div>
    </div>
  );
}
