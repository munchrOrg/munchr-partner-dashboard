'use client';

import type { FileUpload } from '@/types/onboarding';
import { Copy, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { useOnboardingStore } from '@/stores/onboarding-store';

const PAYMENT_DETAILS = {
  accountName: 'Food for more',
  accountNumber: '0940310003232003',
  iban: 'PK66HA0A043100332200',
  amount: '10000 PKR',
};

export function OnboardingFeePayment() {
  const { formData, setFormData, profile } = useOnboardingStore();
  const businessProfile = profile?.partner?.businessProfile;
  const [copied, setCopied] = useState(false);
  const [paymentTransactionId, setPaymentTransactionId] = useState('');
  const fileUploadRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (businessProfile && !formData.onboardingFee) {
      const onboardingFeeData = {
        paymentTransactionId: businessProfile.paymentTransactionId || '',
        paymentScreenshot: businessProfile.uploadScreenshotImage
          ? {
              name: businessProfile.uploadScreenshotImage.fileName || 'Unknown',
              size: businessProfile.uploadScreenshotImage.size || 0,
              url: businessProfile.uploadScreenshotImage.url || '',
            }
          : null,
      };
      setFormData('onboardingFee', onboardingFeeData);
      setTimeout(() => {
        setPaymentTransactionId(onboardingFeeData.paymentTransactionId);
      }, 0);
    }
  }, [businessProfile, formData.onboardingFee, setFormData]);

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

    // Step 1: Get upload URL and key from backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    const res = await fetch(`${backendUrl}storage/public/upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        assetType: 'logo',
      }),
    });
    if (!res.ok) {
      console.error('Failed to get upload URL');
      return;
    }
    const { key, uploadUrl } = await res.json();
    console.log('Upload API response:', { key, uploadUrl });

    // Step 2: Upload file to storage
    try {
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!uploadRes.ok) {
        console.warn('File upload failed (likely CORS):', uploadRes.statusText);
        // For development, ignore CORS error and proceed
      }
    } catch (err) {
      console.warn('File upload error (likely CORS):', err);
      // For development, ignore CORS error and proceed
    }

    // Step 3: Save key and public URL in FileUpload object
    const fileUpload: FileUpload = {
      name: file.name,
      url: `https://pub-xxx.r2.dev/${key}`,
      size: file.size,
      key,
    };
    setFormData('onboardingFee', {
      paymentScreenshot: fileUpload,
      paymentTransactionId,
    });
  };

  // const removeScreenshot = () => {
  //   setFormData('onboardingFee', {
  //     paymentScreenshot: null,
  //     paymentTransactionId: paymentTransactionId,
  //   });
  // };

  // const handleTransactionIdChange = (value: string) => {
  //   setPaymentTransactionId(value);
  //   setFormData('onboardingFee', {
  //     paymentScreenshot: formData.onboardingFee?.paymentScreenshot || null,
  //     paymentTransactionId: value,
  //   });
  // };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
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

            {formData.onboardingFee?.paymentScreenshot ? (
              <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-4">
                <span className="text-gray-light text-base font-semibold">
                  {formData.onboardingFee.paymentScreenshot.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  role="button"
                  onClick={() =>
                    setFormData('onboardingFee', { paymentScreenshot: null, paymentTransactionId })
                  }
                >
                  Remove
                </Button>
              </div>
            ) : (
              <HoverBorderGradient
                containerClassName="rounded-full w-fit"
                as="button"
                onClick={() => fileUploadRef.current?.click()}
                className="text-purple-dark flex min-w-xs cursor-pointer items-center space-x-2 bg-white"
              >
                <Plus className="size-6" />
                <input
                  ref={fileUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="cursor-pointer text-inherit">Upload a screenshot</span>
              </HoverBorderGradient>
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              value={paymentTransactionId}
              onChange={(e) => {
                const value = e.target.value;
                setPaymentTransactionId(value);
                setFormData('onboardingFee', {
                  paymentScreenshot: formData.onboardingFee?.paymentScreenshot || null,
                  paymentTransactionId: value,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
