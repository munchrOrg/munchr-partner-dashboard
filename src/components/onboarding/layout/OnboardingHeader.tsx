'use client';

import Image from 'next/image';

export function OnboardingHeader() {
  return (
    <header className="shrink-0 border-b border-red-400 bg-white p-4 sm:p-6 md:p-8">
      <div className="relative h-8 w-32 sm:h-10 sm:w-40">
        <Image
          src="/logo.png"
          alt="munchr partner"
          fill
          priority
          className="object-contain object-left"
        />
      </div>
    </header>
  );
}
