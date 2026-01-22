'use client';

import type { StepHeaderProps } from '@/types/onboarding';
import { Button } from '@/components/ui/button';

export function StepHeader({
  phase,
  title,
  description,
  centered = false,
  showExamples = false,
  onViewExample,
}: StepHeaderProps) {
  return (
    <div className={`mb-6 ${centered ? 'text-center' : ''}`}>
      {phase && <p className="text-purple-dark mb-2 text-xl font-bold">{phase}</p>}
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-3 text-base font-semibold">
          <span>{description}</span>
          {showExamples && (
            <Button
              variant="link"
              type="button"
              className="text-purple-dark ml-1 p-0 text-base font-bold"
              onClick={onViewExample}
            >
              See example
            </Button>
          )}
        </p>
      )}
    </div>
  );
}
