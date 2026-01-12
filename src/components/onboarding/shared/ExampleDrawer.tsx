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
      <SheetContent side="right" className="w-full overflow-y-auto rounded-l-2xl p-6 sm:max-w-lg">
        <SheetHeader className="px-0 pb-4">
          <SheetTitle className="text-3xl font-bold">{exampleDrawerConfig.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          <p className="text-lg">Please upload clear photos as shown in the examples below:</p>

          <div className="space-y-4">
            {exampleDrawerConfig.images.map((image) => (
              <div key={image.src} className="rounded-lg border p-4">
                <h3 className="mb-3 text-lg font-bold">{image.label}</h3>
                <div className="relative aspect-video overflow-hidden rounded-lg">
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
