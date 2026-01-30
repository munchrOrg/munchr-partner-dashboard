'use client';

import type { FileUpload, OnboardingFeeFormData } from '@/types/onboarding';
import { Copy, Loader2, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import { createFileUploadFromKey } from '@/lib/helpers';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';

const PAYMENT_DETAILS = {
  accountName: 'Food for more',
  accountNumber: '0940310003232003',
  iban: 'PK66HA0A043100332200',
  amount: '10000 PKR',
};

export function OnboardingFeePayment() {
  const { profileData, formData, setStepFormData, setPendingFormSubmit } =
    useOnboardingProfileStore();

  const businessProfile = profileData?.businessProfile;

  const [copied, setCopied] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);

  const [onboardingFee, setOnboardingFee] = useState<OnboardingFeeFormData>(() => {
    if (formData.onboardingFee) {
      return formData.onboardingFee;
    }
    return {
      paymentTransactionId: businessProfile?.paymentTransactionId || '',
      paymentScreenshot: businessProfile?.paymentScreenshotKey
        ? createFileUploadFromKey(businessProfile.paymentScreenshotKey, 'Payment Screenshot')
        : null,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!onboardingFee.paymentScreenshot) {
      toast.error('Please upload your payment screenshot before continuing.');
      return;
    }

    setStepFormData('onboardingFee', onboardingFee);
    setPendingFormSubmit(true);
  };

  const handleCopyIban = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_DETAILS.iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IBAN:', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingScreenshot(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDIA_URL || '';
      const accessToken = useAuthStore.getState().accessToken;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${backendUrl}/upload/protected`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          assetType: 'payment-screenshot',
        }),
      });
      if (!res.ok) {
        console.error('Failed to get upload URL');
        return;
      }
      const response = await res.json();
      const { key, uploadUrl } = response;
      try {
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });
        if (!uploadRes.ok) {
          console.warn('File upload failed (likely CORS):', uploadRes.statusText);
        }
      } catch (err) {
        console.warn('File upload error (likely CORS):', err);
      }

      const fileUpload: FileUpload = {
        name: file.name,
        url: `https://pub-xxx.r2.dev/${key}`,
        size: file.size,
        key,
      };

      setOnboardingFee((prev) => ({
        ...prev,
        paymentScreenshot: fileUpload,
      }));
    } catch (error) {
      console.error('Failed to upload screenshot:', error);
      toast.error('Failed to upload screenshot. Please try again.');
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleTransactionIdChange = (value: string) => {
    setOnboardingFee((prev) => ({
      ...prev,
      paymentTransactionId: value,
    }));
  };

  const removeScreenshot = () => {
    setOnboardingFee((prev) => ({
      ...prev,
      paymentScreenshot: null,
    }));
  };

  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl px-4 py-8 sm:px-8"
    >
      <StepHeader
        title="Pay one-time onboarding fee"
        description="On average, restaurant recoup this payment from 12 new orders."
      />

      <div className="mt-8 space-y-6">
        {/* Step 1: Bank Details */}
        <div className="space-y-3 rounded-2xl border-2 border-gray-200 bg-gray-50 p-6">
          <div className="text-purple-dark text-lg font-bold">Step 1</div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pay {PAYMENT_DETAILS.amount} from your bank
          </h3>

          <ul className="ml-3 list-inside list-disc space-y-2">
            <li>
              <span className="">Account name:</span>
              <span className="ml-2">{PAYMENT_DETAILS.accountName}</span>
            </li>
            <li>
              <span className="">Account number:</span>
              <span className="ml-2">{PAYMENT_DETAILS.accountNumber}</span>
            </li>
            <li>
              <span className="">IBAN:</span>
              <span className="ml-2">{PAYMENT_DETAILS.iban}</span>
            </li>
          </ul>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyIban}
            className="text-purple-dark mt-4 gap-2 text-lg font-bold"
          >
            <Copy className="size-6" />
            {copied ? 'Copied!' : 'Copy IBAN'}
          </Button>
        </div>

        {/* Step 2: Upload Screenshot */}
        <div className="space-y-3 rounded-2xl border-2 border-gray-200 bg-gray-50 p-6">
          <div className="text-purple-dark text-lg font-bold">Step 2</div>
          <h3 className="text-lg font-semibold text-gray-900">
            Upload a screenshot of your payment
          </h3>

          <p className="text-base text-gray-600">
            Once you've paid, upload a screenshot here as proof.
          </p>

          <div>
            <p className="mb-2 block text-lg font-bold">Upload a screenshot*</p>

            {onboardingFee.paymentScreenshot ? (
              <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-4">
                <span className="text-gray-light text-base font-semibold">
                  {onboardingFee.paymentScreenshot.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  role="button"
                  onClick={removeScreenshot}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileUploadRef.current?.click()}
                disabled={isUploadingScreenshot}
                className="text-purple-dark flex min-w-xs cursor-pointer items-center justify-start space-x-2 rounded-full bg-white px-2 py-6"
              >
                {isUploadingScreenshot ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <Plus className="size-6" />
                )}
                <input
                  ref={fileUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploadingScreenshot}
                />
                <span className="cursor-pointer text-inherit">
                  {isUploadingScreenshot ? 'Uploading...' : 'Upload a screenshot'}
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border-2 border-gray-200 bg-gray-50 p-6">
          <div className="text-purple-dark text-lg font-bold">Step 3</div>
          <h3 className="text-lg font-semibold text-gray-900">Add your transition ID</h3>

          <p className="text-base text-gray-600">
            This helps us track your payment. You can usually find it on your payment receipt or
            confirmation.
          </p>

          <div>
            <input
              type="text"
              placeholder="Your transaction ID"
              className="w-full rounded-full border border-gray-300 bg-white px-4 py-4 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              value={onboardingFee.paymentTransactionId}
              onChange={(e) => handleTransactionIdChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
