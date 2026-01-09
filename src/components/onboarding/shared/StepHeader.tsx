'use client';

import type { StepHeaderProps } from '@/types/onboarding';

export function StepHeader({ phase, title, description }: StepHeaderProps) {
  return (
    <div className="mb-6">
      {phase && <p className="mb-2 text-sm font-semibold text-purple-700">{phase}</p>}
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{title}</h1>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
}
