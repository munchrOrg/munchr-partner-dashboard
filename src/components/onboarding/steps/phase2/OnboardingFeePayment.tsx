'use client';

import type { FileUpload } from '@/types/onboarding';
import { Copy, Plus } from 'lucide-react';

import { useState } from 'react';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboarding-store';

const PAYMENT_DETAILS = {
  accountName: 'Food for more',
  accountNumber: '0940310003232003',
  iban: 'PK66HA0A043100332200',
  amount: '10000 PKR',
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUpload: FileUpload = {
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
      };
      setFormData('onboardingFee', { paymentScreenshot: fileUpload });
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Pay one-time onboarding fee"
        description="on average, restaurant recoup this payment from 12 new order"
      />

      <div className="mt-8 space-y-6">
        {/* Step 1: Bank Details */}
        <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pay {PAYMENT_DETAILS.amount} from your bank
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Account name:</span>
              <span className="font-medium text-gray-900">{PAYMENT_DETAILS.accountName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Account number:</span>
              <span className="font-medium text-gray-900">{PAYMENT_DETAILS.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">IBAN:</span>
              <span className="font-medium text-gray-900">{PAYMENT_DETAILS.iban}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyIban}
            className="mt-4 gap-2"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy IBAN'}
          </Button>
        </div>

        {/* Step 2: Upload Screenshot */}
        <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upload a screenshot of your payment
            </h3>
          </div>

          <p className="mb-4 text-sm text-gray-600">
            Once you've paid, upload a screenshot here as proof.
          </p>

          <div>
            <p className="mb-2 block text-sm font-medium text-gray-700">Upload a screenshot*</p>

            {formData.onboardingFee?.paymentScreenshot ? (
              <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-4">
                <span className="text-sm text-gray-700">
                  {formData.onboardingFee.paymentScreenshot.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData('onboardingFee', { paymentScreenshot: null })}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-dashed border-gray-300 bg-white px-6 py-3 transition-colors hover:border-purple-400 hover:bg-purple-50">
                <Plus className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Upload a screenshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
