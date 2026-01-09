'use client';

import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Icon } from '@/components/ui/icon';

const FINAL_STEPS = ['Set your business hours', 'Review and go live'];

export function OpenBusinessIntro() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1">
          <StepHeader
            phase="Final Step"
            title="Open your business"
            description="You're almost there! Complete the final setup to start receiving orders."
          />

          <div className="mt-6">
            <p className="mb-4 font-medium text-gray-900">Last steps to go live</p>
            <ul className="space-y-3">
              {FINAL_STEPS.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-lg bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Once you complete this step, your restaurant will be visible to customers on munchr.
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:w-1/2">
          <Icon name="welcomeThumbnail" className="h-64 w-64 sm:h-80 sm:w-80" />
        </div>
      </div>
    </div>
  );
}
