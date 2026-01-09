'use client';

import type { FileUpload } from '@/types/onboarding';
import { Check, Copy } from 'lucide-react';

import { useState } from 'react';
import { FileUploadBox } from '@/components/onboarding/shared/FileUploadBox';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboarding-store';

const PAYMENT_DETAILS = {
  bankName: 'Meezan Bank',
  accountTitle: 'Munchr Technologies (Pvt) Ltd',
  iban: 'PK36MEZN0001234567890123',
  amount: 'PKR 25,000',
};

export function OnboardingFeePayment() {
  const { formData, setFormData } = useOnboardingStore();
  const [copied, setCopied] = useState(false);

  const handleCopyIban = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_DETAILS.iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IBAN:', err);
    }
  };

  const handleFileChange = (file: FileUpload | null) => {
    setFormData('onboardingFee', { paymentScreenshot: file });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Pay onboarding fee"
        description="Transfer the one-time onboarding fee to complete your registration."
      />

      <div className="mt-6 space-y-6">
        {/* Payment Amount */}
        <div className="rounded-lg bg-purple-50 p-4 text-center">
          <p className="text-sm text-purple-700">One-time onboarding fee</p>
          <p className="mt-1 text-3xl font-bold text-purple-900">{PAYMENT_DETAILS.amount}</p>
        </div>

        {/* Bank Details */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-medium text-gray-900">Bank Transfer Details</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Name</span>
              <span className="font-medium text-gray-900">{PAYMENT_DETAILS.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Title</span>
              <span className="font-medium text-gray-900">{PAYMENT_DETAILS.accountTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">IBAN</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium text-gray-900">{PAYMENT_DETAILS.iban}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyIban}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot Upload */}
        <div>
          <p className="mb-3 font-medium text-gray-900">Upload payment screenshot</p>
          <FileUploadBox
            label="Payment Screenshot"
            value={formData.onboardingFee?.paymentScreenshot || null}
            onChange={handleFileChange}
            acceptedFormats=".jpg,.jpeg,.png"
          />
          <p className="mt-2 text-xs text-gray-500">
            Please upload a clear screenshot of your payment confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
