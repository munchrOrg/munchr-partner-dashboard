'use client';

import Image from 'next/image';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useProfileSetupStore } from '@/stores/profile-setup-store';

export function ProfileSetupExampleDrawer() {
  const { isExampleDrawerOpen, closeExampleDrawer, exampleDrawerConfig } = useProfileSetupStore();

  if (!exampleDrawerConfig) {
    return null;
  }

  return (
    <Sheet open={isExampleDrawerOpen} onOpenChange={closeExampleDrawer}>
      <SheetContent side="right" className="min-w-lg overflow-y-auto p-3">
        <div className="relative mt-20 h-full">
          <div className="rounded-lg bg-white p-6">
            <div className="space-y-4">
              {exampleDrawerConfig.images.map((image) => (
                <div
                  key={image.src}
                  className={cn(
                    'relative overflow-hidden rounded-lg border border-[#00000026] bg-gray-50',
                    exampleDrawerConfig.imageContainerClass || 'aspect-4/3'
                  )}
                >
                  <Image src={image.src} alt={image.label} fill className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
