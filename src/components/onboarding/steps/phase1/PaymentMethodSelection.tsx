'use client';

import type { PaymentMethodFormData, SavedPaymentAccount } from '@/types/onboarding';
import type { PaymentFormInput } from '@/validations/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useUpdateProfile } from '@/react-query/auth/mutations';
import { useProfile } from '@/react-query/auth/queries';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingStep, PaymentMethod } from '@/types/onboarding';
import { paymentFormSchema } from '@/validations/payment';

const PAYMENT_OPTIONS = [
  { value: PaymentMethod.EASYPAISA, label: 'Easy Paisa' },
  { value: PaymentMethod.JAZZCASH, label: 'Jazz Cash' },
  { value: PaymentMethod.MYPAY, label: 'Mypay' },
  { value: PaymentMethod.CARD, label: 'Pay via Master & Visa' },
];

const getMethodLabel = (method: PaymentMethod) => {
  return PAYMENT_OPTIONS.find((opt) => opt.value === method)?.label || method;
};

const maskAccountNumber = (number: string) => {
  if (number.length <= 4) {
    return number;
  }
  return `••••${number.slice(-4)}`;
};

const maskCardNumber = (number: string) => {
  if (number.length <= 4) {
    return number;
  }
  return `•••• •••• •••• ${number.slice(-4)}`;
};

