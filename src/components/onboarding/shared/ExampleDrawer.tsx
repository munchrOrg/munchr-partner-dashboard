'use client';

import Image from 'next/image';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useOnboardingStore } from '@/stores/onboarding-store';

export function ExampleDrawer() {
  const { isExampleDrawerOpen, closeExampleDrawer, exampleDrawerConfig } = useOnboardingStore();

  if (!exampleDrawerConfig) {
    return null;
  }

  return (
    <Sheet open={isExampleDrawerOpen} onOpenChange={closeExampleDrawer}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>{exampleDrawerConfig.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          <p className="text-sm text-gray-600">
            Please upload clear photos as shown in the examples below:
          </p>

          <div className="space-y-4">
            {exampleDrawerConfig.images.map((image) => (
              <div key={image.src} className="rounded-lg border p-4">
                <h3 className="mb-3 font-medium">{image.label}</h3>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <Image src={image.src} alt={image.label} fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
