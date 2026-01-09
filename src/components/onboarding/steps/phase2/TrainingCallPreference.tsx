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
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { NetworkProvider } from '@/types/onboarding';

const NETWORK_PROVIDERS = [
  { value: NetworkProvider.ZONG, label: 'Zong', color: 'bg-green-500' },
  { value: NetworkProvider.UFONE, label: 'Ufone', color: 'bg-orange-500' },
  { value: NetworkProvider.JAZZ, label: 'Jazz', color: 'bg-red-500' },
  { value: NetworkProvider.TELENOR, label: 'Telenor', color: 'bg-blue-500' },
];

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
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
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Network & Training Call Preference"
        description="Select your network provider and schedule a training call with our team."
      />

      <div className="mt-6 space-y-6">
        {/* Network Provider Selection */}
        <div>
          <p className="mb-3 font-medium text-gray-900">Select your network provider</p>
          <div className="grid grid-cols-4 gap-3">
            {NETWORK_PROVIDERS.map((provider) => (
              <button
                key={provider.value}
                type="button"
                onClick={() => handleProviderSelect(provider.value)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all',
                  trainingData.networkProvider === provider.value
                    ? 'border-purple-700 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className={cn('mb-2 h-10 w-10 rounded-full', provider.color)} />
                <span className="text-sm font-medium">{provider.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <p className="mb-3 font-medium text-gray-900">Preferred date</p>
          <Input
            type="date"
            value={trainingData.preferredDate}
            onChange={(e) => handleFieldChange('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="h-12 rounded-full border-gray-300 px-4"
          />
        </div>

        {/* Time Selection */}
        <div>
          <p className="mb-3 font-medium text-gray-900">Preferred time</p>
          <Select
            value={trainingData.preferredTime}
            onValueChange={(value) => handleFieldChange('preferredTime', value)}
          >
            <SelectTrigger className="h-12 rounded-full border-gray-300 px-4">
              <SelectValue placeholder="Select time slot" />
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
      </div>
    </div>
  );
}
