'use client';

import * as React from 'react';

type StepContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function StepContent({ children, className }: StepContentProps) {
  return <div className={className}>{children}</div>;
}
