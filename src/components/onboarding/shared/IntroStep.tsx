'use client';

import type { IconLib } from '@/lib/icon';
import type { IntroStepProps } from '@/types/onboarding';
import { Check } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

export function IntroStep({
  phaseLabel,
  title,
  description,
  items,
  illustrationName,
  illustrationClassName,
}: IntroStepProps) {
  return (
    <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
      <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1">
          {phaseLabel && <p className="mb-2 text-sm font-semibold text-purple-700">{phaseLabel}</p>}
          <h1 className="mb-4 text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mb-8 text-gray-600">{description}</p>

          {items && items.length > 0 && (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between border-b pb-4">
                  <div>
                    {item.completed !== undefined && (
                      <p className="text-sm font-semibold text-purple-700">
                        Step
                        {index + 1}
                      </p>
                    )}
                    <p className="text-gray-900">{item.label}</p>
                  </div>
                  {item.completed && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      <Check className="h-3 w-3" />
                      Completed
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {illustrationName && (
          <div className="flex justify-center lg:w-1/2">
            <Icon
              name={illustrationName as keyof typeof IconLib}
              className={illustrationClassName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
