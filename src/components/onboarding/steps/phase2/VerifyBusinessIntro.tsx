'use client';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Icon } from '@/components/ui/icon';

const REQUIREMENTS = [
  'Upload your dine-in menu',
  'Schedule a training call',
  'Pay the one-time onboarding fee',
  'Set up your partner portal',
];

export function VerifyBusinessIntro() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1">
          <StepHeader
            phase="Step 2"
            title="Verify your business"
            description="Complete the verification process to start receiving orders on munchr."
          />

          <div className="mt-6">
            <p className="mb-4 font-medium text-gray-900">What's next</p>
            <ul className="space-y-3">
              {REQUIREMENTS.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center lg:w-1/2">
          <Icon name="welcomeThumbnail" className="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
      </div>
    </div>
  );
}
