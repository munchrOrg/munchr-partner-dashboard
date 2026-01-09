'use client';

import type { StepHeaderProps } from '@/types/onboarding';

export function StepHeader({ phase, title, description }: StepHeaderProps) {
  return (
    <div className="mb-6">
      {phase && <p className="text-purple-dark mb-2 text-xl font-bold">{phase}</p>}
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{title}</h1>
      {description && <p className="text-base font-medium">{description}</p>}
    </div>
  );
}
