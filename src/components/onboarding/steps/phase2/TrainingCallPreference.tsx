'use client';

import { ChevronDown, Clock, HelpCircle } from 'lucide-react';
import Image from 'next/image';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { NetworkProvider } from '@/types/onboarding';

const NETWORK_PROVIDERS = [
  { value: NetworkProvider.JAZZ, label: 'Jazz', image: '/jazz.png' },
  { value: NetworkProvider.TELENOR, label: 'Telenor', image: '/telenor.png' },
  { value: NetworkProvider.UFONE, label: 'Ufone', image: '/ufone.png' },
  { value: NetworkProvider.ZONG, label: 'Zong', image: '/zong.png' },
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
    <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Network & Training Call Preference"
        description="Please select your prefered mobile network and you convenient time for training call"
      />

      <div className="mt-10 space-y-6">
        {/* Network Provider Cards - 2x2 Grid */}
        <div className="grid max-w-md grid-cols-2 gap-4">
          {NETWORK_PROVIDERS.map((provider) => (
            <button
              key={provider.value}
              type="button"
              onClick={() => handleProviderSelect(provider.value)}
              className={cn(
                'relative flex h-28 items-center justify-center rounded-2xl border-2 bg-white p-4 transition-all hover:shadow-md sm:h-32',
                trainingData.networkProvider === provider.value
                  ? 'border-gray-400 shadow-sm'
                  : 'border-gray-200'
              )}
            >
              <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                <Image src={provider.image} alt={provider.label} fill className="object-contain" />
              </div>
            </button>
          ))}
        </div>

        {/* Network Provider Dropdown */}
        <div className="max-w-xl">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-light text-gray-light w-full justify-between rounded-full py-7 text-sm has-[>svg]:px-5"
              >
                {trainingData.networkProvider
                  ? NETWORK_PROVIDERS.find((p) => p.value === trainingData.networkProvider)?.label
                  : 'Select mobile network preference'}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {NETWORK_PROVIDERS.map((provider) => (
                <DropdownMenuItem
                  key={provider.value}
                  onClick={() => handleProviderSelect(provider.value)}
                >
                  {provider.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Book a Slot Section */}
        <div className="max-w-md">
          <h3 className="mb-2 text-xl font-bold">Book a Slot</h3>
          <p className="mb-4 text-base font-semibold">
            What time would be most convenient for you to receive the training call for device
            setup?
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Time Selection */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-gray-light w-full justify-between rounded-full border-gray-300 py-7 text-sm has-[>svg]:px-5"
                >
                  {trainingData.preferredTime || 'Select time*'}
                  <Clock className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {TIME_SLOTS.map((time) => (
                  <DropdownMenuItem
                    key={time}
                    onClick={() => handleFieldChange('preferredTime', time)}
                  >
                    {time}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Selection */}
            <Input
              type="date"
              value={trainingData.preferredDate}
              onChange={(e) => handleFieldChange('preferredDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              placeholder="Select date*"
              className="placeholder:text-gray-light w-full rounded-full border-gray-300 px-8 py-7 text-sm"
            />
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
