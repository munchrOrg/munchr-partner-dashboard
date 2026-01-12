'use client';

import { ChevronDown } from 'lucide-react';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { PaymentMethod } from '@/types/onboarding';

const PAYMENT_OPTIONS = [
  { value: PaymentMethod.EASYPAISA, label: 'Easy Paisa' },
  { value: PaymentMethod.JAZZCASH, label: 'Jazz cash' },
  { value: PaymentMethod.MYPAY, label: 'Mypay' },
  { value: PaymentMethod.CARD, label: 'Pay via Master & Visa' },
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
              placeholder="Enter Card Holder Name"
              value={paymentData.accountTitle || ''}
              onChange={(e) => handleFieldChange('accountTitle', e.target.value)}
              className="h-12 rounded-full border-gray-300 px-4"
            />
          </div>
          <div>
            <Input
              placeholder="Enter Card Number"
              value={paymentData.cardNumber || ''}
              onChange={(e) => handleFieldChange('cardNumber', e.target.value)}
              className="h-12 rounded-full border-gray-300 px-4"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Expiry Date"
              value={paymentData.cardExpiry || ''}
              onChange={(e) => handleFieldChange('cardExpiry', e.target.value)}
              className="h-12 rounded-full border-gray-300 px-4"
            />
            <Input
              placeholder="CVV"
              type="password"
              value={paymentData.cardCvv || ''}
              onChange={(e) => handleFieldChange('cardCvv', e.target.value)}
              className="h-12 rounded-full border-gray-300 px-4"
            />
          </div>
          <Button
            type="button"
            className="bg-gray-light h-12 w-full rounded-full text-white hover:bg-gray-700"
          >
            Add Account
          </Button>
        </div>
      );
    }

    // Mobile wallet fields (Easypaisa, JazzCash, MyPay)
    return (
      <div className="mt-6 flex flex-col gap-4 space-y-4">
        <Input
          placeholder="Account Number"
          value={paymentData.accountNumber || ''}
          onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
          className="h-12 rounded-full border-gray-300 px-4"
        />
        <Button
          type="button"
          className="bg-gray-light h-12 w-full rounded-full text-white hover:bg-gray-700"
        >
          Add Account
        </Button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader title="Select Payment Method" centered={true} />

      <div className="mt-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-between rounded-full border-gray-300 px-4"
            >
              <span>
                {paymentData.method
                  ? PAYMENT_OPTIONS.find((opt) => opt.value === paymentData.method)?.label
                  : 'Select Payment Method'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
            align="start"
          >
            {PAYMENT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleMethodChange(option.value)}
                className="w-full"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {renderPaymentFields()}
      </div>
    </div>
  );
}
