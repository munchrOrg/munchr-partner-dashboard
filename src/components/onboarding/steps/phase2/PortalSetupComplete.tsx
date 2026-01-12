'use client';

import { Icon } from '@/components/ui/icon';
import { useOnboardingStore } from '@/stores/onboarding-store';

const NEXT_STEPS = [
  "Open the email and Click 'Create Password'",
  'Set your Partner Portal password',
  'Add opening hours, Menu and dish photos',
];

export function PortalSetupComplete() {
  const { formData } = useOnboardingStore();

  // Get email from business info or use a placeholder
  const email = formData.businessInfo?.email || 'your@email.com';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        {/* Content */}
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-sm font-medium text-purple-600">Next Step!</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Setup your Partner Portal account
            </h1>
          </div>

          <p className="mb-8 text-gray-700">
            We've sent an email to set up your Partner Portal Account at{' '}
            <span className="font-semibold text-purple-600">{email}</span>
          </p>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">What to do next:</h3>
            <ul className="space-y-4">
              {NEXT_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <span className="pt-1 text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex justify-center lg:w-5/12">
          <Icon name="welcomeThumbnail" className="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
      </div>
    </div>
  );
}
