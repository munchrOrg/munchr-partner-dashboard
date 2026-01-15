'use client';

import * as React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepperProps = Readonly<{
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  className?: string;
}>;

export function Stepper({ currentStep, totalSteps, onStepClick, className }: StepperProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isClickable = onStepClick && (isCompleted || isActive);

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step)}
                disabled={!isClickable}
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border-2 transition-all',
                  isCompleted &&
                    'border-primary bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer',
                  isActive &&
                    !isCompleted &&
                    'border-primary bg-background text-primary ring-primary/20 ring-4',
                  !isActive && !isCompleted && 'bg-background border-gray-300 text-gray-400',
                  !isClickable && 'cursor-not-allowed'
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="size-5" />
                ) : (
                  <span className="text-sm font-semibold">{step}</span>
                )}
              </button>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                Step {step}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'mx-4 h-0.5 flex-1 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-gray-300'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
