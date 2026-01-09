'use client';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Icon } from '@/components/ui/icon';

const REQUIREMENTS = [
  'Details of your business',
  'Location of your business',
  'Legal and Sales Tax details',
  'Banking Details',
  'Choose the best plan for your business',
];

export function AddBusinessIntro() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1">
          <StepHeader
            phase="Step 1"
            title="Add your business"
            description="Add your business information so we can create your contract and you can start earning more."
          />

          <div className="mt-6">
            <p className="mb-4 text-lg font-bold">What do we need from you</p>
            <ul className="ml-3 space-y-5">
              {REQUIREMENTS.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                  <span className="text-base font-medium">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end lg:w-1/2">
          <Icon name="developerThumbnail" className="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
      </div>
    </div>
  );
}
