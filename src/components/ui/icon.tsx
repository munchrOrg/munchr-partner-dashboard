import React from 'react';
import { IconLib } from '@/lib/icon';
import { cn } from '@/lib/utils';

type IconName = keyof typeof IconLib;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  const IconComponent = IconLib[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in IconLib`);
    return null;
  }

  return <IconComponent className={cn(className)} {...props} />;
}
