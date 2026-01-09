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
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16">
      <div className="w-full max-w-2xl lg:max-w-none lg:shrink-0">
        {phaseLabel && <p className="text-purple-dark mb-2 text-xl font-bold">{phaseLabel}</p>}
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mb-8 max-w-[80%] font-medium">{description}</p>

        {items && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between border-b pb-4">
                <div>
                  {item.completed !== undefined && (
                    <p className="text-purple-dark text-lg font-semibold">
                      Step
                      {index + 1}
                    </p>
                  )}
                  <p className="text-sm font-medium">{item.label}</p>
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
        <div className="flex w-full items-center justify-center lg:w-auto lg:shrink-0">
          <Icon name={illustrationName as keyof typeof IconLib} className={illustrationClassName} />
        </div>
      )}
    </div>
  );
}
