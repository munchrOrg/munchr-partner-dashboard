'use client';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { PaymentMethod } from '@/types/onboarding';

const PAYMENT_OPTIONS = [
  { value: PaymentMethod.EASYPAISA, label: 'Easypaisa' },
  { value: PaymentMethod.JAZZCASH, label: 'JazzCash' },
  { value: PaymentMethod.MYPAY, label: 'MyPay' },
  { value: PaymentMethod.CARD, label: 'Visa/MasterCard' },
];

export function PaymentMethodSelection() {
  const { formData, setFormData } = useOnboardingStore();

  const paymentData = formData.paymentMethod || {
    method: null,
    accountNumber: '',
    accountTitle: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  };

  const handleMethodChange = (value: string) => {
    setFormData('paymentMethod', {
      ...paymentData,
      method: value as PaymentMethod,
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData('paymentMethod', {
      ...paymentData,
      [field]: value,
    });
  };

  const renderPaymentFields = () => {
    if (!paymentData.method) {
      return null;
    }

    if (paymentData.method === PaymentMethod.CARD) {
      return (
        <div className="mt-6 space-y-4">
          <div>
            <Input
              placeholder="Card Number *"
              value={paymentData.cardNumber || ''}
              onChange={(e) => handleFieldChange('cardNumber', e.target.value)}
              className="h-12 rounded-full border-gray-300 px-4"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="MM/YY *"
              value={paymentData.cardExpiry || ''}
              onChange={(e) => handleFieldChange('cardExpiry', e.target.value)}
              className="h-12 rounded-full border-gray-300 px-4"
            />
            <Input
              placeholder="CVV *"
              type="password"
              value={paymentData.cardCvv || ''}
              onChange={(e) => handleFieldChange('cardCvv', e.target.value)}
              className="h-12 rounded-full border-gray-300 px-4"
            />
          </div>
        </div>
      );
    }

    // Mobile wallet fields (Easypaisa, JazzCash, MyPay)
    return (
      <div className="mt-6 space-y-4">
        <div>
          <Input
            placeholder="Account Title *"
            value={paymentData.accountTitle || ''}
            onChange={(e) => handleFieldChange('accountTitle', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
        </div>
        <div>
          <Input
            placeholder="Account/Mobile Number *"
            value={paymentData.accountNumber || ''}
            onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
            className="h-12 rounded-full border-gray-300 px-4"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Select payment method"
        description="Choose how you want to receive your payments."
      />

      <div className="mt-6">
        <Select value={paymentData.method || undefined} onValueChange={handleMethodChange}>
          <SelectTrigger className="h-12 rounded-full border-gray-300 px-4">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {renderPaymentFields()}
      </div>
    </div>
  );
}
