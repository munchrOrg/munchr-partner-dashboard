'use client';

import { CheckCircle } from 'lucide-react';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';

const PORTAL_FEATURES = [
  'Manage your menu and pricing',
  'View and accept incoming orders',
  'Track your earnings and payouts',
  'Access customer insights and analytics',
  'Update your business information',
];

export function PortalSetupComplete() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <div className="mt-6">
          <StepHeader
            title="Portal setup complete!"
            description="Your partner portal is ready. You can now access all features to manage your restaurant."
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 font-medium text-gray-900">What you can do now:</h3>
        <ul className="space-y-3">
          {PORTAL_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-lg bg-purple-50 p-4 text-center">
        <p className="text-sm text-purple-700">
          Continue to the final step to set your business hours and start receiving orders.
        </p>
      </div>
    </div>
  );
}
