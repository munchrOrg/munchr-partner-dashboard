'use client';

import { Check, Info } from 'lucide-react';

import { Icon } from '@/components/ui/icon';

const GROWTH_FEATURES = [
  'We look after order deliveries and handle the customer care too',
  'Access thousands of new customers using munchr and increase sales',
  'Accept and manage orders easily on your dedicated munchr device',
  'Track sales and performance to get insight into what your customers like',
];

export function GrowthInformation() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <div className="flex flex-col items-start gap-8">
        {/* Illustration */}
        <div className="flex w-full justify-center">
          <Icon name="growthIllustration" className="h-56 w-56 sm:h-64 sm:w-64" />
        </div>

        {/* Content */}
        <div className="w-full max-w-xl space-y-6">
          <div>
            <p className="text-purple-dark text-xl font-bold">Your final step</p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              Munchr helps your restaurant grow!
            </h1>
          </div>

          {/* Features List */}
          <ul className="space-y-4 text-left">
            {GROWTH_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Info Box */}
          <div className="bg-gray-light/10 flex items-start gap-3 rounded-lg p-4 text-left">
            <Info className="text-gray-light mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-gray-light text-sm">
              Join the 900+ restaurants who signed up tomunchr yesterday!
            </p>
          </div>

          {/* Footer Text */}
          <p className="text-lg font-semibold">All for a one-time onboarding fee of 10000 PKR</p>
        </div>
      </div>
    </div>
  );
}