export function PaymentMethodSelection() {
  const { data: profile } = useProfile();
  const { triggerNavigation } = useOnboardingStore();
  const updateProfileMutation = useUpdateProfile();
  const businessProfile = profile?.partner?.businessProfile?.billingInfo;

  const prefilledAccount: SavedPaymentAccount | null = businessProfile?.paymentMethodType
    ? {
        id: 'business-prefilled',
        method: businessProfile.paymentMethodType,
        ...(businessProfile.paymentMethodType === PaymentMethod.CARD
          ? {
              accountTitle: businessProfile.accountTitle || '',
              cardNumber: businessProfile.cardNumber || '',
              cardExpiry: businessProfile.cardExpiry || '',
            }
          : {
              accountNumber: businessProfile.paymentAccountNumber || '',
            }),
      }
    : null;

  const [paymentData, setPaymentData] = useState<PaymentMethodFormData>(() => ({
    savedAccounts: prefilledAccount ? [prefilledAccount] : [],
    selectedAccountId: prefilledAccount?.id || null,
  }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<PaymentFormInput>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      selectedMethod: prefilledAccount?.method || null,
      accountNumber: prefilledAccount?.accountNumber || '',
      accountTitle: prefilledAccount?.accountTitle || '',
      cardNumber: prefilledAccount?.cardNumber || '',
      cardExpiry: prefilledAccount?.cardExpiry || '',
      cardCvv: '',
    },
    mode: 'onChange',
  });

  const selectedMethod = useWatch({ control, name: 'selectedMethod' });
  const accountTitle = useWatch({ control, name: 'accountTitle' });
  const cardNumber = useWatch({ control, name: 'cardNumber' });
  const cardExpiry = useWatch({ control, name: 'cardExpiry' });
  const cardCvv = useWatch({ control, name: 'cardCvv' });
  const accountNumber = useWatch({ control, name: 'accountNumber' });

  const handleAddAccount = handleSubmit((data) => {
    if (!data.selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (paymentData.savedAccounts.length > 0) {
      toast.error('You can only add one payment method');
      return;
    }

    const newAccount: SavedPaymentAccount = {
      id: crypto.randomUUID(),
      method: data.selectedMethod,
      ...(data.selectedMethod === PaymentMethod.CARD
        ? {
            accountTitle: data.accountTitle || '',
            cardNumber: data.cardNumber || '',
            cardExpiry: data.cardExpiry || '',
          }
        : { accountNumber: data.accountNumber || '' }),
    };

    setPaymentData({
      savedAccounts: [newAccount],
      selectedAccountId: newAccount.id,
    });

    toast.success('Payment method added');
    reset();
  });

  const handleRemoveAccount = () => {
    setPaymentData({
      savedAccounts: [],
      selectedAccountId: null,
    });
    toast.success('Payment method removed');
  };

  const handleSelectAccount = (accountId: string) => {
    setPaymentData({
      ...paymentData,
      selectedAccountId: accountId,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentData.savedAccounts?.length) {
      toast.error('Please add a payment method before continuing.');
      return;
    }
    if (!paymentData.selectedAccountId) {
      toast.error('Please select a payment method before continuing.');
      return;
    }

    try {
      const selected = paymentData.savedAccounts.find(
        (acc) => acc.id === paymentData.selectedAccountId
      );
      if (selected) {
        await updateProfileMutation.mutateAsync({
          currentStep: OnboardingStep.PAYMENT_METHOD_SELECTION,
          paymentMethod: {
            paymentMethod: selected.method,
            accountNumber: selected.accountNumber,
          },
        });
      }

      triggerNavigation(OnboardingStep.PAYMENT_METHOD_SELECTION);
    } catch (error) {
      console.error('Failed to save payment method:', error);
      toast.error('Failed to save data. Please try again.');
    }
  };

  const renderPaymentFields = () => {
    if (!selectedMethod) {
      return null;
    }

    const isFormValid =
      selectedMethod === PaymentMethod.CARD
        ? isValid && accountTitle && cardNumber && cardExpiry && cardCvv
        : isValid && accountNumber;

    if (selectedMethod === PaymentMethod.CARD) {
      return (
        <div className="mt-6 space-y-4">
          <div>
            <Input
              placeholder="Enter Card Holder Name"
              {...register('accountTitle')}
              className={`h-12 rounded-full border-gray-300 px-4 ${
                errors.accountTitle ? 'border-red-500' : ''
              }`}
              onBlur={() => trigger('accountTitle')}
            />
            {errors.accountTitle && (
              <p className="mt-1 text-sm text-red-500">{errors.accountTitle.message}</p>
            )}
          </div>
          <div>
            <Input
              placeholder="Enter Card Number"
              {...register('cardNumber')}
              className={`h-12 rounded-full border-gray-300 px-4 ${
                errors.cardNumber ? 'border-red-500' : ''
              }`}
              onBlur={() => trigger('cardNumber')}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.cardNumber.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="MM/YY"
                {...register('cardExpiry')}
                className={`h-12 rounded-full border-gray-300 px-4 ${
                  errors.cardExpiry ? 'border-red-500' : ''
                }`}
                onBlur={() => trigger('cardExpiry')}
              />
              {errors.cardExpiry && (
                <p className="mt-1 text-sm text-red-500">{errors.cardExpiry.message}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="CVV"
                type="password"
                {...register('cardCvv')}
                className={`h-12 rounded-full border-gray-300 px-4 ${
                  errors.cardCvv ? 'border-red-500' : ''
                }`}
                onBlur={() => trigger('cardCvv')}
              />
              {errors.cardCvv && (
                <p className="mt-1 text-sm text-red-500">{errors.cardCvv.message}</p>
              )}
            </div>
          </div>
          {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
          <Button
            type="button"
            onClick={handleAddAccount}
            disabled={!isFormValid}
            className={`h-12 w-full rounded-full text-white transition-colors ${
              isFormValid ? 'bg-gray-800 hover:bg-gray-900' : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            Add Account
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-6 flex flex-col gap-4 space-y-4">
        <div>
          <Input
            placeholder="Account Number"
            {...register('accountNumber')}
            className={`h-12 rounded-full border-gray-300 px-4 ${
              errors.accountNumber ? 'border-red-500' : ''
            }`}
            onBlur={() => trigger('accountNumber')}
          />
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.accountNumber.message}</p>
          )}
        </div>
        {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
        <Button
          type="button"
          onClick={handleAddAccount}
          disabled={!isFormValid}
          className={`h-12 w-full rounded-full text-white transition-colors ${
            isFormValid ? 'bg-gray-800 hover:bg-gray-900' : 'cursor-not-allowed bg-gray-300'
          }`}
        >
          Add Account
        </Button>
      </div>
    );
  };

  const renderSavedAccounts = () => {
    const hasSavedAccount = paymentData.savedAccounts && paymentData.savedAccounts.length > 0;

    if (!hasSavedAccount) {
      return null;
    }

    return (
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>
        <div className="space-y-3">
          {paymentData.savedAccounts?.map((account) => (
            <div
              key={account.id}
              onClick={() => handleSelectAccount(account.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectAccount(account.id);
                }
              }}
              role="button"
              tabIndex={0}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                paymentData.selectedAccountId === account.id
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    paymentData.selectedAccountId === account.id
                      ? 'border-amber-400 bg-amber-400'
                      : 'border-gray-300'
                  }`}
                />
                <div>
                  <p className="font-medium">{getMethodLabel(account.method)}</p>
                  <p className="text-sm text-gray-500">
                    {account.method === PaymentMethod.CARD
                      ? `${account.accountTitle} - ${maskCardNumber(account.cardNumber || '')}`
                      : maskAccountNumber(account.accountNumber || '')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAccount();
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasSavedAccount = paymentData.savedAccounts && paymentData.savedAccounts.length > 0;

  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-xl px-4 py-8 sm:px-8"
    >
      <StepHeader title="Select Payment Method" />

      {renderSavedAccounts()}

      {!hasSavedAccount && (
        <div className="mt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full justify-between rounded-full border-gray-300 px-4"
              >
                <span>
                  {selectedMethod
                    ? PAYMENT_OPTIONS.find((opt) => opt.value === selectedMethod)?.label
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
                  onClick={() => {
                    setValue('selectedMethod', option.value);
                    // Reset form fields when method changes
                    reset({
                      selectedMethod: option.value,
                      accountNumber: '',
                      accountTitle: '',
                      cardNumber: '',
                      cardExpiry: '',
                      cardCvv: '',
                    });
                  }}
                  className="w-full"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {renderPaymentFields()}
        </div>
      )}
    </form>
  );
}
