'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type StepContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function StepContent({ children, className }: StepContentProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
