'use client';

import { HelpCircle } from 'lucide-react';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { NetworkProvider } from '@/types/onboarding';

const NETWORK_PROVIDERS = [
  { value: NetworkProvider.JAZZ, label: 'Jazz', color: 'bg-red-500' },
  { value: NetworkProvider.TELENOR, label: 'Telenor', color: 'bg-blue-500' },
  { value: NetworkProvider.UFONE, label: 'Ufone', color: 'bg-red-600' },
  { value: NetworkProvider.ZONG, label: 'Zong', color: 'bg-green-500' },
];

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

export function TrainingCallPreference() {
  const { formData, setFormData } = useOnboardingStore();

  const trainingData = formData.trainingCall || {
    networkProvider: null,
    preferredDate: '',
    preferredTime: '',
  };

  const handleProviderSelect = (provider: NetworkProvider) => {
    setFormData('trainingCall', {
      ...trainingData,
      networkProvider: provider,
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData('trainingCall', {
      ...trainingData,
      [field]: value,
    });
  };

  return (
    <div className="relative mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Network & Training Call Preference"
        description="Please select your prefered mobile network and you convenient time for training call"
      />

      <div className="mt-8 space-y-8">
        {/* Network Provider Selection */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {NETWORK_PROVIDERS.map((provider) => (
            <button
              key={provider.value}
              type="button"
              onClick={() => handleProviderSelect(provider.value)}
              className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-xl border-2 bg-white p-6 transition-all hover:shadow-md',
                trainingData.networkProvider === provider.value
                  ? 'border-purple-600 shadow-md'
                  : 'border-gray-200'
              )}
            >
              <div
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full',
                  provider.color
                )}
              />
              <span className="text-sm font-medium text-gray-900">{provider.label}</span>
            </button>
          ))}
        </div>

        {/* Dropdown for mobile network (optional redundant field) */}
        <div>
          <Select
            value={trainingData.networkProvider || ''}
            onValueChange={(value) => handleProviderSelect(value as NetworkProvider)}
          >
            <SelectTrigger className="h-12 rounded-full border-gray-300">
              <SelectValue placeholder="Select mobile network preference" />
            </SelectTrigger>
            <SelectContent>
              {NETWORK_PROVIDERS.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Book a Slot Section */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Book a Slot</h3>
          <p className="mb-4 text-sm text-gray-600">
            What time would be most convenient for you to receive the training call for device
            setup?
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Time Selection */}
            <div>
              <Select
                value={trainingData.preferredTime}
                onValueChange={(value) => handleFieldChange('preferredTime', value)}
              >
                <SelectTrigger className="h-12 rounded-full border-gray-300">
                  <SelectValue placeholder="Select time*" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div>
              <Input
                type="date"
                value={trainingData.preferredDate}
                onChange={(e) => handleFieldChange('preferredDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                placeholder="Select date*"
                className="h-12 rounded-full border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Help Button */}
      <Button
        type="button"
        size="icon"
        className="fixed right-8 bottom-8 h-14 w-14 rounded-full bg-gray-800 shadow-lg hover:bg-gray-700"
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}
