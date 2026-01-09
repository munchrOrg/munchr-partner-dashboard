'use client';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Icon } from '@/components/ui/icon';

const GROWTH_FEATURES = [
  {
    title: 'Marketing Support',
    description: 'Get featured in our promotional campaigns and reach more customers.',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track your orders, revenue, and customer insights in real-time.',
  },
  {
    title: 'Customer Reviews',
    description: 'Build your reputation with customer ratings and reviews.',
  },
  {
    title: 'Loyalty Programs',
    description: 'Engage customers with rewards and special offers.',
  },
];

export function GrowthInformation() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1">
          <StepHeader
            title="Grow your business with munchr"
            description="Discover tools and features designed to help your restaurant succeed."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {GROWTH_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:w-1/2">
          <Icon name="welcomeThumbnail" className="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
      </div>
    </div>
  );
}
